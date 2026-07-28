(function startDecisionObserver() {
  const detector = globalThis.CursorDecisionDetector;
  if (!detector) {
    return;
  }

  const CONTROL_SELECTOR = [
    "button",
    "[role='button']",
    "input[type='button']",
    "input[type='submit']",
    "input[type='radio']",
    "input[type='checkbox']",
    "select"
  ].join(",");
  const GROUP_SELECTOR = [
    "[role='dialog']",
    "[aria-modal='true']",
    "form",
    "[data-testid*='approval' i]",
    "[data-testid*='permission' i]",
    "[data-testid*='question' i]",
    "[class*='approval' i]",
    "[class*='permission' i]"
  ].join(",");
  const REPEAT_AFTER_MS = 5 * 60 * 1000;
  const PERIODIC_SCAN_MS = 15 * 1000;
  const MAX_CONTEXT_LENGTH = 1200;

  let activeFingerprint = null;
  let lastSentAt = 0;
  let debounceTimer = null;

  function isVisible(element) {
    if (!(element instanceof Element)) {
      return false;
    }

    const style = getComputedStyle(element);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      Number(style.opacity) === 0
    ) {
      return false;
    }

    return element.getClientRects().length > 0;
  }

  function controlLabel(element) {
    return (
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.value ||
      element.innerText ||
      element.textContent ||
      ""
    ).trim();
  }

  function controlKind(element) {
    const type = (element.getAttribute("type") || "").toLowerCase();
    if (type === "radio" || type === "checkbox") {
      return type;
    }
    if (element.tagName === "SELECT") {
      return "select";
    }
    return "button";
  }

  function controlsWithin(container) {
    const controls = [];
    if (container.matches?.(CONTROL_SELECTOR)) {
      controls.push(container);
    }
    controls.push(...container.querySelectorAll(CONTROL_SELECTOR));

    return [...new Set(controls)]
      .filter(isVisible)
      .map((element) => ({
        kind: controlKind(element),
        label: controlLabel(element)
      }))
      .filter((control) => control.label);
  }

  function allRoots() {
    const roots = [document];
    const queue = [document];

    while (queue.length > 0) {
      const root = queue.shift();
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) {
          roots.push(element.shadowRoot);
          queue.push(element.shadowRoot);
        }
      }
    }

    return roots;
  }

  function nearestUsefulGroup(control, root) {
    const explicit = control.closest?.(GROUP_SELECTOR);
    if (explicit) {
      return explicit;
    }

    let candidate = control.parentElement;
    for (let depth = 0; candidate && depth < 7; depth += 1) {
      const count = candidate.querySelectorAll(CONTROL_SELECTOR).length;
      const textLength = (candidate.innerText || "").length;
      if (count >= 2 && count <= 10 && textLength <= 3000) {
        return candidate;
      }
      candidate = candidate.parentElement;
    }

    return root instanceof Document ? root.body : root.host;
  }

  function collectGroups() {
    const groupNodes = new Set();

    for (const root of allRoots()) {
      for (const group of root.querySelectorAll(GROUP_SELECTOR)) {
        if (isVisible(group)) {
          groupNodes.add(group);
        }
      }

      for (const control of root.querySelectorAll(CONTROL_SELECTOR)) {
        if (isVisible(control)) {
          const group = nearestUsefulGroup(control, root);
          if (group) {
            groupNodes.add(group);
          }
        }
      }
    }

    return [...groupNodes].map((group) => ({
      isDialog:
        group.getAttribute?.("role") === "dialog" ||
        group.getAttribute?.("aria-modal") === "true",
      context: (group.innerText || group.textContent || "")
        .replace(/\s+/gu, " ")
        .trim()
        .slice(0, MAX_CONTEXT_LENGTH),
      controls: controlsWithin(group)
    }));
  }

  async function sendMessage(message) {
    try {
      await chrome.runtime.sendMessage(message);
    } catch {
      // The extension may have been reloaded while this content script was alive.
    }
  }

  async function scan() {
    const result = detector.detectDecision(collectGroups());
    const now = Date.now();

    if (!result) {
      if (activeFingerprint !== null) {
        activeFingerprint = null;
        lastSentAt = 0;
        await sendMessage({ type: "DECISION_CLEARED" });
      }
      return;
    }

    const changed = result.fingerprint !== activeFingerprint;
    const shouldRepeat = !changed && now - lastSentAt >= REPEAT_AFTER_MS;
    if (!changed && !shouldRepeat) {
      return;
    }

    activeFingerprint = result.fingerprint;
    lastSentAt = now;
    await sendMessage({
      type: "DECISION_REQUIRED",
      title: result.title,
      message: result.message,
      repeat: shouldRepeat
    });
  }

  function scheduleScan() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scan, 250);
  }

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [
      "aria-hidden",
      "aria-label",
      "aria-modal",
      "class",
      "disabled",
      "hidden",
      "role",
      "style"
    ],
    childList: true,
    characterData: true,
    subtree: true
  });

  window.addEventListener("pagehide", () => {
    if (activeFingerprint !== null) {
      sendMessage({ type: "DECISION_CLEARED" });
    }
  });

  setInterval(scan, PERIODIC_SCAN_MS);
  setTimeout(scan, 750);
}());

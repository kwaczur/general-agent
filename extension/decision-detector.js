(function exposeDecisionDetector(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.CursorDecisionDetector = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function createDecisionDetector() {
  const STRONG_ACTION = [
    /\bapprove\b/u,
    /\ballow\b/u,
    /\bconfirm\b/u,
    /\baccept\b/u,
    /\bgrant\b/u,
    /\bzatwierdz\b/u,
    /\bzezwol\b/u,
    /\bpotwierdz\b/u,
    /\bzaakceptuj\b/u
  ];

  const ACTION = [
    /\brun\b/u,
    /\bcontinue\b/u,
    /\bproceed\b/u,
    /\bsubmit\b/u,
    /\bsend\b/u,
    /\bretry\b/u,
    /\byes\b/u,
    /\buruchom\b/u,
    /\bkontynuuj\b/u,
    /\bprzejdz dalej\b/u,
    /\bwyslij\b/u,
    /\bsprobuj ponownie\b/u,
    /\btak\b/u
  ];

  const NEGATIVE_ACTION = [
    /\bcancel\b/u,
    /\bdeny\b/u,
    /\breject\b/u,
    /\bdecline\b/u,
    /\bskip\b/u,
    /\bno\b/u,
    /\banuluj\b/u,
    /\bodmow\b/u,
    /\bodrzuc\b/u,
    /\bpomin\b/u,
    /\bnie\b/u
  ];

  const DECISION_CONTEXT = [
    /\bapproval\b/u,
    /\bpermission\b/u,
    /\brequires? (?:your )?(?:approval|confirmation|input)\b/u,
    /\bwaiting for (?:your )?(?:approval|confirmation|input|answer)\b/u,
    /\bneeds? (?:your )?(?:approval|confirmation|input|answer)\b/u,
    /\bchoose\b/u,
    /\bselect (?:an?|one)\b/u,
    /\bquestion\b/u,
    /\bconfirm\b/u,
    /\bdecision\b/u,
    /\bzgod[ay]\b/u,
    /\bzatwierdzeni/u,
    /\buprawnieni/u,
    /\bwymaga (?:twojej )?(?:zgody|decyzji|odpowiedzi)\b/u,
    /\boczekuje na (?:twoja )?(?:zgode|decyzje|odpowiedz)\b/u,
    /\bwybierz\b/u,
    /\bpytani/u,
    /\bdecyzj/u,
    /\bpotwierdz/u
  ];

  function normalize(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/gu, "")
      .replace(/\s+/gu, " ")
      .trim()
      .toLocaleLowerCase("en");
  }

  function matchesAny(value, patterns) {
    const normalized = normalize(value);
    return patterns.some((pattern) => pattern.test(normalized));
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function analyzeGroup(group) {
    const controls = Array.isArray(group.controls) ? group.controls : [];
    const labels = controls.map((control) => normalize(control.label));
    const strong = labels.filter((label) => matchesAny(label, STRONG_ACTION));
    const positive = labels.filter((label) => matchesAny(label, ACTION));
    const negative = labels.filter((label) => matchesAny(label, NEGATIVE_ACTION));
    const choices = controls.filter((control) =>
      control.kind === "radio" ||
      control.kind === "checkbox" ||
      control.kind === "select"
    );
    const hasDecisionContext = matchesAny(group.context, DECISION_CONTEXT);

    let score = 0;
    if (strong.length > 0) score += 6;
    if (positive.length > 0) score += 2;
    if (negative.length > 0) score += 1;
    if (hasDecisionContext) score += 3;
    if (choices.length >= 2) score += 2;
    if (group.isDialog) score += 1;

    const pairedActions =
      (strong.length > 0 || positive.length > 0) && negative.length > 0;
    if (pairedActions) score += 2;
    const isQuestion =
      hasDecisionContext &&
      choices.length >= 2 &&
      (strong.length > 0 || positive.length > 0);
    const isApproval =
      strong.length > 0 ||
      (pairedActions && (hasDecisionContext || group.isDialog));

    if (score < 6 || (!isApproval && !isQuestion)) {
      return null;
    }

    const actionLabels = unique([...strong, ...positive, ...negative])
      .slice(0, 3);
    const fingerprintParts = [
      isQuestion ? "question" : "approval",
      ...actionLabels.sort()
    ];

    return {
      reason: isQuestion ? "question" : "approval",
      score,
      title: "Cursor czeka na decyzję",
      message: isQuestion
        ? "Agent zadał pytanie. Kliknij powiadomienie, aby odpowiedzieć."
        : actionLabels.length > 0
          ? `Wymagana jest akcja w Cursor: ${actionLabels.join(" / ")}.`
          : "Wymagane jest zatwierdzenie w Cursor.",
      fingerprint: fingerprintParts.join("|")
    };
  }

  function detectDecision(groups) {
    if (!Array.isArray(groups)) {
      return null;
    }

    return groups
      .map(analyzeGroup)
      .filter(Boolean)
      .sort((left, right) => right.score - left.score)[0] || null;
  }

  return {
    analyzeGroup,
    detectDecision,
    normalize
  };
}));

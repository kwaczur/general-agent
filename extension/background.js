const NOTIFICATION_PREFIX = "cursor-decision-";
const ICON_URL = chrome.runtime.getURL("icons/notification.svg");

function notificationId(tabId) {
  return `${NOTIFICATION_PREFIX}${tabId}`;
}

async function showDecisionNotification(message, sender) {
  const tabId = sender.tab?.id;
  if (typeof tabId !== "number") {
    return;
  }

  const id = notificationId(tabId);
  if (message.repeat) {
    await chrome.notifications.clear(id);
  }

  await chrome.notifications.create(id, {
    type: "basic",
    iconUrl: ICON_URL,
    title: message.title || "Cursor czeka na decyzję",
    message: message.message || "Otwórz Cursor, aby agent mógł kontynuować.",
    contextMessage: sender.tab?.title || "Cursor Agent",
    priority: 2,
    requireInteraction: true
  });

  await chrome.action.setBadgeBackgroundColor({
    color: "#F59E0B",
    tabId
  });
  await chrome.action.setBadgeText({
    text: "!",
    tabId
  });
  await chrome.action.setTitle({
    title: "Agent Cursor czeka na Twoją decyzję",
    tabId
  });
}

async function clearDecisionNotification(sender) {
  const tabId = sender.tab?.id;
  if (typeof tabId !== "number") {
    return;
  }

  await chrome.notifications.clear(notificationId(tabId));
  await chrome.action.setBadgeText({ text: "", tabId });
  await chrome.action.setTitle({
    title: "Cursor Decision Notifier",
    tabId
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "DECISION_REQUIRED") {
    showDecisionNotification(message, sender)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "DECISION_CLEARED") {
    clearDecisionNotification(sender)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "TEST_NOTIFICATION") {
    chrome.notifications.create("cursor-decision-test", {
      type: "basic",
      iconUrl: ICON_URL,
      title: "Powiadomienia działają",
      message: "Cursor Decision Notifier jest poprawnie skonfigurowany.",
      priority: 1
    }).then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return false;
});

chrome.notifications.onClicked.addListener(async (id) => {
  if (id === "cursor-decision-test") {
    await chrome.notifications.clear(id);
    return;
  }

  if (!id.startsWith(NOTIFICATION_PREFIX)) {
    return;
  }

  const tabId = Number(id.slice(NOTIFICATION_PREFIX.length));
  if (!Number.isInteger(tabId)) {
    return;
  }

  try {
    const tab = await chrome.tabs.get(tabId);
    if (typeof tab.windowId === "number") {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
    await chrome.tabs.update(tabId, { active: true });
  } catch {
    await chrome.notifications.clear(id);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.notifications.clear(notificationId(tabId));
});

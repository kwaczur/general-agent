const test = require("node:test");
const assert = require("node:assert/strict");

const {
  analyzeGroup,
  detectDecision,
  normalize
} = require("../extension/decision-detector.js");

test("detects an explicit approval action", () => {
  const result = analyzeGroup({
    context: "This command requires your approval",
    controls: [
      { kind: "button", label: "Allow" },
      { kind: "button", label: "Deny" }
    ],
    isDialog: true
  });

  assert.equal(result.reason, "approval");
  assert.match(result.message, /allow/u);
});

test("detects a run/cancel confirmation dialog", () => {
  const result = analyzeGroup({
    context: "npm run deploy",
    controls: [
      { kind: "button", label: "Run" },
      { kind: "button", label: "Cancel" }
    ],
    isDialog: true
  });

  assert.equal(result.reason, "approval");
});

test("detects a multiple-choice agent question", () => {
  const result = analyzeGroup({
    context: "Choose one option before the agent continues",
    controls: [
      { kind: "radio", label: "PostgreSQL" },
      { kind: "radio", label: "SQLite" },
      { kind: "button", label: "Continue" }
    ],
    isDialog: false
  });

  assert.equal(result.reason, "question");
});

test("supports Polish decision labels without diacritics", () => {
  const result = analyzeGroup({
    context: "Ta operacja wymaga Twojej zgody",
    controls: [
      { kind: "button", label: "Zatwierdź" },
      { kind: "button", label: "Odrzuć" }
    ],
    isDialog: true
  });

  assert.equal(result.reason, "approval");
  assert.equal(normalize("ZATWIERDŹ"), "zatwierdz");
});

test("ignores ordinary controls without decision context", () => {
  const result = analyzeGroup({
    context: "Edit profile",
    controls: [
      { kind: "button", label: "Save" },
      { kind: "button", label: "Cancel" }
    ],
    isDialog: true
  });

  assert.equal(result, null);
});

test("returns the highest-confidence decision group", () => {
  const result = detectDecision([
    {
      context: "Navigation",
      controls: [{ kind: "button", label: "Run" }],
      isDialog: false
    },
    {
      context: "Permission required",
      controls: [
        { kind: "button", label: "Approve" },
        { kind: "button", label: "Reject" }
      ],
      isDialog: true
    }
  ]);

  assert.equal(result.reason, "approval");
  assert.match(result.fingerprint, /approve/u);
});

test("handles invalid detector input", () => {
  assert.equal(detectDecision(null), null);
  assert.equal(detectDecision([]), null);
});

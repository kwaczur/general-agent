const testButton = document.querySelector("#test");
const result = document.querySelector("#result");

testButton.addEventListener("click", async () => {
  testButton.disabled = true;
  result.textContent = "";

  try {
    const response = await chrome.runtime.sendMessage({
      type: "TEST_NOTIFICATION"
    });
    result.textContent = response?.ok
      ? "Wysłano. Sprawdź Centrum powiadomień."
      : "Nie udało się wysłać powiadomienia.";
  } catch {
    result.textContent = "Nie udało się połączyć z rozszerzeniem.";
  } finally {
    testButton.disabled = false;
  }
});

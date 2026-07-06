const input = document.getElementById("input");
const generateButton = document.getElementById("generate");
const statusBox = document.getElementById("status");

generateButton.addEventListener("click", async () => {
  const scriptText = input.value.trim();

  if (!scriptText) {
    statusBox.textContent = "Paste some block script first.";
    return;
  }

  statusBox.textContent = "Sending to App Inventor...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.id) {
    statusBox.textContent = "Could not find active tab.";
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    {
      type: "AI2BLOCKS_GENERATE",
      scriptText
    },
    (response) => {
      if (chrome.runtime.lastError) {
        statusBox.textContent = "Open MIT App Inventor first.";
        return;
      }

      if (response?.ok) {
        statusBox.textContent = "Message sent successfully.";
      } else {
        statusBox.textContent = response?.error || "Something went wrong.";
      }
    }
  );
});
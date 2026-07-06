const fileInput = document.getElementById("fileInput");
const input = document.getElementById("input");
const generateButton = document.getElementById("generate");
const statusBox = document.getElementById("status");

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];

  if (!file) return;

  input.value = await file.text();
  statusBox.textContent = `Loaded ${file.name}`;
});

generateButton.addEventListener("click", async () => {
  let xmlText = input.value.trim();

  if (!xmlText.startsWith("<xml")) {
    try {
      xmlText = scriptToXml(xmlText);
    } catch (error) {
      statusBox.textContent = error.message;
      return;
    }
  }

  if (!xmlText) {
    statusBox.textContent = "Choose or paste an XML file first.";
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(
    tab.id,
    {
      type: "AI2BLOCKS_GENERATE",
      scriptText: xmlText
    },
    (response) => {
      if (chrome.runtime.lastError) {
        statusBox.textContent = "Open MIT App Inventor first.";
        return;
      }

      statusBox.textContent = response?.ok
        ? "XML sent to App Inventor."
        : response?.error || "Import failed.";
    }
  );
});
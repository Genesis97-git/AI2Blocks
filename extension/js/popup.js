const fileInput = document.getElementById("fileInput");
const input = document.getElementById("input");
const generateButton = document.getElementById("generate");
const statusBox = document.getElementById("status");
const inspectButton = document.getElementById("inspect");

fileInput?.addEventListener("change", async () => {
  const file = fileInput.files?.[0];

  if (!file) return;

  try {
    input.value = await file.text();
    statusBox.textContent = `Loaded ${file.name}`;
  } catch (error) {
    statusBox.textContent = `Could not read file: ${error.message}`;
  }
});

generateButton.addEventListener("click", async () => {
  const sourceText = input.value.trim();

  if (!sourceText) {
    statusBox.textContent = "Paste AI2Blocks code first.";
    return;
  }

  statusBox.textContent = "Generating blocks...";
  generateButton.disabled = true;

  try {
    let xmlText = sourceText;

    // Keep raw XML support for advanced use.
    if (!xmlText.startsWith("<xml")) {
      xmlText = scriptToXml(xmlText);
    }

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) {
      statusBox.textContent = "Could not find the active browser tab.";
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "AI2BLOCKS_GENERATE",
      scriptText: xmlText
    });

    statusBox.textContent = response?.ok
      ? "Blocks generated successfully."
      : response?.error || "Could not generate blocks.";
  } catch (error) {
    if (
      error.message?.includes("Receiving end does not exist") ||
      error.message?.includes("Could not establish connection")
    ) {
      statusBox.textContent = "Open MIT App Inventor first.";
    } else {
      statusBox.textContent = error.message || "Could not generate blocks.";
    }
  } finally {
    generateButton.disabled = false;
  }
});

inspectButton.addEventListener("click", async () => {
  statusBox.textContent = "Inspecting selected block...";
  inspectButton.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) {
      statusBox.textContent = "Could not find the active browser tab.";
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "AI2BLOCKS_INSPECT_BLOCK"
    });

    statusBox.textContent = response?.ok
      ? "Block inspection completed."
      : response?.error || "Inspection failed.";
  } catch (error) {
    if (
      error.message?.includes("Receiving end does not exist") ||
      error.message?.includes("Could not establish connection")
    ) {
      statusBox.textContent = "Open MIT App Inventor first.";
    } else {
      statusBox.textContent = error.message || "Inspection failed.";
    }
  } finally {
    inspectButton.disabled = false;
  }
});
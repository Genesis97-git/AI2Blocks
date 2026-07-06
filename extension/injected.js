console.log("[AI2Blocks] Injected script loaded");

function importXml(xmlText) {
  const ws = Blockly.getMainWorkspace();

  const xml = new DOMParser()
    .parseFromString(xmlText, "text/xml")
    .documentElement;

  Blockly.Xml.domToWorkspace(xml, ws);
}

window.AI2Blocks = {
  generate(xmlText) {
    console.log("[AI2Blocks] Importing XML...");
    importXml(xmlText);
  }
};

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const message = event.data;

  if (message.type !== "AI2BLOCKS_GENERATE_FROM_EXTENSION") {
    return;
  }

  window.AI2Blocks.generate(message.scriptText);
});
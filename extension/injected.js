console.log("[AI2Blocks] Injected script loaded");

function importXml(xmlText) {
  const ws = Blockly.getMainWorkspace();

  const xml = new DOMParser()
    .parseFromString(xmlText, "text/xml")
    .documentElement;

  Blockly.Xml.domToWorkspace(xml, ws);
}

function getSelectedBlocks() {
  const selected = Blockly.getSelected();

  if (!selected) {
    const fallback = Blockly.getMainWorkspace().getTopBlocks(false)[0];
    return fallback ? [fallback] : [];
  }

  if (selected.subDraggables instanceof Map) {
    return Array.from(selected.subDraggables.keys())
      .filter(block => block && block.type);
  }

  return selected.type ? [selected] : [];
}

function inspectBlock(block) {
  return {
    type: block.type,
    blockType: block.blockType,
    typeName: block.typeName,
    instanceName: block.instanceName,
    propertyName: block.propertyName,
    methodName: block.methodName,
    eventName: block.eventName,
    mutation: block.mutationToDom
      ? Blockly.Xml.domToText(block.mutationToDom())
      : null,
    xml: Blockly.Xml.domToPrettyText(
      Blockly.Xml.blockToDom(block)
    )
  };
}

function inspectSelectedBlock() {
  const blocks = getSelectedBlocks();

  if (blocks.length === 0) {
    console.warn("[AI2Blocks] No block found to inspect.");
    return;
  }

  const result = blocks.length === 1
  ? inspectBlock(blocks[0])
  : blocks.map((block, index) => ({
      index,
      ...inspectBlock(block)
    }));

  const json = JSON.stringify(result, null, 2);

  console.group("[AI2Blocks] Block Inspection");
  console.log(result);
  console.log("Copy/paste JSON:");
  console.log(json);
  console.groupEnd();
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

  if (message.type === "AI2BLOCKS_GENERATE_FROM_EXTENSION") {
    window.AI2Blocks.generate(message.scriptText);
    return;
  }

  if (message.type === "AI2BLOCKS_INSPECT_BLOCK_FROM_EXTENSION") {
    inspectSelectedBlock();
    return;
  }
});
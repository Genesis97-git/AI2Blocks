console.log("[AI2Blocks] Injected script loaded");

window.AI2Blocks = {
  generate(scriptText) {
    console.log("[AI2Blocks] Generating blocks from:");
    console.log(scriptText);

    // TODO: call parser here
    const ws = Blockly.getMainWorkspace();

	const b = ws.newBlock("text");
	b.initSvg();
	b.render();
	b.moveBy(100, 100);
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
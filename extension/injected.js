window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const message = event.data;

  if (message.type !== "AI2BLOCKS_GENERATE_FROM_EXTENSION") {
    return;
  }

  console.log("[AI2Blocks] Received script:");
  console.log(message.scriptText);

  alert("AI2Blocks received script. Check console.");
});
function injectScriptFile(file) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(file);
  script.onload = () => script.remove();
  document.documentElement.appendChild(script);
}

injectScriptFile("injected.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "AI2BLOCKS_GENERATE") {
    return;
  }

  window.postMessage(
    {
      type: "AI2BLOCKS_GENERATE_FROM_EXTENSION",
      scriptText: message.scriptText
    },
    "*"
  );

  sendResponse({ ok: true });
});
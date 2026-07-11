function injectScriptFile(file) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(file);
  script.onload = () => script.remove();
  document.documentElement.appendChild(script);
}

injectScriptFile("js/injected.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  switch (message.type) {

    case "AI2BLOCKS_GENERATE":
      window.postMessage(
        {
          type: "AI2BLOCKS_GENERATE_FROM_EXTENSION",
          scriptText: message.scriptText
        },
        "*"
      );
      sendResponse({ ok: true });
      break;

    case "AI2BLOCKS_INSPECT_BLOCK":
      window.postMessage(
        {
          type: "AI2BLOCKS_INSPECT_BLOCK_FROM_EXTENSION"
        },
        "*"
      );
      sendResponse({ ok: true });
      break;

    default:
      sendResponse({ ok: false, error: "Unknown message type." });
  }

});
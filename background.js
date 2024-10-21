chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith("chrome://")) {
    console.error("Cannot capture screenshot of chrome:// URLs");
    return;
  }

  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
    const filename = `screenshot_${timestamp}.png`;

    chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Error saving screenshot:", chrome.runtime.lastError);
      } else {
        console.log("Screenshot saved with ID:", downloadId);
      }
    });
  });
});

console.log("Background script loaded");

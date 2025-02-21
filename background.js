// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  // Chrome security prevents screenshots of internal pages
  if (tab.url.startsWith("chrome://")) {
    // Show error to user with an X badge
    chrome.action.setBadgeText({ text: "❌" });
    // Remove the error badge after 2 seconds
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2000);
    return;
  }

  // Take a high quality screenshot of the visible tab area
  chrome.tabs.captureVisibleTab(null, { format: "png", quality: 100 }, (dataUrl) => {
    // Handle any errors during capture
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    // Create a filename with current date/time
    // Example: screenshot_2024-03-20-14-30-45.png
    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
    const filename = `screenshot_${timestamp}.png`;

    // Save the screenshot to Downloads folder
    chrome.downloads.download({
      url: dataUrl,          // The image data
      filename: filename,     // Where to save it
      saveAs: false          // Don't show save dialog
    }, (downloadId) => {
      // Log success or failure of the download
      if (chrome.runtime.lastError) {
        console.error("Error saving screenshot:", chrome.runtime.lastError);
      } else {
        // Show success message
        chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });  // Green color
        chrome.action.setBadgeText({ text: "✓" });
        setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2000);
        console.log("Screenshot saved with ID:", downloadId);
      }
    });
  });
});

// Confirm the background script is running
console.log("Background script loaded");

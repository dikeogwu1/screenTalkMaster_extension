// //chrome

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./content.js"],
      })
      .then(() => {
        console.log("we have injected the content script");
      })
      .catch((err) => console.log(err, "error in background script line 10"));
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "background") {
    switch (message.type) {
      case "start-recording":
        const existingContexts = await chrome.runtime.getContexts({});
        let recording = false;

        const offscreenDocument = existingContexts.find(
          (c) => c.contextType === "OFFSCREEN_DOCUMENT"
        );

        // If an offscreen document is not already open, create one.
        if (!offscreenDocument) {
          // Create an offscreen document.
          await chrome.offscreen.createDocument({
            url: "offscreen.html",
            reasons: ["USER_MEDIA"],
            justification: "Recording from chrome.tabCapture API",
          });
          console.log("created");
        } else {
          recording = offscreenDocument.documentUrl.endsWith("#recording");
        }

        if (recording) {
          chrome.runtime.sendMessage({
            type: "stop-recording",
            target: "offscreen",
          });
          return;
        }

        const getTab = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const tab = getTab[0];
        console.log(tab);

        // Get a MediaStream for the active tab.
        const streamId = await chrome.tabCapture.getMediaStreamId({
          targetTabId: tab.id,
        });

        // Send the stream ID to the offscreen document to start recording.
        chrome.runtime.sendMessage({
          type: "start-recording",
          target: "offscreen",
          data: streamId,
        });

        break;
      case "stop-recording":
        // stopRecording();
        console.log("bg");
        break;
      default:
        throw new Error("Unrecognized message:", message.type);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // GET THE SELECTORS OF THE BUTTONS
  const startVideoButton = document.querySelector(
    "button#start-recording-button"
  );
  const stopVideoButton = document.querySelector("button#camera-switch");
  const btns = document.querySelectorAll(".switch-btn");
  const controlsBox = document.querySelector(".recorder_box");

  // adding event listeners

  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!btn.classList.contains("slide")) {
        btn.classList.add("slide");
      } else {
        btn.classList.remove("slide");
      }
    });
  });

  startVideoButton.addEventListener("click", () => {
    // sendMessage
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "request_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "error line 14");
          }
        }
      );
    });
  });

  stopVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "stopvideo" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "error line 27");
          }
        }
      );
    });
  });
});

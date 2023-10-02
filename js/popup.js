document.addEventListener("DOMContentLoaded", () => {
  // GET THE SELECTORS OF THE BUTTONS
  const startVideoButton = document.querySelector(
    "button#start-recording-button"
  );
  const stopVideoButton = document.querySelector("button#camera-switch");
  const btns = document.querySelectorAll(".switch-btn");
  const controlsBox = document.querySelector(".recorder_box");

  // adding event listeners
  let camera = true;
  let audio = true;

  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!btn.classList.contains("slide")) {
        btn.classList.add("slide");
      } else {
        btn.classList.remove("slide");
      }
    });
  });

  function sendMsg(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: msg }, function (response) {
        if (!chrome.runtime.lastError) {
          console.log(response);
        } else {
          console.log(chrome.runtime.lastError);
        }
      });
    });
  }

  btns[0].addEventListener("click", () => {
    if (!camera) {
      camera = true;
    } else {
      camera = false;
    }
  });

  btns[1].addEventListener("click", () => {
    if (!audio) {
      audio = true;
    } else {
      audio = false;
    }
  });

  startVideoButton.addEventListener("click", () => {
    if (!camera && !audio) {
      sendMsg("share_only_screen");
    } else if (!camera && audio) {
      sendMsg("audio_recording");
    } else {
      sendMsg("video_recording");
    }
  });
  // end of DOMContentLoaded
});

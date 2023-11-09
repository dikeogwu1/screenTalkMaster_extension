document.addEventListener("DOMContentLoaded", () => {
  // GET THE BUTTONS
  const startVideoButton = document.querySelector(
    "button#start-recording-button"
  );
  const stopVideoButton = document.querySelector("button#camera-switch");
  const btns = document.querySelectorAll(".switch-btn");
  const switcher = document.querySelectorAll(".switch");

  // store permissions in localStorage
  const permissions = localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [true, true];
  let camera = permissions[0];
  let audio = permissions[1];

  if (!camera) {
    switcher[0].style.right = "50%";
  } else {
    switcher[0].style.right = "0";
  }
  if (!audio) {
    switcher[1].style.right = "50%";
  } else {
    switcher[1].style.right = "0";
  }

  // Function to send message to tab
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

  // Switch off camera
  btns[0].addEventListener("click", (e) => {
    if (camera) {
      camera = false;
      switcher[0].style.right = "50%";
      permissions[0] = camera;
      localStorage.setItem("permissions", JSON.stringify(permissions));
    } else {
      camera = true;
      switcher[0].style.right = "0";
      permissions[0] = camera;
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
  });

  // Switch off audio
  btns[1].addEventListener("click", (e) => {
    if (audio) {
      audio = false;
      switcher[1].style.right = "50%";
      permissions[1] = audio;
      localStorage.setItem("permissions", JSON.stringify(permissions));
    } else {
      audio = true;
      switcher[1].style.right = "0";
      permissions[1] = audio;
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
  });

  // Send message to start recording
  startVideoButton.addEventListener("click", () => {
    if (!camera && !audio) {
      alert("You're about to record without camera and Mic");
      sendMsg("shareScreenWithCameraAndMicOff");
      return;
    }
    if (!camera && audio) {
      sendMsg("shareScreenWithCameraOff");
      return;
    }
    if (camera && !audio) {
      sendMsg("shareScreenWithMicOff");
      return;
    }
    if (camera && audio) {
      sendMsg("shareScreenWithCameraAndMicOn");
    }
  });
  // end of DOMContentLoaded
});

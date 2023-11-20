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

  let recorder;
  let data = [];

  // Function to send message to tab
  function sendMsg(msg, data) {
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

  async function startRecording() {
    if (recorder?.state === "recording") {
      throw new Error("Called startRecording while recording is in progress.");
    }

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTabId = tabs[0].id;

    // Get a MediaStream for the active tab.
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: activeTabId,
    });

    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
    });

    // Continue to play the captured audio to the user.
    const output = new AudioContext();
    const source = output.createMediaStreamSource(media);
    source.connect(output.destination);

    // Start recording.
    recorder = new MediaRecorder(media, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(data, { type: "video/webm" });
      window.open(URL.createObjectURL(blob), "_blank");

      // Clear state ready for next recording
      recorder = undefined;
      data = [];
    };
    recorder.start();

    window.location.hash = "recording";
  }

  // Send message to start recording
  startVideoButton.addEventListener("click", () => {
    // startRecording();

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

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "offscreen") {
    switch (message.type) {
      case "start-recording":
        startRecording(message.data);
        break;
      case "stop-recording":
        stopRecording();
        break;
      case "pause-recording":
        pauseRecording();
        break;
      case "resume-recording":
        resumeRecording();
        break;
      case "delete-recording":
        deleteRecording();
        break;
      default:
        throw new Error("Unrecognized message:", message.type);
    }
  }
});

let recorder;
let deleted;
let data = [];

const hex = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
];
function getRandomNumber() {
  return Math.floor(Math.random() * hex.length);
}

async function startRecording(streamId) {
  if (recorder?.state === "recording") {
    throw new Error("Called startRecording while recording is in progress.");
  }

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

  // Pause recording
  recorder.onpause = () => {
    videoTrack.enabled = false;
  };

  // Resume recording
  recorder.onresume = () => {
    videoTrack.enabled = true;
  };

  // When data is ready
  recorder.ondataavailable = (event) => data.push(event.data);

  // Stop recording
  recorder.onstop = () => {
    if (deleted) {
      recorder = undefined;
      data = [];
      return;
    }

    const blob = new Blob(data, { type: "video/webm" });
    // generate name
    let videoName = "st-";
    for (let i = 0; i < 6; i++) {
      videoName += hex[getRandomNumber()];
    }
    // Create FormData
    const formData = new FormData();
    formData.append("video", blob, `${videoName}.webm`);

    const postToServer = async () => {
      chrome.runtime.sendMessage({ action: "show-please-wait" });

      try {
        const response = await fetch(
          "https://helpmeout-chrome-extension-server.onrender.com/api/v1/createVideo",
          {
            method: "POST",
            body: formData,
          }
        );

        chrome.runtime.sendMessage({ action: "hide-please-wait" });
        const data = await response.json();

        setTimeout(() => {
          if (data.msg) {
            alert(data.msg);
          } else {
            const jsonString = JSON.stringify(data);
            window.open(
              `https://screentalkmaster.netlify.app/ready/${btoa(jsonString)}`
            );
          }
        }, 1000);
      } catch (error) {
        chrome.runtime.sendMessage({ action: "hide-please-wait" });
        setTimeout(() => {
          alert("error uploading video");
        }, 500);
      }
    };
    postToServer();

    // Clear state ready for next recording
    recorder = undefined;
    data = [];
  };

  recorder.start();

  window.location.hash = "recording";
  chrome.runtime.sendMessage({
    type: "close-popup",
    target: "popup",
  });
}

async function stopRecording() {
  recorder.stop();

  recorder.stream.getTracks().forEach((t) => t.stop());

  // Update current state in URL
  window.location.hash = "";
}

async function pauseRecording() {
  recorder.pause();
}

async function resumeRecording() {
  recorder.resume();
}

async function deleteRecording() {
  deleted = true;
  recorder.stop();
  recorder.stream.getTracks().forEach((t) => t.stop());
  // Update current state in URL
  window.location.hash = "";
}

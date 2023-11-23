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
    // Create FormData
    const formData = new FormData();
    formData.append("video", blob, "recorded-video.webm");

    fetch(
      "https://helpmeout-chrome-extension-server.onrender.com/api/v1/createVideo",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the server response as needed
        alert(`We're redirecting you to the video page`);
        const jsonString = JSON.stringify(data);
        window.open(
          `https://screentalkmaster.netlify.app/ready/${btoa(jsonString)}`
        );
        setTimeout(() => {
          location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
      });

    // Clear state ready for next recording
    recorder = undefined;
    data = [];
  };

  recorder.start();

  window.location.hash = "recording";
}

async function stopRecording() {
  recorder.stop();

  recorder.stream.getTracks().forEach((t) => t.stop());

  // Update current state in URL
  window.location.hash = "";

  // Note: In a real extension, you would want to write the recording to a more
  // permanent location (e.g IndexedDB) and then close the offscreen document,
  // to avoid keeping a document around unnecessarily. Here we avoid that to
  // make sure the browser keeps the Object URL we create (see above) and to
  // keep the sample fairly simple to follow.
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

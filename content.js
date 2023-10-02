let recordingTimerInterval;
let recordingTime = 0;
let isRecording = false;
var shareScreen = null;
var videoRecorder = null;
var audioRecorder = null;

const recordingControls = document.createElement("div");
recordingControls.id = "recording-controls";
recordingControls.style.display = "flex";
recordingControls.style.position = "fixed";
recordingControls.style.bottom = "60px";
recordingControls.style.left = "20px";
recordingControls.style.width = "fit-content";
document.body.appendChild(recordingControls);

// Function to create and display audio recording controls
function createAudioRecordingControls() {
  const firstChild = document.createElement("div");
  firstChild.innerHTML = `<aside
      class="recorder_container"
      style="
        display: flex;
        padding: 0.5rem;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        border-radius: 12.5rem;
        background: rgba(98, 98, 98, 0.17);
        width: fit-content;
      "
    >
      <div
        class="recorder"
        style="
          display: flex;
          padding: 0.75rem 2.5rem;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          border-radius: 12.5rem;
          background: #141414;
        "
      >
        <div
          class="timer_box"
          style="display: flex; align-items: center; gap: 0.81rem"
        >
          <strong
            id="timer"
            style="
              color: #fff;
              font-family: Inter, sans-serif;
              font-size: 1.25rem;
              font-weight: 500;
            "
            >00:00:00</strong
          >
          <div
            class="sign"
            style="
              width: 0.625rem;
              height: 0.625rem;
              border-radius: 1.0625rem;
              background: #c00404;
              border-radius: 50%;
            "
          ></div>
        </div>
        <div
          class="divider"
          style="width: 0.0625rem; height: 3rem; background: #e8e8e8"
        ></div>
        <button class="control pause" style="background: transparent; border: none">
          <div
            id="pause"
            style="
              display: flex;
              cursor: pointer;
              gap: 0.5rem;
              width: 1.5rem;
              height: 1.5rem;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 0.5rem;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/Line_23_wvwxjf.svg"
              alt="line"
            />
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/Line_23_wvwxjf.svg"
              alt="line"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 0.75rem;
              font-weight: 500;
            "
            >Pause</strong
          >
        </button>
        <button class="control stop" style="background: transparent; border: none">
          <div
            style="
              display: grid;
              width: 1.5rem;
              height: 1.5rem;
              cursor: pointer;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 0.5rem;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/stop_a43eip.svg"
              alt="stop"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 0.75rem;
              font-weight: 500;
            "
            >Stop</strong
          >
        </button>
        <button class="control" style="background: transparent; border: none">
          <div
            style="
              display: grid;
              width: 1.5rem;
              height: 1.5rem;
              cursor: pointer;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 0.5rem;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/video-camera_uc4wcw.svg"
              alt="camera"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 0.75rem;
              font-weight: 500;
            "
            >Camera</strong
          >
        </button>
        <button class="control" style="background: transparent; border: none">
          <div
            style="
              display: grid;
              width: 1.5rem;
              height: 1.5rem;
              cursor: pointer;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 0.5rem;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/microphone_cthllc.svg"
              alt="microphone"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 0.75rem;
              font-weight: 500;
            "
            >Mic</strong
          >
        </button>
        <button
          class="control delete"
          style="background: transparent; border: none"
        >
          <div
            style="
              display: grid;
              width: 1.5rem;
              height: 1.5rem;
              padding: 0.625rem;
              cursor: pointer;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 1.25rem;
            "
          >
            <img
            src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094902/Icons/delete_icon_hsirly.svg"
            alt="delete"
            />
            </div>
            </button>
            </div>
            </aside>`;
  recordingControls.appendChild(firstChild);

  const pauseBtn = recordingControls.querySelector(".pause");
  const stopBtn = recordingControls.querySelector(".stop");
  const deletBtn = recordingControls.querySelector(".delete");
  pauseBtn.addEventListener("click", pauseRecording);
  stopBtn.addEventListener("click", stopRecording);
  deletBtn.addEventListener("click", stopRecording);
}

// Function to create and display video recording
function videoView(stream) {
  // Create a video element
  const videoElement = document.createElement("video");
  videoElement.autoplay = "true";
  videoElement.playsInline = "true";
  videoElement.style.display = "block";
  videoElement.style.width = "120px";
  videoElement.style.height = "120px";
  videoElement.style.borderRadius = "50%";
  videoElement.style.border = "2px solid #141414";
  videoElement.style.overflow = "hidden";
  videoElement.style.objectFit = "cover";
  videoElement.srcObject = stream;
  recordingControls.appendChild(videoElement);
}

// Function to update the recording timer
function updateRecordingTimer() {
  recordingTime++;
  const hours = Math.floor(recordingTime / (60 * 60));
  const minutes = Math.floor(recordingTime / 60);
  const seconds = recordingTime % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Function to start recording audio
function startRecordingSelfInAudio() {
  createAudioRecordingControls();
  recordingTimerInterval = setInterval(updateRecordingTimer, 1000);
}

// Function to pause audio recording
function pauseRecording() {
  audioRecorder.pause();
  videoRecorder.puase();
  clearInterval(recordingTimerInterval);
}
// Function to stop audio recording
function stopRecording() {
  audioRecorder.stop();
  videoRecorder.stop();
  shareScreen.stop();
  recordingTime = 0;
  clearInterval(recordingTimerInterval);
  // Remove the recording controls from the screen
  const recordingControls = document.querySelector("#recording-controls");
  recordingControls.remove();
}

function postVideoLinkToServer(url) {
  // Define the URL where you want to send the POST request
  const destination =
    "https://helpmeout-chrome-extension-server.onrender.com/api/v1/createVide";

  // Define the data you want to send in the request body as an object
  const data = {
    name: "video link",
    video: url,
    ip: "44228391",
  };

  fetch(destination, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      // Handle the response data
      alert("Your video has been saved successfully");
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      alert("Your video was not saved");
    });
}

// ***** ON SCREEN SHARING ACCESS APPROVED *****
function onScreanRecordingAccessApproved(stream) {
  shareScreen = new MediaRecorder(stream);
  shareScreen.start();

  shareScreen.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  shareScreen.ondataavailable = function (event) {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    stopRecording();
    postVideoLinkToServer(url);

    URL.revokeObjectURL(url);
  };
}

// ***** ON VIDEO RECORDING ACCESS APPROVED *****
function initializeVideoRecorder(stream) {
  videoRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  videoRecorder.start();

  videoRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      // Handle the recorded data as needed
      console.log("Data available:", event.data);
    }
  };

  videoRecorder.onpause = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
  videoRecorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
}
// ***** ON AUDIO RECORDING ACCESS APPROVED *****
function initializeAudioRecorder(stream) {
  audioRecorder = new MediaRecorder(stream);
  audioRecorder.start();

  audioRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      // Handle the recorded data as needed
      console.log("Data available:", event.data);
    }
  };

  audioRecorder.onpause = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
  audioRecorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // media recording
  if (message.action === "share_only_screen") {
    sendResponse(`processed: ${message.action}`);
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        onScreanRecordingAccessApproved(stream);
      });

    return;
  }
  if (message.action === "video_recording") {
    sendResponse(`processed: ${message.action}`);
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        onScreanRecordingAccessApproved(stream);

        // start media recording
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            mediaStream = stream;
            videoView(stream);
            startRecordingSelfInAudio();
            initializeAudioRecorder(stream);
            initializeVideoRecorder(stream);
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error);
          });
      });

    return;
  }

  if (message.action === "audio_recording") {
    sendResponse(`processed: ${message.action}`);
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        onScreanRecordingAccessApproved(stream);

        // start media recording
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            mediaStream = stream;
            startRecordingSelfInAudio();
            initializeAudioRecorder(stream);
            initializeVideoRecorder(stream);
          });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }
});

let recordingTimerInterval;
let recordingTime = 0;
let isRecording = true;
let destination;
var shareScreen = null;
var videoRecorder = null;
var audioRecorder = null;

const recordingControls = document.createElement("div");
recordingControls.id = "recording-controls";
recordingControls.style.display = "flex";
recordingControls.style.alignItems = "center";
recordingControls.style.position = "fixed";
recordingControls.style.bottom = "60px";
recordingControls.style.left = "20px";
recordingControls.style.width = "fit-content";
recordingControls.style.zIndex = "999999";
recordingControls.style.cursor = "move";
document.body.appendChild(recordingControls);

// DRAG AND DROP FUTURE
let isDragging = false;
let initialX, initialY;
recordingControls.addEventListener("mousedown", (e) => {
  isDragging = true;
  initialX = e.clientX - recordingControls.getBoundingClientRect().left;
  initialY = e.clientY - recordingControls.getBoundingClientRect().top;
  recordingControls.style.zIndex = 100; // Bring the controls to the front
  recordingControls.style.cursor = "grabbing"; // Change cursor style
});

// add mousemove event listener
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const newX = e.clientX - initialX;
  const newY = e.clientY - initialY;

  recordingControls.style.left = `${newX}px`;
  recordingControls.style.top = `${newY}px`;
});

// add mouseup event listener
document.addEventListener("mouseup", () => {
  isDragging = false;
  recordingControls.style.cursor = "grab";
});

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
              font-size: 14px;
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
        <button class="control pause" style="background: transparent; border: none;">
          <div
            id="pause"
            style="
              display: flex;
              cursor: pointer;
              gap: 8px;
              width: 24px;
              height: 24px;
              padding: 0.625rem;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 8px;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/Line_23_wvwxjf.svg"
              alt="line"
              style="
              width: 3px;
              height: 10px;"
            />
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/Line_23_wvwxjf.svg"
              alt="line"
              style="
              width: 3px;
              height: 10px;"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 12px;
              font-weight: 500;
            "
            >Pause</strong
          >
        </button>

        <button class="control start" style="background: transparent; border: none">
          <div
            style="
              display: grid;
              width: 24px;
              height: 24px;
              cursor: pointer;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 8px;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/microphone_cthllc.svg"
              alt="stop"
              style="
              width: 20px;
              height: 20px;"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 12px;
              font-weight: 500;
            "
            >Resume</strong
          >
        </button>

        <button class="control stop" style="background: transparent; border: none">
          <div
            style="
              display: grid;
              width: 24px;
              height: 24px;
              cursor: pointer;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 8px;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/stop_a43eip.svg"
              alt="stop"
              style="
              width: 20px;
              height: 20px;"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 12px;
              font-weight: 500;
            "
            >Stop</strong
          >
        </button>

        

        <button class="control" style="background: transparent; border: none">
          <div
            style="
              display: grid;
              width: 24px;
              height: 24px;
              cursor: pointer;
              padding: 0.625rem;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 8px;
            "
          >
            <img
              src="https://res.cloudinary.com/dikeogwu1/image/upload/v1696094899/Icons/video-camera_uc4wcw.svg"
              alt="camera"
              style="
              width: 20px;
              height: 20px;"
            />
          </div>
          <strong
            style="
              color: #fff;
              font-family: Work Sans, sans-serif;
              font-size: 12px;
              font-weight: 500;
            "
            >Camera</strong
          >
        </button>
        
        <button
          class="control delete"
          style="background: transparent; border: none"
        >
          <div
            style="
              display: grid;
              width: 24px;
              height: 24px;
              padding: 0.625rem;
              cursor: pointer;
              place-content: center;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #fff;
              margin-bottom: 20px;
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
  const startBtn = recordingControls.querySelector(".start");
  const deletBtn = recordingControls.querySelector(".delete");
  pauseBtn.addEventListener("click", pauseRecording);
  stopBtn.addEventListener("click", stopRecording);
  startBtn.addEventListener("click", resumeRecording);
  deletBtn.addEventListener("click", deleteRecording);

  if (isRecording) {
    pauseBtn.style.display = "block";
    startBtn.style.display = "none";
  } else {
    pauseBtn.style.display = "none";
    startBtn.style.display = "block";
  }
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

// Function to pause audio recording
function pauseRecording() {
  isRecording = false;
  if (!isRecording) {
    recordingControls.querySelector(".pause").style.display = "none";
    recordingControls.querySelector(".start").style.display = "block";
    audioRecorder && audioRecorder.pause();
    videoRecorder && videoRecorder.pause();
    shareScreen && shareScreen.pause();
    clearInterval(recordingTimerInterval);
  }
}

// Function to resume recording
function resumeRecording() {
  isRecording = true;
  if (isRecording) {
    recordingControls.querySelector(".pause").style.display = "block";
    recordingControls.querySelector(".start").style.display = "none";
    audioRecorder && audioRecorder.resume();
    videoRecorder && videoRecorder.resume();
    shareScreen && shareScreen.resume();
    recordingTimerInterval = setInterval(updateRecordingTimer, 1000);
  }
}

// Function to off camera, off mic, stop screen sharing, clear interval, remove recording controls and save recording
function stopRecording() {
  // Define the URL where you want to send the POST request
  destination =
    "https://helpmeout-chrome-extension-server.onrender.com/api/v1/createVideo";
  audioRecorder && audioRecorder.stop();
  videoRecorder && videoRecorder.stop();
  shareScreen && shareScreen.stop();
  clearInterval(recordingTimerInterval);
  recordingTime = 0;
  // Remove the recording controls from the screen
  recordingControls.remove();
  shareScreen = null;
  videoRecorder = null;
  audioRecorder = null;
  setTimeout(() => {
    location.reload();
  }, 3000);
}

// Function to off camera, off mic, stop screen sharing, clear interval, remove recording controls and delete recording
function deleteRecording() {
  destination = "";
  audioRecorder && audioRecorder.stop();
  videoRecorder && videoRecorder.stop();
  shareScreen && shareScreen.stop();
  clearInterval(recordingTimerInterval);
  recordingTime = 0;
  // Remove the recording controls from the screen
  recordingControls.remove();
  shareScreen = null;
  videoRecorder = null;
  audioRecorder = null;
  setTimeout(() => {
    location.reload();
  }, 3000);
}

function postVideoLinkToServer(url) {
  function generateMachineId() {
    const nav = window.navigator;
    const machineId = [nav.userAgent, nav.language].join("|");
    // Hash the generated string to get a more compact and consistent identifier
    const hashedMachineId = hashString(machineId);
    return hashedMachineId;
  }

  // Simple hash function for id generating purposes
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash.toString(16);
  }
  const machineId = generateMachineId();

  // Open a new tab and navigate to a URL
  function openNewTab(url) {
    window.open(url, "_blank");
  }

  // data to be posted to the server
  const data = {
    name: "video link",
    video: url,
    ip: machineId,
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
      alert("Your video has been generated successfully");
      openNewTab("https://screentalkmaster.netlify.app/ready");
      stopRecording();
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      alert("Your video was not generated");
      stopRecording();
    });
}

// ***** ON SCREEN SHARING ACCESS APPROVED *****
function onScreanRecordingAccessApproved(stream) {
  shareScreen = new MediaRecorder(stream);
  shareScreen.start();

  const videoTrack = stream.getVideoTracks()[0];

  shareScreen.onpause = function () {
    videoTrack.enabled = false;
  };
  shareScreen.onresume = function () {
    videoTrack.enabled = true;
  };

  shareScreen.onstop = function () {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  };

  shareScreen.ondataavailable = function (event) {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

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
  const videoTrack = stream.getVideoTracks()[0];

  videoRecorder.onpause = function () {
    videoTrack.enabled = false;
  };
  videoRecorder.onresume = function () {
    videoTrack.enabled = true;
  };

  videoRecorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  };
}
// function to create and display video recording
function videoView(stream) {
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
  initializeVideoRecorder(stream);
}

// ***** ON AUDIO RECORDING ACCESS APPROVED *****
function initializeAudioRecorder(stream) {
  audioRecorder = new MediaRecorder(stream);
  audioRecorder.start();
  const audioTrack = stream.getAudioTracks()[0];

  audioRecorder.onpause = function () {
    audioTrack.enabled = false;
  };
  audioRecorder.onresume = function () {
    audioTrack.enabled = true;
  };

  audioRecorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  };
}
// function to start recording audio
function startRecordingSelfInAudio(stream) {
  createAudioRecordingControls();
  recordingTimerInterval = setInterval(updateRecordingTimer, 1000);
  initializeAudioRecorder(stream);
}

// ====== start recording screen with video or audio or both =====
const startVideoAndAudio = async (audio, video) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: video,
      audio: audio,
    });
    video && videoView(stream);
    audio && startRecordingSelfInAudio(stream);
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

// start screen sharing
const startSharing = async (
  controls,
  { bothOn, micOff, cameraOff, bothOff }
) => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    onScreanRecordingAccessApproved(stream);

    if (bothOn) {
      controls(true, true);
      return;
    }
    if (micOff) {
      controls(false, true);
      return;
    }
    if (cameraOff) {
      controls(true, false);
      return;
    }
    if (bothOff) {
      controls(false, false);
      return;
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

// ON MESSAGE
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // share Screen With Camera And Mic On
  if (message.action === "shareScreenWithCameraAndMicOn") {
    sendResponse(`processed: ${message.action}`);
    startSharing(startVideoAndAudio, { bothOn: true });
    return;
  }
  // share Screen With Mic Off
  if (message.action === "shareScreenWithMicOff") {
    sendResponse(`processed: ${message.action}`);
    startSharing(startVideoAndAudio, { micOff: true });
    return;
  }
  // share Screen With Camera Off
  if (message.action === "shareScreenWithCameraOff") {
    sendResponse(`processed: ${message.action}`);
    startSharing(startVideoAndAudio, { cameraOff: true });
    return;
  }
  // share Screen With Camera And Mic Off
  if (message.action === "shareScreenWithCameraAndMicOff") {
    sendResponse(`processed: ${message.action}`);
    startSharing(startVideoAndAudio, { bothOff: true });
    return;
  }
});

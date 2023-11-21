let recordingTimerInterval;
let recordingTime = 0;
let isRecording = false;
let destination;
var videoRecorder = null;
var audioRecorder = null;
let camera = null;
let audio = null;

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
  audio = document.createElement("div");
  audio.innerHTML = `<aside
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
  recordingControls.appendChild(audio);
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
    chrome.runtime.sendMessage({
      type: "pause-recording",
      target: "offscreen",
    });
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
    chrome.runtime.sendMessage({
      type: "resume-recording",
      target: "offscreen",
    });
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
  clearInterval(recordingTimerInterval);
  recordingTime = 0;
  // Remove the recording controls from the screen
  recordingControls.remove();
  videoRecorder = null;
  audioRecorder = null;
  isRecording = false;
  chrome.runtime.sendMessage({
    type: "stop-recording",
    target: "offscreen",
  });
  setTimeout(() => {
    location.reload();
  }, 3000);
}

// Function to off camera, off mic, stop screen sharing, clear interval, remove recording controls and delete recording
function deleteRecording() {
  destination = "";
  audioRecorder && audioRecorder.stop();
  videoRecorder && videoRecorder.stop();
  clearInterval(recordingTimerInterval);
  recordingTime = 0;
  // Remove the recording controls from the screen
  recordingControls.remove();
  videoRecorder = null;
  audioRecorder = null;
  isRecording = false;
  chrome.runtime.sendMessage({
    type: "delete-recording",
    target: "offscreen",
  });
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
function displayCamRecorder(stream) {
  camera = document.createElement("video");
  camera.autoplay = "true";
  camera.playsInline = "true";
  camera.style.display = "block";
  camera.style.width = "120px";
  camera.style.height = "120px";
  camera.style.borderRadius = "50%";
  camera.style.border = "2px solid #141414";
  camera.style.overflow = "hidden";
  camera.style.objectFit = "cover";
  camera.srcObject = stream;
  recordingControls.appendChild(camera);
  // initializeVideoRecorder(stream);
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
function displayControls() {
  createAudioRecordingControls();
  recordingTimerInterval = setInterval(updateRecordingTimer, 1000);
}

// ====== start recording screen with video or audio or both =====
const streamWithIsVideoOrAudioOff = async (noAudio, noCamera) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    initializeVideoRecorder(stream);
    initializeAudioRecorder(stream);
    displayCamRecorder(stream);
    displayControls();
    noAudio && (audio.style.display = "none");
    noCamera && (camera.style.display = "none");

    chrome.runtime.sendMessage({
      type: "start-recording",
      target: "background",
    });
  } catch (error) {
    console.error("Error accessing media devices:", error);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
};

// HANDLE MESSAGES SENT TO CONTENT SCRIPT
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // share Screen With Camera And Mic On
  if (message.action === "cameraAndMicOn" && !isRecording) {
    isRecording = true;
    sendResponse(`processed: ${message.action}`);
    streamWithIsVideoOrAudioOff(false, false);
    return;
  }
  // share Screen With Mic Off
  if (message.action === "micOff" && !isRecording) {
    isRecording = true;
    sendResponse(`processed: ${message.action}`);
    streamWithIsVideoOrAudioOff(true, false);
    return;
  }
  // share Screen With Camera Off
  if (message.action === "cameraOff" && !isRecording) {
    isRecording = true;
    sendResponse(`processed: ${message.action}`);
    streamWithIsVideoOrAudioOff(false, true);
    return;
  }
  // share Screen With Camera And Mic Off
  if (message.action === "cameraAndMicOff" && !isRecording) {
    isRecording = true;
    sendResponse(`processed: ${message.action}`);
    streamWithIsVideoOrAudioOff(true, true);
    return;
  }
  // add recorder controls
  if (message.action === "onAudio" && isRecording) {
    if (audio) {
      audio.style.display = "block";
    }
    return;
  }
  // remove recorder controls
  if (message.action === "offAudio" && isRecording) {
    if (audio) {
      audio.style.display = "none";
    }
    return;
  }
  // add camera display
  if (message.action === "onCamera" && isRecording) {
    if (camera) {
      camera.style.display = "block";
    }
    return;
  }
  // remove camera display
  if (message.action === "offCamera" && isRecording) {
    if (camera) {
      camera.style.display = "none";
    }
    return;
  }
});

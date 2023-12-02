let recordingTimerInterval;
let recordingTime = 0;
let isRecording = false;
var videoRecorder = null;
var audioRecorder = null;
let camera = null;
let audio = null;
let loadingContainer;
let isLoading;

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

function createLoading() {
  loadingContainer = document.createElement("div");
  loadingContainer.id = "loadingBox";
  loadingContainer.innerHTML = `<aside
    style="
      display: grid;
      padding: 0.5rem;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      background: #fff;
      width: 22rem;
      height: 20rem;
      box-shadow: 0px 0px 3px 2px #f10;
    "
  >
    <img
      src="https://res.cloudinary.com/dikeogwu1/image/upload/v1701431905/HelpMeOut%20Chrome%20Extension/main-icon-xl_ac3gka.png"
      alt="logo"
      style="margin: 0 auto"
    />
    <h2 style="color: #000; text-align: center">Please wait...</h2>
    <p style="color: #000">You will be redirected shortly.</p>
    <div
      style="
        display: flex;
        align-items: center;
        gap: 0.81rem;
        animation: load 1s infinite; 
      "
    >
      <strong
        style="
          display: block;
          width: 3rem;
          height: 2px;
          border-radius: 1.0625rem;
          background: #080;
        "
      ></strong>
      <div
        style="
          width: 5rem;
          height: 2px;
          border-radius: 1.0625rem;
          background: #c00404;
        "
      ></div>
      <strong
        style="
          display: block;
          width: 3rem;
          height: 2px;
          border-radius: 1.0625rem;
          background: #c4b454;
        "
      ></strong>
    </div>
  </aside>`;
  loadingContainer.style.placeContent = "center";
  loadingContainer.style.position = "fixed";
  loadingContainer.style.top = "30%";
  loadingContainer.style.left = "50%";
  loadingContainer.style.transform = "translateX(-50%)";
  loadingContainer.style.width = "fit-content";
  loadingContainer.style.zIndex = "999999";
  loadingContainer.style.overflow = "hidden";
  if (!isLoading) {
    loadingContainer.style.display = "none";
  } else {
    loadingContainer.style.display = "grid";
  }
  const styles = document.createElement("style");
  styles.textContent = `
    @keyframes load {
      10% {
        transform: translateX(0);
      }
      20% {
        transform: translateX(40%);
      }
      30% {
        transform: translateX(60%);
      }
      40% {
        transform: translateX(80%);
      }
      50% {
        transform: translateX(100%);
      }
      60% {
        transform: translateX(0);
      }
      70% {
        transform: translateX(-40%);
      }
      80% {
        transform: translateX(-60%);
      }
      90% {
        transform: translateX(-80%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `;
  document.head.appendChild(styles);
  document.body.appendChild(loadingContainer);
}
createLoading();

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

  isLoading = true;
  if (!isLoading) {
    loadingContainer.style.display = "none";
  } else {
    loadingContainer.style.display = "grid";
  }
  setTimeout(() => {
    location.reload();
  }, 20000);
}

// Function to off camera, off mic, stop screen sharing, clear interval, remove recording controls and delete recording
function deleteRecording() {
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
let data = [];

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
  videoRecorder.ondataavailable = (event) => data.push(event.data);

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
    alert(
      `Sorry! we couldn't record your screen at this time. Let's reload the page before you try again.`
    );
    setTimeout(() => {
      location.reload();
    }, 800);
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

const handleBeforeUnload = (e) => {
  if (isRecording) {
    deleteRecording();
    return;
  }
};
window.addEventListener("beforeunload", handleBeforeUnload);

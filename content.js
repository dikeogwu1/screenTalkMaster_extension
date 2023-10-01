let recordingTimerInterval;
let recordingTime = 0;
let isRecording = false;
var recorder = null;

// Function to create and display recording controls
function createRecordingControls() {
  const recordingControls = document.createElement("div");
  recordingControls.id = "recording-controls";
  recordingControls.innerHTML = `<aside
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
        position: fixed;
        bottom: 60px;
        left: 60px;
        zIndex: 9999;
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

  document.body.appendChild(recordingControls);
  const pauseBtn = recordingControls.querySelector(".pause");
  const stopBtn = recordingControls.querySelector(".stop");
  const deletBtn = recordingControls.querySelector(".delete");

  pauseBtn.addEventListener("click", pauseRecording);
  stopBtn.addEventListener("click", stopRecording);
  deletBtn.addEventListener("click", stopRecording);
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

// Function to start recording
function startRecording() {
  createRecordingControls();
  recordingTimerInterval = setInterval(updateRecordingTimer, 1000);
}

// Function to pause recording
function pauseRecording() {
  recorder.pause();
  clearInterval(recordingTimerInterval);
  // Remove the recording controls from the screen
  const recordingControls = document.querySelector("#recording-controls");
  recordingControls.remove();
}
// Function to stop recording
function stopRecording() {
  recorder.stop();
  recordingTime = 0;
  clearInterval(recordingTimerInterval);
  // Remove the recording controls from the screen
  const recordingControls = document.querySelector("#recording-controls");
  recordingControls.remove();
}

// ***** MAIN *****

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);
  recorder.start();
  startRecording();

  recorder.onpause = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (event) {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    let a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    // a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log("no recorder");

    stopRecording();
  }
});

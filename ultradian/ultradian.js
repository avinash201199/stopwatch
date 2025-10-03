```javascript
// Configurable durations
const WORK_DURATION = 90 * 60;   // 90 minutes
const REST_DURATION = 20 * 60;   // 20 minutes

let timeLeft = WORK_DURATION;
let isWork = true; // Start with Work session
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Format time as HH:MM:SS
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hrs > 0 ? String(hrs).padStart(2, "0") : null,
    String(mins).padStart(2, "0"),
    String(secs).padStart(2, "0")
  ].filter(Boolean).join(":");
}

// Update UI
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  statusDisplay.textContent = isWork ? "Status: Work" : "Status: Rest";
  statusDisplay.style.color = isWork ? "#27ae60" : "#e74c3c";
}

// Start Timer
function startTimer() {
  if (timerInterval) return; // prevent multiple intervals

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      // Toggle between work and rest
      isWork = !isWork;
      timeLeft = isWork ? WORK_DURATION : REST_DURATION;
      updateDisplay();

      // Non-blocking notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(isWork ? "Back to Work! Focus time started." : "Take a Rest! 20 minutes break.");
      } else {
        alert(isWork ? "Back to Work! Focus time started." : "Take a Rest! 20 minutes break.");
      }
    }
  }, 1000);
}

// Pause Timer
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isWork = true;
  timeLeft = WORK_DURATION;
  updateDisplay();
}

// Request Notification Permission (if available)
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Button Listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initial Display
updateDisplay();
```;

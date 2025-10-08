let hr = 0;
let min = 0;
let sec = 0;
let count = 0;
let timer = false;
let timerInterval = null;
const tickSound = new Audio("../audio/ticking.mp3");
tickSound.loop = true;

let tickToggle = null;
let isTickEnabled = false;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  tickToggle = document.getElementById("tickToggle");
  if (tickToggle) {
    isTickEnabled = tickToggle.checked;

    // Listen for checkbox change
    tickToggle.addEventListener("change", (e) => {
      isTickEnabled = e.target.checked;

      // Handle real-time toggle during stopwatch running
      if (timer) {
        if (isTickEnabled) {
          tickSound.play().catch(() => {});
        } else {
          tickSound.pause();
          tickSound.currentTime = 0;
        }
      }
    });
  }
});

function $id(id) {
  return document.getElementById(id);
}

function start() {
  if (timer) return; // Prevent multiple timers

  timer = true;
  if (isTickEnabled) {
    tickSound.play();
  }
  stopwatch();
}

function stop() {
  timer = false;
  if (timerInterval) {
    clearTimeout(timerInterval);
    timerInterval = null;
  }
  tickSound.pause();
  tickSound.currentTime = 0;
}

function reset() {
  timer = false;
  if (timerInterval) {
    clearTimeout(timerInterval);
    timerInterval = null;
  }
  hr = min = sec = count = 0;
  tickSound.pause();
  tickSound.currentTime = 0;

  $id("hr").innerHTML = "00";
  $id("min").innerHTML = "00";
  $id("sec").innerHTML = "00";
  $id("count").innerHTML = "00";
}

function stopwatch() {
  if (timer) {
    count += 1;
  }

  if (count === 99) {
    sec += 1;
    count = 0;
  }
  if (sec === 59) {
    min += 1;
    sec = 0;
  }
  if (min === 59) {
    hr += 1;
    min = 0;
    sec = 0;
  }

  updateDisplay(hr, "hr");
  updateDisplay(min, "min");
  updateDisplay(sec, "sec");
  updateDisplay(count, "count");

  // Continue timer loop only if timer is active
  if (timer) {
    timerInterval = setTimeout(stopwatch, 10);
  } else {
    timerInterval = null;
  }
}

function updateDisplay(value, elementId) {
  const stringValue = value < 10 ? "0" + value : value.toString();
  document.getElementById(elementId).innerHTML = stringValue;
}

function lap() {
  const laps = $id("laps");
  laps.innerHTML += "<li>" + hr + ":" + min + ":" + sec + ":" + count + "</li>";
}

function clearLap() {
  $id("laps").remove();
}

function getLocalTime() {
  const d = new Date().toLocaleTimeString();
}

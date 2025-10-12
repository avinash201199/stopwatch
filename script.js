// script.js - Enhanced Stopwatch with Modern Features
// Author: Hector JS

// ============================================
// STATE VARIABLES
// ============================================
var hr = 0,
  min = 0,
  sec = 0,
  count = 0;

var prev_hr = 0,
  prev_min = 0,
  prev_sec = 0,
  prev_count = 0;

var diff_hr = 0,
  diff_min = 0,
  diff_sec = 0,
  diff_count = 0;

var timer = false;
var lapCounter = 1;

let timerInterval = null;

// ============================================
// SOUND EFFECTS
// ============================================
const tickSound = new Audio("audio/ticking.mp3");
tickSound.loop = true;

const beepSound = new Audio("audio/beep_cut.mp3");
const startSound = new Audio("audio/sound_trim.mp3");

let tickToggle = null;
let isTickEnabled = false;

// ============================================
// INITIALIZATION & LOCAL STORAGE
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Load saved state from localStorage
  loadStopwatchState();
  
  // Load dark mode preference
  loadDarkModePreference();
  
  // Initialize tick toggle
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
  
  // Setup dark mode toggle
  setupDarkModeToggle();
});

// Save stopwatch state to localStorage
function saveStopwatchState() {
  const state = {
    hr: hr,
    min: min,
    sec: sec,
    count: count,
    timer: timer,
    lapCounter: lapCounter,
    timestamp: Date.now()
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
}

// Load stopwatch state from localStorage
function loadStopwatchState() {
  const savedState = localStorage.getItem('stopwatchState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      // Only restore if saved within last 24 hours
      if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
        hr = state.hr || 0;
        min = state.min || 0;
        sec = state.sec || 0;
        count = state.count || 0;
        lapCounter = state.lapCounter || 1;
        
        // Update display
        updateDisplay();
      }
    } catch (e) {
      console.log('Error loading saved state:', e);
    }
  }
}

// Update display helper
function updateDisplay() {
  if ($id("hr")) $id("hr").innerHTML = hr < 10 ? "0" + hr : "" + hr;
  if ($id("min")) $id("min").innerHTML = min < 10 ? "0" + min : "" + min;
  if ($id("sec")) $id("sec").innerHTML = sec < 10 ? "0" + sec : "" + sec;
  if ($id("count")) $id("count").innerHTML = count < 10 ? "0" + count : "" + count;
}

// ============================================
// DARK MODE FUNCTIONALITY
// ============================================
function setupDarkModeToggle() {
  const checkbox = document.getElementById("light");
  if (checkbox) {
    checkbox.addEventListener("change", function() {
      document.body.classList.toggle("dark-mode");
      // Save preference
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
  }
}

function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode');
  const checkbox = document.getElementById("light");
  
  if (darkMode === 'true') {
    document.body.classList.add('dark-mode');
    if (checkbox) checkbox.checked = true;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function $id(id) {
  return document.getElementById(id);
}

// Play sound effect
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// ============================================
// STOPWATCH CONTROLS
// ============================================
// Start / Pause toggle
function start() {
  if (!timer) {
    timer = true;
    
    // Play start sound
    playSound(startSound);
    
    if (isTickEnabled) {
      tickSound.play().catch(() => {});
    }
    if ($id("start"))
      $id("start").innerHTML = '<i class="far fa-pause-circle"></i> Pause';
    stopwatch();
  } else {
    timer = false;
    
    // Play beep sound on pause
    playSound(beepSound);
    
    tickSound.pause();
    if ($id("start"))
      $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';
  }
  
  // Save state
  saveStopwatchState();
}

// -- Stop (explicit) -----------------
function stop() {
  timer = false;
  tickSound.pause();
  tickSound.currentTime = 0;
  if ($id("start"))
    $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';
}

// Reset stopwatch
function reset() {
  if ($id("record-container")) $id("record-container").style.display = "none";
  timer = false;
  
  // Play beep sound on reset
  playSound(beepSound);
  
  tickSound.pause();
  tickSound.currentTime = 0;
  if ($id("start"))
    $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';

  clearTimeout(timeoutId);
  clearInterval(countdownInterval);

  hr = 0;
  min = 0;
  sec = 0;
  count = 0;

  if ($id("hr")) $id("hr").innerHTML = "00";
  if ($id("min")) $id("min").innerHTML = "00";
  if ($id("sec")) $id("sec").innerHTML = "00";
  if ($id("count")) $id("count").innerHTML = "00";

  if ($id("record-table-body")) $id("record-table-body").innerHTML = "";
  lapCounter = 1;
  
  // Clear saved state
  localStorage.removeItem('stopwatchState');
}

// ============================================
// STOPWATCH ENGINE
// ============================================
let timeoutId;
function stopwatch() {
  clearTimeout(timeoutId);
  clearInterval(countdownInterval);

  if (timer === true) count = count + 1;

  if (count == 99) {
    sec = sec + 1;
    count = 0;
  }
  if (sec == 59) {
    min = min + 1;
    sec = 0;
  }
  if (min == 59) {
    hr = hr + 1;
    min = 0;
    sec = 0;
  }

  var hrString = hr < 10 ? "0" + hr : "" + hr;
  var minString = min < 10 ? "0" + min : "" + min;
  var secString = sec < 10 ? "0" + sec : "" + sec;
  var countString = count < 10 ? "0" + count : "" + count;

  if ($id("hr")) $id("hr").innerHTML = hrString;
  if ($id("min")) $id("min").innerHTML = minString;
  if ($id("sec")) $id("sec").innerHTML = secString;
  if ($id("count")) $id("count").innerHTML = countString;

  // Save state periodically (every second)
  if (count % 100 === 0) {
    saveStopwatchState();
  }

  timeoutId = setTimeout(stopwatch, 10);
}

// ============================================
// LAP FUNCTIONALITY
// ============================================
// Calculate lap time difference
function getdiff() {
  diff_hr = hr - prev_hr;
  diff_min = min - prev_min;
  if (diff_min < 0) {
    diff_min += 60;
    diff_hr -= 1;
  }
  diff_sec = sec - prev_sec;
  if (diff_sec < 0) {
    diff_sec += 60;
    diff_min -= 1;
  }
  diff_count = count - prev_count;
  if (diff_count < 0) {
    diff_count += 100;
    diff_sec -= 1;
  }

  prev_count = count;
  prev_sec = sec;
  prev_min = min;
  prev_hr = hr;
}

// Record lap time
function lap() {
  if (timer) {
    // Play beep sound
    playSound(beepSound);
    
    if ($id("record-container"))
      $id("record-container").style.display = "block";
    getdiff();

    var lap_time =
      ($id("hr") ? $id("hr").innerHTML : "00") +
      ":" +
      ($id("min") ? $id("min").innerHTML : "00") +
      ":" +
      ($id("sec") ? $id("sec").innerHTML : "00") +
      ":" +
      ($id("count") ? $id("count").innerHTML : "00");

    const table = $id("record-table-body");
    if (table) {
      const row = table.insertRow(0);
      const no_cell = row.insertCell(0);
      const time_cell = row.insertCell(1);
      const diff_cell = row.insertCell(2);

      no_cell.innerHTML = lapCounter;
      time_cell.innerHTML = lap_time;

      var hrString = diff_hr < 10 ? "0" + diff_hr : "" + diff_hr;
      var minString = diff_min < 10 ? "0" + diff_min : "" + diff_min;
      var secString = diff_sec < 10 ? "0" + diff_sec : "" + diff_sec;
      var countString = diff_count < 10 ? "0" + diff_count : "" + diff_count;

      diff_cell.innerHTML =
        hrString + ":" + minString + ":" + secString + ":" + countString;
      lapCounter++;
    }
  }
}

// Clear all lap records
function clearLap() {
  if ($id("record-container")) $id("record-container").style.display = "none";
  if ($id("record-table-body")) $id("record-table-body").innerHTML = "";
  lapCounter = 1;
}

// ============================================
// DATE DISPLAY
// ============================================
setInterval(() => {
  var d = new Date();
  var year = d.getFullYear();

  var day;
  switch (d.getDay()) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
  }

  var month;
  switch (d.getMonth()) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sept";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
  }

  var dayn = d.getDate();
  var dateStr = dayn + " " + month + " , " + year;

  if ($id("d1")) $id("d1").innerHTML = dateStr;
}, 1000);

const stopwatchBtn = document.getElementById("stopwatch-btn");
const countdownBtn = document.getElementById("countdown-btn");
const countdownInputContainer = document.getElementById(
  "countdown-input-container"
);
let mode = "stopwatch"; // default mode

stopwatchBtn.addEventListener("click", () => {
  mode = "stopwatch";
  stopwatchBtn.classList.add("active");
  countdownBtn.classList.remove("active");
  countdownInputContainer.style.display = "none";
  reset(); // reset stopwatch
});

countdownBtn.addEventListener("click", () => {
  mode = "countdown";
  countdownBtn.classList.add("active");
  stopwatchBtn.classList.remove("active");
  countdownInputContainer.style.display = "block";
  reset(); // reset stopwatch
});

// Countdown logic
let countdownInterval;
document.getElementById("start-countdown").addEventListener("click", () => {
  let minutes = parseInt(document.getElementById("countdown-minutes").value);
  if (isNaN(minutes) || minutes < 0) {
    alert("Enter a valid number of minutes");
    return;
  }

  let totalSeconds = minutes * 60;
  clearInterval(countdownInterval);

  if ($id("start"))
    $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';
  countdownInterval = setInterval(() => {
    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    document.getElementById("hr").textContent = String(hrs).padStart(2, "0");
    document.getElementById("min").textContent = String(mins).padStart(2, "0");
    document.getElementById("sec").textContent = String(secs).padStart(2, "0");
    document.getElementById("count").textContent = "00";

    if (totalSeconds <= 0) {
      clearInterval(countdownInterval);
      alert("Time's up!");
    }

    totalSeconds--;
  }, 1000);
});

// Timer Preset functionality
let presetSound = new Audio("../audio/beep_cut.mp3");
presetSound.volume = 0.3;

function setPresetTimer(minutes) {
  // Play sound feedback
  presetSound.play().catch(() => {
    // Ignore audio play errors (browser restrictions)
  });
  
  // Set the input value
  document.getElementById("countdown-minutes").value = minutes;
  
  // Update active preset button
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Find and activate the clicked preset
  const clickedBtn = document.querySelector(`[data-minutes="${minutes}"]`);
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }
  
  // Add visual feedback to input field
  const input = document.getElementById("countdown-minutes");
  input.style.border = "2px solid #ffb703";
  input.style.background = "rgba(255, 183, 3, 0.1)";
  input.style.color = "white";
  input.style.transform = "scale(1.02)";
  
  setTimeout(() => {
    input.style.transform = "scale(1)";
    input.style.background = "rgba(255, 255, 255, 0.08)";
    input.style.border = "2px solid rgba(255, 255, 255, 0.3)";
    input.style.color = "white";
  }, 300);
}
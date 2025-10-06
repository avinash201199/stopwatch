// script.js (updated)

// -- state variables -----------------
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

// helper
function $id(id) {
  return document.getElementById(id);
}

// -- Start / Pause toggle ------------
function start() {
  if (!timer) {
    timer = true;
    if ($id("start"))
      $id("start").innerHTML = '<i class="far fa-pause-circle"></i> Pause';
    stopwatch();
  } else {
    timer = false;
    if ($id("start"))
      $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';
  }
}

// -- Stop (explicit) -----------------
function stop() {
  timer = false;
  if ($id("start"))
    $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';
}

// -- Reset --------------------------
function reset() {
  if ($id("record-container")) $id("record-container").style.display = "none";
  timer = false;
  if ($id("start"))
    $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';

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
}

let timeoutId;
function stopwatch() {
  clearTimeout(timeoutId);

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

  timeoutId = setTimeout(stopwatch, 10);
}

// -- lap helper ----------------------
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

function lap() {
  if (timer) {
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

function clearLap() {
  if ($id("record-container")) $id("record-container").style.display = "none";
  if ($id("record-table-body")) $id("record-table-body").innerHTML = "";
  lapCounter = 1;
}

// -- date ticker (defensive) ---------
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

const stopwatchBtn = document.getElementById('stopwatch-btn');
const countdownBtn = document.getElementById('countdown-btn');
const countdownInputContainer = document.getElementById('countdown-input-container');
let mode = 'stopwatch'; // default mode

stopwatchBtn.addEventListener('click', () => {
  mode = 'stopwatch';
  stopwatchBtn.classList.add('active');
  countdownBtn.classList.remove('active');
  countdownInputContainer.style.display = 'none';
  reset(); // reset stopwatch
});

countdownBtn.addEventListener('click', () => {
  mode = 'countdown';
  countdownBtn.classList.add('active');
  stopwatchBtn.classList.remove('active');
  countdownInputContainer.style.display = 'block';
  reset(); // reset stopwatch
});

// Countdown logic
let countdownInterval;
document.getElementById('start-countdown').addEventListener('click', () => {
  let minutes = parseInt(document.getElementById('countdown-minutes').value);
  if (isNaN(minutes) || minutes < 0) {
    alert('Enter a valid number of minutes');
    return;
  }

  let totalSeconds = minutes * 60;
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    document.getElementById('hr').textContent = String(hrs).padStart(2, '0');
    document.getElementById('min').textContent = String(mins).padStart(2, '0');
    document.getElementById('sec').textContent = String(secs).padStart(2, '0');
    document.getElementById('count').textContent = '00';

    if (totalSeconds <= 0) {
      clearInterval(countdownInterval);
      alert("Time's up!");
    }

    totalSeconds--;
  }, 1000);
});


let hr = 0;
let min = 0;
let sec = 0;
let count = 0;
let timer = false;
let lapCounter = 1;

let prev_hr = 0;
let prev_min = 0;
let prev_sec = 0;
let prev_count = 0;

function $id(id) {
    return document.getElementById(id);
}

function start() {
    timer = true;
    stopwatch();
}

function stop() {
    timer = false;
}

function reset() {
    timer = false;
    hr = min = sec = count = 0;
    updateDisplay(hr, "hr");
    updateDisplay(min, "min");
    updateDisplay(sec, "sec");
    updateDisplay(count, "count");

    clearLapTable();  // Add this line to clear the lap table
    lapCounter = 1;
}

function clearLapTable() {
    const lapsBody = $id('laps');
    lapsBody.innerHTML = '';  // Clear the laps table content
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

    setTimeout(stopwatch, 10);
}

function updateDisplay(value, elementId) {
    const stringValue = value < 10 ? '0' + value : value.toString();
    document.getElementById(elementId).innerHTML = stringValue;
}

function lap() {
    const lapsTable = $id('laps-table');
    const lapsBody = $id('laps');

    const lapTime = `${hr}:${min}:${sec}:${count}`;
    const diff = getDiff();

    const newRow = lapsBody.insertRow(-1);
    newRow.innerHTML = `<td>${lapCounter}</td><td>${lapTime}</td><td>${diff}</td>`;

    lapCounter += 1;
}

function clearLap() {
    const laps = $id('laps');
    const lastLap = laps.lastElementChild;

    if (lastLap) {
        laps.removeChild(lastLap);
    }

    lapCounter = 1;
}

function getDiff() {
    const diff_hr = hr - prev_hr;
    const diff_min = min - prev_min;
    const diff_sec = sec - prev_sec;
    const diff_count = count - prev_count;

    prev_count = count;
    prev_sec = sec;
    prev_min = min;
    prev_hr = hr;

    return `${diff_hr}:${diff_min}:${diff_sec}:${diff_count}`;
}

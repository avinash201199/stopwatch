```javascript
let hr = 0, min = 0, sec = 0, count = 0;
let timer = false;

function $id(id) {
  return document.getElementById(id);
}

function start() {
  if (!timer) {
    timer = true;
    stopwatch();
  }
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
  $id("laps").innerHTML = "";
}

function stopwatch() {
  if (timer) {
    count++;
    if (count === 100) {
      sec++;
      count = 0;
    }
    if (sec === 60) {
      min++;
      sec = 0;
    }
    if (min === 60) {
      hr++;
      min = 0;
      sec = 0;
    }
    updateDisplay(hr, "hr");
    updateDisplay(min, "min");
    updateDisplay(sec, "sec");
    updateDisplay(count, "count");
    setTimeout(stopwatch, 10);
  }
}

function updateDisplay(value, elementId) {
  const stringValue = value < 10 ? "0" + value : value.toString();
  $id(elementId).innerHTML = stringValue;
}

function lap() {
  const laps = $id("laps");
  const li = document.createElement("li");
  li.textContent = `${format(hr)}:${format(min)}:${format(sec)}:${format(count)}`;
  laps.appendChild(li);
}

function clearLap() {
  $id("laps").innerHTML = "";
}

function format(value) {
  return value < 10 ? "0" + value : value;
}
```

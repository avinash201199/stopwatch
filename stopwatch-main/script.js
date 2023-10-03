let hr = 0;
let min = 0;
let sec = 0;
let count = 0;
let timer = false;

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

    setTimeout(stopwatch, 10);
}

function updateDisplay(value, elementId) {
    const stringValue = value < 10 ? '0' + value : value.toString();
    document.getElementById(elementId).innerHTML = stringValue;
}

function lap() {
    console.log(hr, min, sec, count)
    const laps = $id('laps');
    laps.innerHTML += "<li>" + hr + ":" + min + ":" + sec + ":" + count + "</li>";
}

function clearLap() {
    $id('laps').remove();
}

function getLocalTime(){
    const d = new Date().toLocaleTimeString();
    console.log(d);
}

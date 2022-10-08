var hr = 0;
var min = 0;
var sec = 0;
var count = 0;

var timer = false;

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

    hr = 0;
    min = 0;
    sec = 0;
    count = 0;

    $id("hr").innerHTML = "00";
    $id("min").innerHTML = "00";
    $id("sec").innerHTML = "00";
    $id("count").innerHTML = "00";

}

function stopwatch() {
    if (timer == true)
        count = count + 1;

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

    var hrString = hr;
    var minString = min;
    var secString = sec;
    var countString = count;

    if (hr < 10) {
        hrString = "0" + hrString;
    }
    if (min < 10) {
        minString = "0" + minString;
    }
    if (sec < 10) {
        secString = "0" + secString;
    }
    if (count < 10) {
        countString = "0" + countString;
    }

    $id("hr").innerHTML = hrString;
    $id("min").innerHTML = minString;
    $id("sec").innerHTML = secString;
    $id("count").innerHTML = countString;
    setTimeout("stopwatch()", 10)
}

function lap() {
    console.log(hr, min, sec, count)
    var Laps = $id('laps');
    Laps.innerHTML += "<li>" + hr + ":" + min + ":" + sec + ":" + count + "</li>";
}

function clearLap() {
    $id('laps').remove();
}

function getLocalTime(){
    const d = new Date().toLocaleTimeString();
    console.log(d);
}

const customTime = {}
var paused = true
var minutes
var timerDate
var remainingTime = 0
var darkTheme = false

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3";

function $id(id) {
    return document.getElementById(id);
}

const setCustomTime = (hours = 0, minutes = 0, seconds = 0) => {
    paused = true;
    $id('hours').innerHTML = String(hours).padStart(2, '0');
    $id('minutes').innerHTML = String(minutes).padStart(2, '0');
    $id('seconds').innerHTML = String(seconds).padStart(2, '0');
    remainingTime = 0;
    paused = true;
    $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    customTime.seconds = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
    $id('secondsInput').value = "";
    $id('minutesInput').value = "";
    $id('hoursInput').value = "";
}


const reset = () => {
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    if (darkTheme) {
        $('.active').css({ "color": "#7fe9d4", "background": "#191212" })
    }
    else {
        $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    }
    audio.play();
    clearInterval(interval);

    setCustomTime(0);
}

var interval = 0;
const startCustomTimerCounter = () => {
    clearInterval(interval);

    audio.play();
    paused = !paused;

    $id('timer-control').innerHTML = paused ? '<i class="fas fa-play-circle"></i> Play' : '<i class="fas fa-pause-circle"></i> Pause';
    if (!paused) {
        $id('counter-background').classList.remove('active');
        $id('counter-background').classList.add('inactive');
        $id('focus').classList.remove('hidden');
        if (darkTheme) {
            $('.inactive').css({ "background": "black", "color": "white" });
        } else {
            $('.inactive').css({ "background": "rgb(5, 30, 54)", "color": "rgb(169, 188, 214)" });
        }
    } else {
        $id('counter-background').classList.remove('inactive');
        $id('counter-background').classList.add('active');
        if (darkTheme) {
            $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
        } else {
            $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
        }
    }
    const updateTimer = () => {
        console.log(customTime.seconds)
        if (!paused && customTime.seconds > 0) {
            customTime.seconds--;
            const hours = Math.floor(customTime.seconds / (60 * 60));
            const minutes = Math.floor(customTime.seconds / 60) % 60;
            const seconds = customTime.seconds % 60;
            $id('hours').innerHTML = String(hours).padStart(2, '0');
            $id('minutes').innerHTML = String(minutes).padStart(2, '0');
            $id('seconds').innerHTML = String(seconds).padStart(2, '0');
        }
        if (customTime.seconds < 0) {
            alert("Please Enter a positive time value!");
            reset();
        }
        if (customTime.seconds == 0) {
            reset();
        }
    }
    interval = setInterval(updateTimer, 1000);
}

function setLightTheme() {
    darkTheme = false;
    $('.navbar').css({ "background-color": "rgb(5, 30, 54)" });
    $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    $('.timer').css({ "color": "white" })
    $('.inactive').css({ "background": "rgb(5, 30, 54)" });
    $('#light').prop("checked", false);
}

function setDarkTheme() {
    darkTheme = true;
    $('.navbar').css({ "background-color": "black" });
    $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
    $('.timer').css({ "color": "rgb(216 137 31)" });
    $('.inactive').css({ "background": "black", "color": "white" })
    $('#light').prop("checked", true);
}
var prefersDarkThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

var prefersDarkThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

prefersDarkThemeMql.addEventListener("change", function (mql) {
    if (localStorage.getItem("darkmode") === null && mql.matches) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
})

$(document).ready(function () {

    if (
        localStorage.getItem("darkmode") == "true" ||
        (localStorage.getItem("darkmode") === null && prefersDarkThemeMql.matches)
    ) {
        setDarkTheme();
    }

    $('#light').on("change paste keyup", function (e) {
        if (!e.target.checked) {
            setLightTheme();
            localStorage.setItem("darkmode", false);
        }
        else {
            setDarkTheme();
            localStorage.setItem("darkmode", true);
        }
    });
});
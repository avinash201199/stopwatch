const customTime = {}
var paused = true
var minutes
var timerDate
var remainingTime = 0
var darkTheme = false
var totalTime = 0

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3";

function $id(id) {
    return document.getElementById(id);
}

// 🎉 Confetti Animation
function startCelebration() {
    document.querySelectorAll('.timer').forEach(el => el.classList.add('pulse'));
    const root = document.getElementById('confetti');
    if (!root) return;
    root.innerHTML = '';
    const colors = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#8338EC', '#FB5607'];
    const pieceCount = 120;
    const durationMin = 3000;
    const durationMax = 6000;
    for (let i = 0; i < pieceCount; i++) {
        const s = document.createElement('span');
        s.className = 'confetti';
        const left = Math.random() * 100;
        const size = 6 + Math.random() * 10;
        const delay = Math.random() * 400;
        const dur = durationMin + Math.random() * (durationMax - durationMin);
        s.style.left = `${left}vw`;
        s.style.background = colors[i % colors.length];
        s.style.width = `${size}px`;
        s.style.height = `${size * 1.4}px`;
        s.style.animationDuration = `${dur}ms`;
        s.style.animationDelay = `${delay}ms`;
        root.appendChild(s);
        setTimeout(() => s.remove(), dur + delay + 100);
    }
}

function stopCelebration() {
    document.querySelectorAll('.timer').forEach(el => el.classList.remove('pulse'));
    const root = document.getElementById('confetti');
    if (root) root.innerHTML = '';
}

function onTimerComplete() {
    paused = true;
    clearInterval(interval);
    $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    $id('stop-alarm').classList.remove('hidden');
    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    startCelebration();
}

function stopAlarm() {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
    $id('stop-alarm').classList.add('hidden');
    stopCelebration();
}

// 🧮 Progress Bar Updater
function updateProgressBar() {
    if (totalTime <= 0) {
        $id("progress-bar").style.width = "0%";
        return;
    }
    const percent = ((totalTime - customTime.seconds) / totalTime) * 100;
    $id("progress-bar").style.width = percent + "%";
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
    totalTime = customTime.seconds; // store total
    updateProgressBar(); // reset bar
    $id('secondsInput').value = "";
    $id('minutesInput').value = "";
    $id('hoursInput').value = "";
}

const reset = () => {
    stopAlarm();
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    if (darkTheme) {
        $('.active').css({ "color": "#7fe9d4", "background": "#191212" })
    } else {
        $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    }
    clearInterval(interval);
    setCustomTime(0);
    $id("progress-bar").style.width = "0%";
}

var interval = 0;
const startCustomTimerCounter = () => {
    clearInterval(interval);
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
        if (!paused && customTime.seconds > 0) {
            customTime.seconds--;
            const hours = Math.floor(customTime.seconds / (60 * 60));
            const minutes = Math.floor(customTime.seconds / 60) % 60;
            const seconds = customTime.seconds % 60;
            $id('hours').innerHTML = String(hours).padStart(2, '0');
            $id('minutes').innerHTML = String(minutes).padStart(2, '0');
            $id('seconds').innerHTML = String(seconds).padStart(2, '0');
            updateProgressBar();
        }
        if (customTime.seconds < 0) {
            alert("Please Enter a positive time value!");
            reset();
        }
        if (customTime.seconds == 0) {
            onTimerComplete();
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

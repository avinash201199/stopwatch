const customTime = {}
let paused = true
let darkTheme = false
let interval = null
let totalSeconds = 0
let muted = false

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3";

function $id(id) {
    return document.getElementById(id);
}

// progress ring elements
const ring = document.querySelector('.progress-ring__circle');
const RADIUS = 100; // matches SVG r attribute
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
if (ring) {
    ring.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    ring.style.strokeDashoffset = `${CIRCUMFERENCE}`;
}

const updateRing = (remaining, total) => {
    if (!ring || total === 0) return;
    const fraction = Math.max(0, remaining) / total;
    const offset = CIRCUMFERENCE * (1 - fraction);
    ring.style.strokeDashoffset = offset;
}

const setCustomTime = (hours = 0, minutes = 0, seconds = 0) => {
    // sanitize inputs
    hours = Number(hours) || 0;
    minutes = Number(minutes) || 0;
    seconds = Number(seconds) || 0;
    if (hours < 0 || minutes < 0 || seconds < 0) {
        alert('Please enter non-negative numbers');
        return;
    }

    paused = true;
    totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    customTime.seconds = totalSeconds;

    const h = Math.floor(customTime.seconds / 3600);
    const m = Math.floor(customTime.seconds / 60) % 60;
    const s = customTime.seconds % 60;
    $id('hours').innerHTML = String(h).padStart(2, '0');
    $id('minutes').innerHTML = String(m).padStart(2, '0');
    $id('seconds').innerHTML = String(s).padStart(2, '0');

    $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');

    // clear inputs for convenience
    $id('secondsInput').value = "";
    $id('minutesInput').value = "";
    $id('hoursInput').value = "";

    updateRing(customTime.seconds, totalSeconds);
}


const reset = () => {
    clearInterval(interval);
    paused = true;
    customTime.seconds = 0;
    totalSeconds = 0;
    $id('hours').innerHTML = '00';
    $id('minutes').innerHTML = '00';
    $id('seconds').innerHTML = '00';

    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    if (darkTheme) {
        $('.active').css({ "color": "#7fe9d4", "background": "#191212" })
    }
    else {
        $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    }

    updateRing(0, 1);
    if (!muted) audio.play();
    $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
}

const startCustomTimerCounter = () => {
    if (!customTime.seconds || customTime.seconds <= 0) {
        alert('Please set a positive timer first (use inputs or presets).');
        return;
    }

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

            updateRing(customTime.seconds, totalSeconds || 1);
        }

        if (customTime.seconds < 0) {
            alert("Please Enter a positive time value!");
            reset();
        }
        if (customTime.seconds == 0 && !paused) {
            // finished
            paused = true;
            $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
            updateRing(0, totalSeconds || 1);
            if (!muted) audio.play();
            // small visual cue
            $id('counter-background').classList.remove('inactive');
            $id('counter-background').classList.add('active');
        }
    }

    clearInterval(interval);
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

const prefersDarkThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

prefersDarkThemeMql.addEventListener("change", function (mql) {
    if (localStorage.getItem("darkmode") === null && mql.matches) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
})

// wire up presets, mute and keyboard shortcuts
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

    // presets
    document.querySelectorAll('.preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mins = Number(e.currentTarget.dataset.mins) || 0;
            setCustomTime(0, mins, 0);
        })
    });

    // mute toggle
    const muteBtn = $id('muteBtn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            muted = !muted;
            audio.muted = muted;
            muteBtn.textContent = muted ? '🔇' : '🔈';
        })
    }

    // keyboard shortcuts: Space -> play/pause ; R -> reset
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            startCustomTimerCounter();
        }
        if (e.key && (e.key === 'r' || e.key === 'R')) {
            reset();
        }
    });
});
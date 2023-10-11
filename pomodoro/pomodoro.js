const pomoTime = {};
let paused = true;
let currentTime = 0;
let intervalId;
let darkTheme = false;

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3";
let isFirstLoad = true;

if(darkTheme) $id('.counter-background').css({ "background": "rgb(25, 18, 18)" });

function $id(id) {
    return document.getElementById(id);
}

const setPomoTime = (minutes) => {
    audio.play();
    pomoTime.minutes = minutes;
    $id('minutes').innerHTML = minutes.toString().padStart(2, '0');
    $id('seconds').innerHTML = '00';
    currentTime = minutes * 60;
    paused = true;
    $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
    $id('counter-background').classList.remove('active');
    $id('counter-background').classList.add('inactive');
    clearInterval(intervalId);
    isFirstLoad = false;
}

const reset = () => {
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    if (darkTheme) {
        $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
    } else {
        $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    }
    audio.play();
    setPomoTime(pomoTime.minutes); // Reset to the currently set time
}

const updateTimerDisplay = () => {
    const minutesDisplay = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secondsDisplay = (currentTime % 60).toString().padStart(2, '0');
    $id('minutes').innerHTML = minutesDisplay;
    $id('seconds').innerHTML = secondsDisplay;
};

const startPomoCounter = () => {
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

        intervalId = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(intervalId);
                paused = true;
                audio.pause();
                $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
                $id('counter-background').classList.remove('inactive');
                $id('counter-background').classList.add('active');

                if (darkTheme) {
                    $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
                } else {
                    $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
                }
            }
        }, 1000);
    } else {
        clearInterval(intervalId);
        audio.pause();
        $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
        $id('counter-background').classList.remove('inactive');
        $id('counter-background').classList.add('active');

        if (darkTheme) {
            $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
        } else {
            $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
        }
    }
};

if (isFirstLoad) {
    audio.pause();
    isFirstLoad = false;
}

setPomoTime(25);
updateTimerDisplay();

function setLightTheme(){
    darkTheme = false;
    $('.navbar').css({ "background-color": "rgb(5, 30, 54)" });
    $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    $('.timer').css({ "color": "white" })
    $('.inactive').css({"background": "rgb(5, 30, 54)"});
    $('#light').prop("checked", false);
}

function setDarkTheme(){
    darkTheme = true;
    $('.navbar').css({ "background-color": "black" });
    $('.active').css({"color":"#7fe9d4", "background": "#191212"});
    $('.timer').css({ "color": "rgb(216 137 31)" });
    $('.inactive').css({"background": "rgb(25, 18, 18)", "color": "white"})
    $('#light').prop("checked", true);
}

var prefersDarkThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

prefersDarkThemeMql.addEventListener("change", function(mql) {
    if (localStorage.getItem("darkmode") === null && mql.matches) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
})

$(document).ready(function ()
{

    if (
        localStorage.getItem("darkmode") == "true" ||
        (localStorage.getItem("darkmode") === null && prefersDarkThemeMql.matches)
    )
    {
        setDarkTheme();
    }

    $('#light').on("change paste keyup", function (e)
    {
        if (!e.target.checked)
        {
            setLightTheme();
            localStorage.setItem("darkmode", false);
        }
        else
        {
            setDarkTheme();
            localStorage.setItem("darkmode", true);
        }
    });
});
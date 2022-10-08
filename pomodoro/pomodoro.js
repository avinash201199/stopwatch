const pomoTime = {}
var paused = true
var minutes
var timerDate
var remainingTime = 0

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3"  // same audio clip is used for pause,reset

function $id(id) {
    return document.getElementById(id);
}

const setPomoTime = (minutes) => {
    paused = true
    audio.play();
    pomoTime.minutes = minutes
    $id('minutes').innerHTML = minutes
    $id('seconds').innerHTML = '00'
    minutes = pomoTime.minutes
    timerDate = new Date(new Date().getTime() + minutes * 60000)
    remainingTime = 0
    paused = true
    $id('timer-control').innerHTML = 'Play'
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
}
const reset=()=>{
    audio.play();
    if(pomoTime.minutes == 25){
        
        setPomoTime(25);
    }
    else if(pomoTime.minutes == 40){
        setPomoTime(40);
    }
    else{
        setPomoTime(60);
    }
}
const startPomoCounter = (action) => {
    audio.play();
    paused = !paused;

    $id('timer-control').innerHTML = paused ? 'Play' : 'Pause';
    if (!paused) {
        $id('counter-background').classList.remove('active');
        $id('counter-background').classList.add('inactive');
        $id('focus').classList.remove('hidden');
    } else {
        $id('counter-background').classList.remove('inactive');
        $id('counter-background').classList.add('active');
    }
    const updateTimer = () => {
        if (!paused) {
            const date = new Date().getTime() - remainingTime
            const timeLeft = timerDate - date
            $id('minutes').innerHTML = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
            $id('seconds').innerHTML = Math.floor((timeLeft % (1000 * 60)) / 1000)
        } else {
            remainingTime += 300
        }
    }
    setInterval(updateTimer, 1000);
}

setPomoTime(25)
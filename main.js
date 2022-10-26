//Global Variable
const time_el = document.querySelector(".watch .time");
const start_btn = document.getElementById('start');
const stop_btn = document.getElementById("stop");
const reset_btn = document.getElementById("reset");

//Define vars to hold time values 
let seconds = 0 ;

//Define var to hold setInterval() function
let interval = null;

//Event Listeners
 start_btn.addEventListener('click',start);
 stop_btn.addEventListener("click",stop);
 reset_btn.addEventListener("click",reset);


//Stopwatch function (logic to detrmine when to increment next value)
function timer(){
    seconds++;

    // logic to determine when to increment next value. Format our time
    let hrs = Math.floor(seconds/3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60);
    let secs = seconds % 60;
 
    //If second/mintes/hours are only one digit , add a leading 0 to the value
    if(secs < 10) secs = '0' + secs;
    if(mins < 10) mins = "0" + mins;
    if(hrs < 10) hrs ="0" + hrs;  

    //Display updated time values to user
    time_el.innerText = `${hrs}:${mins}:${secs}`;
}

 //Button

 // Function to Start the StopWatch
function start(){
    if(interval){
        return
    }
    interval = setInterval(timer, 1000)  
}

// Function to Stop the StopWatch
function stop(){
    clearInterval(interval);
    interval = null;
}

// Function to Reset the StopWatch
function reset(){
    stop();
    seconds = 0;
    time_el.innerText = '00:00:00';
}
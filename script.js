var hr = 0;
var min = 0;
var sec = 0;
var count = 0;


var timer = false;
var lapCounter = 1;
const audio = new Audio();
audio.src = "audio/sound_trim.mp3";

function $id(id) {
    return document.getElementById(id);
}

function start() {
    audio.play();
    if (!timer){
        timer = true;
		$id("start").innerHTML = '<i class="far fa-pause-circle"></i> Pause';
        stopwatch();
    }
    else
    {
        timer=false;
        $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';
    }
}

/*function stop() {
    timer = false

}
*/
function reset() {
    //hiding record container div
    $id("record-container").style.display = "none";

    audio.play();
    timer = false;
    $id("start").innerHTML = '<i class="far fa-play-circle"></i> Start';

    hr = 0;
    min = 0;
    sec = 0;
    count = 0;

    $id("hr").innerHTML = "00";
    $id("min").innerHTML = "00";
    $id("sec").innerHTML = "00";
    $id("count").innerHTML = "00";

    $id("record-table-body").innerHTML = "";
    lapCounter = 1;

}

let timeoutId;
function stopwatch() {
    clearTimeout(timeoutId);

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
    timeoutId = setTimeout("stopwatch()", 10);
}

function lap() {
    //displaying record container div
    $id("record-container").style.display = "block";
    
    var lap_time = $id("hr").innerHTML + ":" 
    + $id("min").innerHTML + ":" 
    + $id("sec").innerHTML + ":" 
    + $id("count").innerHTML;
    
    if(lap_time=="00:00:00:00"){
        clearLap();
    }
    else{

        audio.play();
        const table = $id("record-table-body");
        const row = table.insertRow(0);
        const no_cell = row.insertCell(0);
        const time_cell = row.insertCell(1);
        
        no_cell.innerHTML = lapCounter;
        time_cell.innerHTML = lap_time;
        
        lapCounter++;
    }
}

function clearLap() {
    //hiding record container div
    $id("record-container").style.display = "none";
    
    audio.play();
    $id('record-table-body').innerHTML = '';
    lapCounter=1;
}

let date;
setInterval(() => {
    date = new Date().toString();
    $id('d1').innerHTML = date;
}, 1000);


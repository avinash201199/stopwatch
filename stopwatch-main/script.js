let startTime = 0;
let elapsedTime = 0;
let timerInterval;

function updateDisplay(time) {
    const hr = Math.floor(time / 3600000);
    const min = Math.floor((time % 3600000) / 60000);
    const sec = Math.floor((time % 60000) / 1000);
    const count = Math.floor((time % 1000) / 10);

    document.getElementById("hr").textContent = hr.toString().padStart(2, "0");
    document.getElementById("min").textContent = min.toString().padStart(2, "0");
    document.getElementById("sec").textContent = sec.toString().padStart(2, "0");
    document.getElementById("count").textContent = count.toString().padStart(2, "0");
}

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay(elapsedTime);
    }, 10);
    document.getElementById("start").disabled = true;
}

function stop() {
    clearInterval(timerInterval);
    document.getElementById("start").disabled = false;
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateDisplay(elapsedTime);
    document.getElementById("start").disabled = false;
}

function lap() {
    const laps = document.getElementById("laps");
    const li = document.createElement("li");
    const hr = document.getElementById("hr").textContent;
    const min = document.getElementById("min").textContent;
    const sec = document.getElementById("sec").textContent;
    const count = document.getElementById("count").textContent;
    li.textContent = `${hr} : ${min} : ${sec} : ${count}`;
    laps.appendChild(li);
}

function clearLap() {
    document.getElementById("laps").innerHTML = "";
}

var hr = 0;
var min = 0;
var sec = 0;
var count = 0;

var timer = false;

function start() {
	document.body.style.setProperty(
		"background",
		"linear-gradient(to left, #3494e6, #ec6ead)",
		"important"
	);

	timer = true;
	stopwatch();
}

function stop() {
	document.body.style.setProperty(
		"background",
		"linear-gradient(to left, #240b36, #c31432)",
		"important"
	);
	timer = false;
}

function reset() {
	document.body.style.setProperty(
		"background",
		"linear-gradient(to right, #191654, #43C6AC)",
		"important"
	);
	timer = false;

	hr = 0;
	min = 0;
	sec = 0;
	count = 0;

	document.getElementById("hr").innerHTML = "00";
	document.getElementById("min").innerHTML = "00";
	document.getElementById("sec").innerHTML = "00";
	document.getElementById("count").innerHTML = "00";
}

function stopwatch() {
	if (timer == true) count = count + 1;

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

	document.getElementById("hr").innerHTML = hrString;
	document.getElementById("min").innerHTML = minString;
	document.getElementById("sec").innerHTML = secString;
	document.getElementById("count").innerHTML = countString;
	setTimeout("stopwatch()", 10);
}


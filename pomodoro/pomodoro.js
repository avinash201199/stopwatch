const pomoTime = {};
let paused = true;
let currentTime = 0;
let intervalId;
let darkTheme = false;

// Pomodoro session tracking
let focusTime = 25;
let restTime = 5;
let isFocusMode = true;
let sessionActive = false;

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3";
let isFirstLoad = true;

if (darkTheme) $id('.counter-background').css({ "background": "rgb(25, 18, 18)" });

function $id(id) {
    return document.getElementById(id);
}

const setPomoTime = (minutes, skipAudio = false) => {
    if (!skipAudio && !isFirstLoad) {
        audio.play();
    }
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
    updateModeDisplay();

    // === Reset Progress Bar ===
    updateProgressBar();
};

const setPomodoroOption = (focus, rest) => {
    focusTime = focus;
    restTime = rest;
    isFocusMode = true;
    sessionActive = false;
    setPomoTime(focusTime);
};

const updateModeDisplay = () => {
    const modeText = isFocusMode ? 'Focus Time' : 'Rest Time';
    $id('current-mode').innerHTML = modeText;
};

const switchMode = () => {
    isFocusMode = !isFocusMode;
    const newTime = isFocusMode ? focusTime : restTime;
    setPomoTime(newTime, true);
    audio.play();
    // Auto-start the next session
    setTimeout(() => {
        if (sessionActive) {
            startPomoCounter();
        }
    }, 1000);
};

const reset = () => {
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    if (darkTheme) {
        $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
    } else {
        $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
    }
    sessionActive = false;
    isFocusMode = true;
    audio.play();
    setPomoTime(focusTime); // Reset to focus time
};

const updateTimerDisplay = () => {
    const minutesDisplay = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secondsDisplay = (currentTime % 60).toString().padStart(2, '0');
    $id('minutes').innerHTML = minutesDisplay;
    $id('seconds').innerHTML = secondsDisplay;
};

// === NEW FUNCTION ===
function updateProgressBar() {
    const progressBar = $id("progress-bar");
    if (!progressBar) return;
    const totalDuration = pomoTime.minutes * 60;
    const progressPercent = (currentTime / totalDuration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Optional color feedback
    if (progressPercent < 20) progressBar.style.backgroundColor = "#f44336";
    else if (progressPercent < 50) progressBar.style.backgroundColor = "#ff9800";
    else progressBar.style.backgroundColor = "#4caf50";
}

const startPomoCounter = () => {
    audio.play();
    paused = !paused;
    
    if (!paused) {
        sessionActive = true;
    }

    $id('timer-control').innerHTML = paused ? '<i class="fas fa-play-circle"></i> Play' : '<i class="fas fa-pause-circle"></i> Pause';

    if (!paused) {
        $id('counter-background').classList.remove('active');
        $id('counter-background').classList.add('inactive');

        if (darkTheme) {
            $('.inactive').css({ "background": "black", "color": "white" });
        } else {
            $('.inactive').css({ "background": "rgb(5, 30, 54)", "color": "rgb(169, 188, 214)" });
        }

        intervalId = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
                updateProgressBar(); // 🔥 Progress updates every second
            } else {
                clearInterval(intervalId);
                paused = true;
                $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
                $id('counter-background').classList.remove('inactive');
                $id('counter-background').classList.add('active');

                if (darkTheme) {
                    $('.active').css({ "color": "#7fe9d4", "background": "#191212" });
                } else {
                    $('.active').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" });
                }
                
                // Reset and switch modes
                updateProgressBar();
                switchMode();
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

// Initialize with default 25/5 Pomodoro
setPomodoroOption(25, 5);
updateTimerDisplay();

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
    $('.inactive').css({ "background": "rgb(25, 18, 18)", "color": "white" });
    $('#light').prop("checked", true);
}

var prefersDarkThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

prefersDarkThemeMql.addEventListener("change", function(mql) {
    if (localStorage.getItem("darkmode") === null && mql.matches) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
});

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
        } else {
            setDarkTheme();
            localStorage.setItem("darkmode", true);
        }
    });
});



let calendarMode = 'universal';
let tokenClient;
let gapiInited = false;
let gisInited = false;

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

function hasAPICredentials() {
    return !CLIENT_ID.includes('YOUR_CLIENT_ID') && !API_KEY.includes('YOUR_API_KEY');
}


function showStatus(message, type = 'info') {
    const statusDiv = $id('calendar-status');
    statusDiv.innerHTML = message;
    statusDiv.className = `status-${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

function createUniversalCalendarEvent(eventDetails) {
    const startDate = new Date(eventDetails.startDateTime);
    const endDate = new Date(eventDetails.endDateTime);
    
    const formatDateTime = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startStr = formatDateTime(startDate);
    const endStr = formatDateTime(endDate);
    
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventDetails.title,
        dates: `${startStr}/${endStr}`,
        details: eventDetails.description || '',
        location: '',
        trp: false
    });
    
    const calendarUrl = `${baseUrl}?${params.toString()}`;
    window.open(calendarUrl, '_blank');
    
    return true;
}

function gapiLoaded() {
    if (hasAPICredentials()) {
        gapi.load('client', initializeGapiClient);
    }
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        calendarMode = 'api';
        maybeEnableButtons();
    } catch (err) {
        console.error('Error initializing GAPI:', err);
        calendarMode = 'universal';
        maybeEnableButtons();
    }
}

function gisLoaded() {
    if (hasAPICredentials()) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '',
        });
        gisInited = true;
        maybeEnableButtons();
    }
}

function maybeEnableButtons() {
    if (calendarMode === 'universal') {
        $id('authorize-btn').style.display = 'none';
        $id('schedule-btn').style.display = 'inline-block';
        $id('signout-btn').style.display = 'none';
    } else if (gapiInited && gisInited) {
        $id('authorize-btn').style.display = 'inline-block';
    }
}

function handleAuthClick() {
    if (calendarMode === 'universal') {
        openScheduleModal();
        return;
    }

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        $id('authorize-btn').style.display = 'none';
        $id('schedule-btn').style.display = 'inline-block';
        $id('signout-btn').style.display = 'inline-block';
        showStatus('Connected to Google Calendar!', 'success');
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function handleSignoutClick() {
    if (calendarMode === 'universal') {
        return;
    }
    
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        $id('authorize-btn').style.display = 'inline-block';
        $id('schedule-btn').style.display = 'none';
        $id('signout-btn').style.display = 'none';
        showStatus('Signed out from Google Calendar', 'info');
    }
}

function openScheduleModal() {
    const modal = $id('scheduleModal');
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().slice(0, 5);
    
    $id('event-date').value = dateStr;
    $id('event-time').value = timeStr;
    $id('event-title').value = isFocusMode ? 'Pomodoro Focus Session' : 'Pomodoro Break';
    
    modal.style.display = 'block';
}

function closeScheduleModal() {
    $id('scheduleModal').style.display = 'none';
}

async function createCalendarEvent(eventDetails) {
    try {
        const event = {
            'summary': eventDetails.title,
            'description': eventDetails.description || 'Pomodoro productivity session',
            'start': {
                'dateTime': eventDetails.startDateTime,
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end': {
                'dateTime': eventDetails.endDateTime,
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'popup', 'minutes': 5}
                ]
            }
        };

        const request = await gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });

        return request.result;
    } catch (err) {
        console.error('Error creating event:', err);
        throw err;
    }
}

$id('calendar-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = $id('event-title').value;
    const date = $id('event-date').value;
    const time = $id('event-time').value;
    const description = $id('event-description').value;
    const includeBreak = $id('include-break').checked;
    
    const focusDuration = focusTime;
    const breakDuration = restTime;
    const totalDuration = includeBreak ? focusDuration + breakDuration : focusDuration;
    
    const startDateTime = `${date}T${time}:00`;
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    const endDateTime = endDate.toISOString().slice(0, 19);
    
    const eventDetails = {
        title: title,
        description: description + `\n\nFocus: ${focusDuration} min | Break: ${breakDuration} min`,
        startDateTime: startDateTime,
        endDateTime: endDateTime
    };
    
    try {
        showStatus('Creating calendar event...', 'info');
        
        if (calendarMode === 'universal') {
            createUniversalCalendarEvent(eventDetails);
            showStatus('Opening Google Calendar to add your event!', 'success');
            closeScheduleModal();
        } else {
            const event = await createCalendarEvent(eventDetails);
            showStatus('Event added to your Google Calendar!', 'success');
            closeScheduleModal();
            
            if (event.htmlLink) {
                setTimeout(() => {
                    if (confirm('Event created! Would you like to view it in Google Calendar?')) {
                        window.open(event.htmlLink, '_blank');
                    }
                }, 500);
            }
        }
    } catch (error) {
        showStatus('Failed to create event. Please try again.', 'error');
        console.error('Error:', error);
    }
});

window.onclick = function(event) {
    const modal = $id('scheduleModal');
    if (event.target == modal) {
        closeScheduleModal();
    }
}

window.addEventListener('load', () => {
    if (hasAPICredentials() && typeof gapi !== 'undefined') {
        gapiLoaded();
    }
    if (hasAPICredentials() && typeof google !== 'undefined') {
        gisLoaded();
    }
    
    if (!hasAPICredentials()) {
        calendarMode = 'universal';
        maybeEnableButtons();
    }
});

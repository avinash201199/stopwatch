console.log('Pomodoro.js script loading...');

const pomoTime = {};
let paused = true;
let currentTime = 0;
let intervalId;
let darkTheme = false;

//time in browser title 
const originalTitle = document.title;
function showCompletionNotification() {
    const message = isFocusMode ? 'Focus session is done! Time for a break.' : 'Break is over! Time to get back to focus.';
    alert(message);
}
// Video background handler
function initializeVideoBackground() {
    const video = document.getElementById('bg-video');
    if (video) {
        // Set video properties to ensure autoplay
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;

        // Force load the video
        video.load();

        // Multiple attempts to start video
        const attemptPlay = () => {
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Background video started playing');
                }).catch(error => {
                    console.log('Video autoplay blocked, retrying:', error);
                    // Try again after a short delay
                    setTimeout(attemptPlay, 100);
                });
            }
        };

        // Start playing immediately
        attemptPlay();

        // Also try when video is loaded
        video.addEventListener('loadeddata', attemptPlay);
        video.addEventListener('canplay', attemptPlay);

        // Add click listener as ultimate fallback
        const startOnInteraction = () => {
            video.play().then(() => {
                console.log('Background video started after user interaction');
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('keydown', startOnInteraction);
                document.removeEventListener('touchstart', startOnInteraction);
            }).catch(err => console.log('Video play error:', err));
        };

        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
    }
}

// Pomodoro session tracking
let focusTime = 25;
let restTime = 5;
let isFocusMode = true;
let sessionActive = false;

const audio = new Audio();
audio.src = "../audio/sound_trim.mp3";
let isFirstLoad = true;

// Simple focus music functionality
let focusMusic = null;
let isMusicPlaying = false;

function initializeFocusMusic() {
    console.log('Initializing focus music...');
    focusMusic = new Audio('../audio/rain.mp3');
    focusMusic.loop = true;
    focusMusic.volume = 0.2; // Set a lower volume for rain sounds
    focusMusic.preload = 'auto';

    focusMusic.addEventListener('loadstart', () => console.log('Focus music loading...'));
    focusMusic.addEventListener('canplaythrough', () => console.log('Focus music ready to play'));
    focusMusic.addEventListener('error', (e) => {
        console.log('Focus music error:', e);
        console.log('Trying alternative path...');
        // Try absolute path as fallback
        focusMusic.src = '/audio/rain.mp3';
        focusMusic.load();
    });
    focusMusic.addEventListener('play', () => console.log('Focus music started playing'));
    focusMusic.addEventListener('pause', () => console.log('Focus music paused'));

    // Force load
    focusMusic.load();

    console.log('Focus music initialized:', focusMusic);
}

if (darkTheme) $('#counter-background').css({ "background": "transparent" });

function $id(id) {
    return document.getElementById(id);
}

const setPomoTime = (minutes, skipAudio = false) => {
    if (!skipAudio && !isFirstLoad) {
        audio.play().catch(() => {
            console.log('Audio play blocked by browser - this is normal on page load');
        });
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
    audio.play().catch(() => {
        console.log('Audio play blocked by browser');
    });
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
        $('.active').css({ "color": "#7fe9d4", "background": "transparent" });
    } else {
        $('.active').css({ "background": "transparent" });
    }
    sessionActive = false;
    isFocusMode = true;
    audio.play().catch(() => {
        console.log('Audio play blocked by browser');
    });
    setPomoTime(focusTime); // Reset to focus time
};

const updateTimerDisplay = () => {
    const minutesDisplay = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secondsDisplay = (currentTime % 60).toString().padStart(2, '0');
    $id('minutes').innerHTML = minutesDisplay;
    $id('seconds').innerHTML = secondsDisplay;

    // Update the page title with timer
    if (!paused) {
        document.title = `${minutesDisplay}:${secondsDisplay} | ${originalTitle}`;
    }
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
    audio.play().catch(e => console.log('Audio play prevented:', e));
    paused = !paused;

    if (!paused) {
        sessionActive = true;
    }

    $id('timer-control').innerHTML = paused ? '<i class="fas fa-play-circle"></i> Play' : '<i class="fas fa-pause-circle"></i> Pause';

    if (!paused) {
        $id('counter-background').classList.remove('active');
        $id('counter-background').classList.add('inactive');

        intervalId = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
                updateProgressBar(); // 🔥 Progress updates every second
            } else {
                clearInterval(intervalId);
                paused = true;
                showCompletionNotification();
                $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
                $id('counter-background').classList.remove('inactive');
                $id('counter-background').classList.add('active');

                if (darkTheme) {
                    $('.active').css({ "color": "#7fe9d4", "background": "transparent" });
                } else {
                    $('.active').css({ "background": "transparent" });
                }

                // Reset and switch modes
                updateProgressBar();
                switchMode();
            }
        }, 1000);
    } else {
        clearInterval(intervalId);
        $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
        $id('counter-background').classList.remove('inactive');
        $id('counter-background').classList.add('active');
        document.title = originalTitle;//on pause , page title appears
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
    
    // Remove dark mode class from body
    $('body').removeClass('dark-mode');
    
    // Navbar styling
    $('.navbar').css({ "background-color": "rgba(255, 255, 255, 0.95)" });
    
    // Title styling
    $('#title1').css({ "color": "#003333" });
    
    // Video overlay for light mode
    $('.video-overlay').css({ "background": "rgba(0, 0, 0, 0.3)" });
    
    // Timer display styling
    $('.timer').css({ "color": "white" });
    $('.active').css({ "background": "transparent" });
    $('.inactive').css({ "background": "transparent" });
    
    // Mode display and text
    $('#current-mode').css({ "color": "white" });
    $('h5').css({ "color": "white" });
    
    // Button styling
    $('.buttons').css({ 
        "border-color": "white",
        "background": "rgba(0, 0, 0, 0.4)",
        "color": "#fefefe"
    });
    
    // Navigation links - always dark
    $('.nav-link').css({ "color": "#003333" });
    
    // Footer styling
    $('.foot').css({ "background": "rgba(255, 255, 255, 0.95)" });
    $('.textfooter').css({ "color": "black" });
    $('.link').css({ "background-color": "#fff", "color": "#000" });
    $('.my-class').css({ "background": "rgba(255, 255, 255, 0.95)" });
    $('footer').css({ "background": "rgba(255, 255, 255, 0.95)" });
    
    // Pomodoro option buttons
    $('.btn-outline-primary').css({
        "color": "#003333",
        "border-color": "#003333",
        "background-color": "transparent"
    });
    
    // Music controls background
    $('#music-controls').css({ "background": "rgba(255,255,255,0.1)" });
    $('#music-controls h5').css({ "color": "white" });
    
    // Progress bar
    $('.progress-container').css({ "background-color": "#ddd" });
    $('#progress-bar').css({ "background-color": "#4caf50" });
    
    // Set checkbox state
    $('#light').prop("checked", false);
}

function setDarkTheme() {
    darkTheme = true;
    
    // Add dark mode class to body
    $('body').addClass('dark-mode');
    
    // Navbar styling
    $('.navbar').css({ "background-color": "rgba(0, 0, 0, 0.95)" });
    
    // Title styling
    $('#title1').css({ "color": "white" });
    
    // Video overlay for dark mode
    $('.video-overlay').css({ "background": "rgba(0, 0, 0, 0.7)" });
    
    // Timer display styling
    $('.timer').css({ "color": "#ff6b35" });
    $('.active').css({ "color": "#ff6b35", "background": "transparent" });
    $('.inactive').css({ "background": "transparent", "color": "white" });
    
    // Mode display and text
    $('#current-mode').css({ "color": "white" });
    $('h5').css({ "color": "white" });
    
    // Button styling
    $('.buttons').css({ 
        "border-color": "#ff6b35",
        "background": "rgba(255, 107, 53, 0.2)",
        "color": "#ff6b35"
    });
    
    // Navigation links - always dark
    $('.nav-link').css({ "color": "#003333" });
    
    // Footer styling
    $('.foot').css({ "background": "rgba(0, 0, 0, 0.95)" });
    $('.textfooter').css({ "color": "white" });
    $('.link').css({ "background-color": "#ff6b35", "color": "white" });
    $('.my-class').css({ "background": "rgba(0, 0, 0, 0.95)" });
    $('footer').css({ "background": "rgba(0, 0, 0, 0.95)" });
    
    // Pomodoro option buttons
    $('.btn-outline-primary').css({
        "color": "#ff6b35",
        "border-color": "#ff6b35",
        "background-color": "transparent"
    });
    
    // Music controls background
    $('#music-controls').css({ "background": "rgba(0,0,0,0.3)" });
    $('#music-controls h5').css({ "color": "white" });
    
    // Progress bar
    $('.progress-container').css({ "background-color": "#333" });
    $('#progress-bar').css({ "background-color": "#ff6b35" });
    
    // Set checkbox state
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


 
// === Calendar Integration ===
function showStatus(message, type = 'info') {
    const statusDiv = $id('calendar-status');
    statusDiv.innerHTML = message;
    statusDiv.className = `status-${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Make sure the calendar button is visible
document.addEventListener('DOMContentLoaded', function() {
    $id('schedule-btn').style.display = 'inline-block';
});

function generateICSFile(eventDetails) {
    // Format dates for iCalendar format (remove dashes and colons)
    const startDate = new Date(eventDetails.startDateTime);
    const endDate = new Date(eventDetails.endDateTime);
    
    const formatDateTime = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startStr = formatDateTime(startDate);
    const endStr = formatDateTime(endDate);
    
    // Create the iCalendar content
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pomodoro Timer//Calendar Event//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}
DTSTART:${startStr}
DTEND:${endStr}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder
TRIGGER:-PT15M
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

function addEventToCalendar(eventDetails) {
    // Create a downloadable .ics file for calendar apps
    const icsContent = generateICSFile(eventDetails);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${eventDetails.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    return true;
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

$id('calendar-form').addEventListener('submit', function(e) {
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
        
        const success = addEventToCalendar(eventDetails);
        if (success) {
            // Show success message with animation
            const successMsg = document.createElement('div');
            successMsg.style.position = 'fixed';
            successMsg.style.bottom = '20px';
            successMsg.style.left = '50%';
            successMsg.style.transform = 'translateX(-50%)';
            successMsg.style.backgroundColor = '#4CAF50';
            successMsg.style.color = 'white';
            successMsg.style.padding = '15px 25px';
            successMsg.style.borderRadius = '8px';
            successMsg.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            successMsg.style.zIndex = '10000';
            successMsg.style.display = 'flex';
            successMsg.style.alignItems = 'center';
            successMsg.style.fontWeight = 'bold';
            successMsg.style.opacity = '0';
            successMsg.style.transition = 'opacity 0.3s ease';
            successMsg.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 10px; font-size: 20px;"></i> Event added to calendar!';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(successMsg);
                }, 300);
            }, 3000);
            
            showStatus(`Event "${title}" added to your calendar!`, 'success');
            closeScheduleModal();
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
// Simple music control function
function toggleMusic() {
    if (!focusMusic) {
        console.log('Focus music not initialized, initializing now...');
        initializeFocusMusic();
        // Wait a bit for initialization
        setTimeout(() => toggleMusic(), 100);
        return;
    }

    console.log('toggleMusic called, isMusicPlaying:', isMusicPlaying);
    console.log('focusMusic:', focusMusic);
    console.log('focusMusic.src:', focusMusic.src);

    if (!isMusicPlaying) {
        console.log('Attempting to play focus music...');

        // Ensure volume and loop are set
        focusMusic.volume = 0.2;
        focusMusic.loop = true;

        focusMusic.play().then(() => {
            console.log('Focus music started successfully');
            isMusicPlaying = true;
            updateMusicStatus(true);
        }).catch((error) => {
            console.log('Focus music play failed:', error);
            console.log('Retrying with user interaction requirement...');
            isMusicPlaying = false;
            updateMusicStatus(false);
        });
    } else {
        console.log('Pausing focus music...');
        focusMusic.pause();
        isMusicPlaying = false;
        updateMusicStatus(false);
    }
}

function updateMusicStatus(isPlaying) {
    const statusElement = $id("music-status");
    const toggleButton = $id("music-toggle");

    console.log('Updating music status, isPlaying:', isPlaying);

    if (statusElement && toggleButton) {
        if (isPlaying) {
            statusElement.textContent = "Pause Focus Music";
            toggleButton.innerHTML = '<i class="fas fa-pause"></i> <span id="music-status">Pause Focus Music</span>';
        } else {
            statusElement.textContent = "Play Focus Music";
            toggleButton.innerHTML = '<i class="fas fa-play"></i> <span id="music-status">Play Focus Music</span>';
        }
    }
}

// Initialize music controls and video background when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing music and video...');
    initializeFocusMusic();
    updateMusicStatus(false);
    initializeVideoBackground();
});

});


// === Calendar Modal Logic ===
function openScheduleModal() {
  const modal = document.getElementById("scheduleModal");
  if (modal) {
    // Apply styles directly to ensure visibility
    modal.style.display = "block";
    modal.style.position = "fixed";
    modal.style.zIndex = "9999";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.overflow = "auto";
    modal.style.backgroundColor = "rgba(0,0,0,0.7)";
    modal.style.backdropFilter = "blur(5px)";
    
    // Set default values
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().slice(0, 5);
    
    document.getElementById("event-title").value = isFocusMode ? "Pomodoro Focus Session" : "Pomodoro Break";
    document.getElementById("event-date").value = dateStr;
    document.getElementById("event-time").value = timeStr;
    
    // Add animation
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
    
    // Ensure modal content is styled properly
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.background = "#1a1a1a";
      modalContent.style.color = "#e0e0e0";
      modalContent.style.margin = "5% auto";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "550px";
      modalContent.style.borderRadius = "20px";
      modalContent.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
      modalContent.style.border = "1px solid rgba(255,255,255,0.1)";
    }
  }
}

function closeScheduleModal() {
  const modal = document.getElementById("scheduleModal");
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}

function addEventToCalendar(eventDetails) {
  try {
    // Format dates for Google Calendar URL
    const startDate = new Date(eventDetails.startDateTime);
    const endDate = new Date(eventDetails.endDateTime);
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS)
    const formatGoogleCalendarDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startStr = formatGoogleCalendarDate(startDate);
    const endStr = formatGoogleCalendarDate(endDate);
    
    // Create Google Calendar URL with event details
    const googleCalendarUrl = 'https://calendar.google.com/calendar/render?' + 
      'action=TEMPLATE' + 
      `&text=${encodeURIComponent(eventDetails.title)}` + 
      `&dates=${startStr}/${endStr}` + 
      `&details=${encodeURIComponent(eventDetails.description)}` + 
      '&sf=true' + 
      '&output=xml';
    
    // Open Google Calendar in a new tab
    window.open(googleCalendarUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return false;
  }
}

function formatDateForICS(dateTimeStr) {
  // Convert "YYYY-MM-DDThh:mm:ss" to "YYYYMMDDThhmmssZ"
  return dateTimeStr.replace(/[-:]/g, '') + 'Z';
}

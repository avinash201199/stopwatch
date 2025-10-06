console.log('Pomodoro.js script loading...');

const pomoTime = {};
let paused = true;
let currentTime = 0;
let intervalId;
let darkTheme = false;

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

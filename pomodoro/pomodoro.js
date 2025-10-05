const pomoTime = {};
let paused = true;
let currentTime = 0;
let intervalId;
let darkTheme = false;

// Audio for notifications
const notificationAudio = new Audio();
notificationAudio.src = "../audio/sound_trim.mp3";

// Background music
const backgroundMusic = new Audio();
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// Pomodoro state
let currentSession = 'focus'; // 'focus' or 'break'
let sessionsCompleted = 0;
let isBackgroundMusicEnabled = true;
let isBackgroundMusicPlaying = false;

// Default lofi tracks (using royalty-free music URLs)
const defaultTracks = [
    'https://www.soundjay.com/misc/sounds/lofi-1.mp3',
    'https://www.soundjay.com/misc/sounds/lofi-2.mp3'
];
let currentTrackIndex = 0;
let customPlaylist = [];

let isFirstLoad = true;

if(darkTheme) $id('.counter-background').css({ "background": "rgb(25, 18, 18)" });

function $id(id) {
    return document.getElementById(id);
}

const setPomoTime = (minutes) => {
    // Only play notification sound if not first load
    if (!isFirstLoad) {
        notificationAudio.play().catch(e => console.log('Audio play prevented:', e));
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
    updateSessionDisplay();
}

const updateSessionDisplay = () => {
    const focusDiv = $id('focus');
    if (currentSession === 'focus') {
        focusDiv.innerHTML = '<h1 class="text-center">Focus Time! 🎯</h1>';
        focusDiv.classList.remove('hide');
    } else {
        focusDiv.innerHTML = '<h1 class="text-center">Break Time! ☕</h1>';
        focusDiv.classList.remove('hide');
    }
}

const reset = () => {
    $id('counter-background').classList.remove('inactive');
    $id('counter-background').classList.add('active');
    notificationAudio.play().catch(e => console.log('Audio play prevented:', e));
    stopBackgroundMusic();
    currentSession = 'focus';
    sessionsCompleted = 0;
    setPomoTime(customFocusTime); // Reset to custom focus time
}

const updateTimerDisplay = () => {
    const minutesDisplay = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secondsDisplay = (currentTime % 60).toString().padStart(2, '0');
    $id('minutes').innerHTML = minutesDisplay;
    $id('seconds').innerHTML = secondsDisplay;
};

const startPomoCounter = () => {
    notificationAudio.play().catch(e => console.log('Audio play prevented:', e));
    paused = !paused;

    $id('timer-control').innerHTML = paused ? '<i class="fas fa-play-circle"></i> Play' : '<i class="fas fa-pause-circle"></i> Pause';

    if (!paused) {
        $id('counter-background').classList.remove('active');
        $id('counter-background').classList.add('inactive');
        $id('focus').classList.remove('hidden');

        if (isBackgroundMusicEnabled && !isBackgroundMusicPlaying) {
            playBackgroundMusic();
        }


        intervalId = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(intervalId);
                paused = true;
                stopBackgroundMusic();
                notificationAudio.play();

                // Switch between focus and break
                if (currentSession === 'focus') {
                    sessionsCompleted++;
                    updateSessionCounter();
                    currentSession = 'break';
                    setPomoTime(customBreakTime); // Custom break time
                } else {
                    currentSession = 'focus';
                    setPomoTime(customFocusTime); // Custom focus time
                }

                $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
                $id('counter-background').classList.remove('inactive');
                $id('counter-background').classList.add('active');

            }
        }, 1000);
    } else {
        clearInterval(intervalId);
        stopBackgroundMusic();
        $id('timer-control').innerHTML = '<i class="fas fa-play-circle"></i> Play';
        $id('counter-background').classList.remove('inactive');
        $id('counter-background').classList.add('active');

    }
};

// Background music functions
const playBackgroundMusic = () => {
    if (customPlaylist.length > 0) {
        if (customPlaylist[0] === 'RAIN_SOUND') {
            // Rain sound is already playing from the preset button
            isBackgroundMusicPlaying = true;
            return;
        } else {
            backgroundMusic.src = customPlaylist[currentTrackIndex];
            backgroundMusic.play().catch(e => console.log('Auto-play prevented:', e));
        }
    } else {
        // Use default background music
        createDefaultBackgroundMusic();
    }
    isBackgroundMusicPlaying = true;
};

const stopBackgroundMusic = () => {
    backgroundMusic.pause();
    isBackgroundMusicPlaying = false;
};

const nextTrack = () => {
    if (customPlaylist.length > 0) {
        currentTrackIndex = (currentTrackIndex + 1) % customPlaylist.length;
        if (isBackgroundMusicPlaying) {
            backgroundMusic.src = customPlaylist[currentTrackIndex];
            backgroundMusic.play();
        }
    }
};

const toggleBackgroundMusic = () => {
    isBackgroundMusicEnabled = !isBackgroundMusicEnabled;
    if (!isBackgroundMusicEnabled) {
        stopBackgroundMusic();
    } else if (!paused) {
        playBackgroundMusic();
    }
    updateMusicButton();
};

const updateMusicButton = () => {
    const musicBtn = $id('music-toggle');
    if (musicBtn) {
        musicBtn.innerHTML = isBackgroundMusicEnabled ?
            '<i class="fas fa-music"></i> Music: ON' :
            '<i class="fas fa-music"></i> Music: OFF';
    }
};

const setCustomPlaylist = () => {
    const input = $id('playlist-input');
    const url = input.value.trim();

    if (url) {
        // For demonstration, we'll show how to handle different URL types
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            alert(`YouTube integration would require:
• YouTube API key from Google Cloud Console
• Server-side audio extraction (legal compliance)
• Playlist parsing via YouTube Data API

Alternative: Try direct audio URLs like:
• https://example.com/music.mp3
• SoundCloud direct links
• Internet radio streams`);
        } else if (url.includes('spotify.com')) {
            alert(`Spotify integration would require:
• Spotify Web API credentials
• User authentication & permissions
• Premium subscription for full tracks

Alternative: Use direct audio URLs or streaming services that allow direct linking.`);
        } else if (url.includes('soundcloud.com')) {
            alert('SoundCloud integration is complex but possible with their API. For now, try direct audio URLs.');
        } else {
            // Try to use as direct audio URL
            customPlaylist = [url];
            currentTrackIndex = 0;
            alert('Custom audio URL set successfully! The track will play when you start the timer.');
        }
        input.value = '';
    }
};

const updateSessionCounter = () => {
    const counter = $id('session-counter');
    if (counter) {
        counter.textContent = sessionsCompleted;
    }
};

let rainSoundInstance = null;
let defaultMusicInstance = null;

// Custom time settings
let customFocusTime = 25;
let customBreakTime = 5;

const setTimePreset = (focusMinutes, breakMinutes) => {
    customFocusTime = focusMinutes;
    customBreakTime = breakMinutes;

    // Reset to new focus time
    currentSession = 'focus';
    sessionsCompleted = 0;
    setPomoTime(customFocusTime);
    updateSessionCounter();

    alert(`✅ Timer set to ${focusMinutes} min focus / ${breakMinutes} min break`);
};

const showCustomTimeInput = () => {
    $id('custom-time-section').style.display = 'block';
};

const hideCustomTimeInput = () => {
    $id('custom-time-section').style.display = 'none';
};

const applyCustomTime = () => {
    const focusTime = parseInt($id('focus-time').value);
    const breakTime = parseInt($id('break-time').value);

    if (focusTime >= 1 && focusTime <= 120 && breakTime >= 1 && breakTime <= 60) {
        setTimePreset(focusTime, breakTime);
        hideCustomTimeInput();
    } else {
        alert('❌ Please enter valid times (Focus: 1-120 min, Break: 1-60 min)');
    }
};

const stopAllSounds = () => {
    // Stop rain sound
    if (rainSoundInstance) {
        rainSoundInstance.stop();
        rainSoundInstance = null;
    }

    // Stop default music
    if (defaultMusicInstance) {
        defaultMusicInstance.stop();
        defaultMusicInstance = null;
    }

    // Stop background music
    stopBackgroundMusic();

    customPlaylist = [];
    currentTrackIndex = 0;
};

const clearAudio = () => {
    stopAllSounds();
    alert('🔇 All audio stopped.');
};

const showExamples = () => {
    alert(`✅ Working Audio URL Examples:

🎵 Lofi Hip-Hop Streams:
• https://streams.ilovemusic.de/iloveradio17.mp3
• https://radio.wanderfm.com/chill

🎧 Focus Music Streams:
• https://radio.stereoscenic.com/asp-s
• https://streams.fluxfm.de/Lounge/mp3-320

📻 Nature/Ambient Sounds:
• https://rainymood.com/audio1110/0.m4a
• http://streaming.radionomy.com/NatureSoundsRadio

🎼 Classical & Instrumental:
• https://streams.classical24.com/classical24.mp3
• https://radio.da.fm/ambient

💡 How to find more:
• Search "internet radio streams" + your music type
• Use apps like Radio Garden, TuneIn for stream URLs
• Many radio stations provide direct stream links

❌ Why YouTube/Spotify don't work:
• Blocked by CORS policy and Terms of Service
• Require complex API setup and user authentication
• YouTube Premium needed for background play`);
};

const createDefaultBackgroundMusic = () => {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.log('Web Audio API not supported');
            return null;
        }

        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.start();

        console.log('Default focus music started');

        return {
            stop: () => {
                oscillator.stop();
                console.log('Default focus music stopped');
            }
        };

    } catch (e) {
        console.log('Web Audio API not supported, using silent background');
        return null;
    }
};

const createRainSound = () => {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;

        const audioContext = new AudioContextClass();

        // Simple rain sound using white noise
        const bufferSize = audioContext.sampleRate * 2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filter to make it sound like rain
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        // Connect: noise -> filter -> gain -> speakers
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Start the rain sound immediately
        noise.start(0);

        console.log('Rain sound started');

        return {
            stop: () => {
                noise.stop();
                console.log('Rain sound stopped');
            }
        };

    } catch (e) {
        console.log('Rain sound generation failed:', e);
        return null;
    }
};

if (isFirstLoad) {
    notificationAudio.pause();
    isFirstLoad = false;
}

// Initialize default background music
if (isBackgroundMusicEnabled) {
    createDefaultBackgroundMusic();
}

setPomoTime(customFocusTime);
updateTimerDisplay();
updateSessionCounter();
updateMusicButton();

function setLightTheme(){
    darkTheme = false;
    $('.navbar').css({ "background-color": "rgba(255, 255, 255, 0.9)" });
    $('.timer').css({ "color": "white", "text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.8)" })
    $('#light').prop("checked", false);
}

function setDarkTheme(){
    darkTheme = true;
    $('.navbar').css({ "background-color": "rgba(0, 0, 0, 0.7)" });
    $('.timer').css({ "color": "rgb(216 137 31)", "text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.8)" });
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
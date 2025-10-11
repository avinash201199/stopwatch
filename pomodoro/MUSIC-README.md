# 🎵 Enhanced Music Playlist System

## Overview
The Pomodoro timer now includes a comprehensive music playlist system with multiple focus tracks and advanced controls.

## Features

### 🎶 Playlist Management
- **6 Focus Tracks**: Rain sounds and 5 additional focus music tracks
- **Auto-play**: Automatically plays next track when current track ends
- **Click to Play**: Click any track in the playlist to play it immediately
- **Visual Indicators**: Current track is highlighted in the playlist

### 🎛️ Music Controls
- **Play/Pause**: Main control button to start/stop music
- **Previous/Next**: Navigate through tracks
- **Shuffle Mode**: Random track selection
- **Repeat Mode**: Loop current track
- **Volume Control**: Adjustable volume slider (0-100%)

### ⌨️ Keyboard Shortcuts
- **M**: Play/Pause music
- **N**: Next track
- **B**: Previous track (Back)
- **S**: Toggle shuffle mode
- **R**: Toggle repeat mode

### 🎨 UI Features
- **Current Track Display**: Shows currently playing track
- **Collapsible Playlist**: Show/hide full track list
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode Support**: Styled for both light and dark themes

## Audio Files
The system uses the following audio files located in `/audio/`:
- `rain.mp3` - Rain sounds (10:00)
- `focus1.mp3` - Focus Session 1 (15:00)
- `focus2.mp3` - Focus Session 2 (12:00)
- `focus3.mp3` - Focus Session 3 (18:00)
- `focus4.mp3` - Focus Session 4 (20:00)
- `focus5.mp3` - Focus Session 5 (14:00)

## Technical Details
- **Audio Format**: MP3 (browser compatible)
- **Volume Range**: 0-100% (default: 30%)
- **Auto-loop**: Tracks loop automatically when repeat mode is enabled
- **Error Handling**: Automatically skips to next track if current track fails to load
- **Browser Compatibility**: Works in all modern browsers

## Usage Tips
1. **Start with Rain Sounds**: The default track provides gentle ambient noise
2. **Use Shuffle**: Enable shuffle for variety during long focus sessions
3. **Adjust Volume**: Keep volume low (20-40%) to avoid distraction
4. **Keyboard Shortcuts**: Use shortcuts for quick control without mouse
5. **Playlist Navigation**: Click tracks in the playlist for instant switching

## Troubleshooting
- **Music Not Playing**: Ensure browser allows audio autoplay or click play button
- **Tracks Skipping**: Check if audio files exist in `/audio/` directory
- **Volume Issues**: Use the volume slider or browser's audio controls
- **Keyboard Shortcuts**: Make sure music controls are visible for shortcuts to work

## Future Enhancements
- Custom track upload
- More audio themes (nature, city, white noise)
- Playlist import/export
- Audio visualization
- Sleep timer functionality

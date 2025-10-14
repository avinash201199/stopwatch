function setLightTheme() {
    // Remove dark mode class from body
    $('body').removeClass('dark-mode');
    
    // Navbar styling
    $('.navbar.navbar-expand-lg.navbar-light').addClass('bg-light');
    $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "rgba(255, 255, 255, 0.95)" });
    
    // Title styling
    $('#title1').css({ "color": "#003333" });
    
    // Smart background targeting - only change body if counter-background doesn't exist
    if ($('#counter-background').length > 0) {
        $('#counter-background').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" }); // For pomodoro/timer pages
    } else {
        $('body').css({ "background": "transparent" }); // Keep video background for main stopwatch page
    }
    
    // Video overlay for light mode
    $('.video-overlay').css({ "background": "rgba(0, 0, 0, 0.3)" });
    
    // Time display styling
    $('.digit').css({ "color": "white" }); // Main stopwatch digits
    $('.timer').css({ "color": "white" }); // Custom timer digits - white in light mode
    $('.txt').css({ "color": "white" });
    $('.todayDate h3').css({ "color": "white" });
    
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
    $('.dummyspace').css({ "background": "linear-gradient(to right, #191654, #43C6AC)", "color": "white" });
    $('.my-class').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" }); // Footer solid background
    
    // Table styling
    $('tr').css({ "background-color": "rgba(255, 255, 255, 0.95)" });
    $('th, td').css({ "color": "#000" });
    $('th').css({ "background-color": "#95A5A6" });
    
    // Mode toggle buttons
    $('.mode-btn').css({ 
        "background-color": "white",
        "color": "#003333",
        "border-color": "#003333"
    });
    $('.mode-btn.active').css({ 
        "background-color": "#003333",
        "color": "white"
    });
    
    // Countdown input
    $('#countdown-minutes').css({ 
        "background-color": "white",
        "color": "#003333",
        "border": "1px solid #003333"
    });
    
    // Set checkbox state
    $('#light').prop("checked", false);
}

function setDarkTheme() {
    // Add dark mode class to body
    $('body').addClass('dark-mode');
    
    // Navbar styling
    $('.navbar.navbar-expand-lg.navbar-light').removeClass('bg-light');
    $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "rgba(0, 0, 0, 0.95)" });
    
    // Title styling
    $('#title1').css({ "color": "white" });
    
    // Smart background targeting - only change body if counter-background doesn't exist
    if ($('#counter-background').length > 0) {
        $('#counter-background').css({ "background": "#191212" }); // For pomodoro/timer pages
    } else {
        $('body').css({ "background": "transparent" }); // Keep video background for main stopwatch page
    }
    
    // Video overlay for dark mode
    $('.video-overlay').css({ "background": "rgba(0, 0, 0, 0.7)" });
    
    // Time display styling
    $('.digit').css({ "color": "#ff6b35" }); // Main stopwatch digits
    $('.timer').css({ "color": "#ff6b35" }); // Custom timer digits - orange in dark mode
    $('.txt').css({ "color": "#ff6b35" });
    $('.todayDate h3').css({ "color": "white" });
    
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
    $('.dummyspace').css({ "background": "#191212", "color": "#ff6b35" });
    $('.my-class').css({ "background": "#191212" }); // Footer solid background
    
    // Table styling
    $('tr').css({ "background-color": "rgba(0, 0, 0, 0.8)" });
    $('th, td').css({ "color": "white" });
    $('th').css({ "background-color": "#333" });
    
    // Mode toggle buttons
    $('.mode-btn').css({ 
        "background-color": "transparent",
        "color": "white",
        "border-color": "white"
    });
    $('.mode-btn.active').css({ 
        "background-color": "#ff6b35",
        "color": "black"
    });
    
    // Countdown input
    $('#countdown-minutes').css({ 
        "background-color": "rgba(0, 0, 0, 0.8)",
        "color": "white",
        "border": "1px solid #ff6b35"
    });
    
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
})

$(document).ready(function ()
{
    // Force initial theme application with a small delay to ensure DOM is fully loaded
    setTimeout(function() {
        if (
            localStorage.getItem("darkmode") == "true" ||
            (localStorage.getItem("darkmode") === null && prefersDarkThemeMql.matches)
        )
        {
            setDarkTheme();
        }
        else
        {
            setLightTheme();
        }
    }, 100); // Small delay to ensure all elements are loaded

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

    // Fullscreen toggle
    $(document).on('click', '#fullscreen-toggle', function() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            const root = document.documentElement;
            if (root.requestFullscreen) root.requestFullscreen();
            else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
            else if (root.msRequestFullscreen) root.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        }
    });

    // Update fullscreen icon on change
    function syncFsIcon() {
        const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        const $btn = $('#fullscreen-toggle i');
        if ($btn.length) {
            if (isFs) {
                $btn.removeClass('fa-expand').addClass('fa-compress');
                $('#fullscreen-toggle').attr('aria-label', 'Exit fullscreen').attr('title', 'Exit fullscreen');
            } else {
                $btn.removeClass('fa-compress').addClass('fa-expand');
                $('#fullscreen-toggle').attr('aria-label', 'Enter fullscreen').attr('title', 'Enter fullscreen');
            }
        }
    }

    document.addEventListener('fullscreenchange', syncFsIcon);
    document.addEventListener('webkitfullscreenchange', syncFsIcon);
    document.addEventListener('msfullscreenchange', syncFsIcon);
    // Initial sync
    syncFsIcon();
});

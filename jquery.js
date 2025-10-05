function setLightTheme() {
    $('.navbar.navbar-expand-lg.navbar-light').addClass('bg-light');
    $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "" }); // Reset navbar background
    $('#title1').css({ "color": "black" });
    
    // Smart background targeting - only change body if counter-background doesn't exist
    if ($('#counter-background').length > 0) {
        $('#counter-background').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" }); // For pomodoro/timer pages
    } else {
        $('body').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" }); // For main stopwatch page
    }
    
    $('.digit').css({ "color": "white" }); // Main stopwatch digits
    $('.timer').css({ "color": "white" }); // Custom timer digits - white in light mode
    $('#light').prop("checked", false);
    $('.foot').css({ "background": "white" });
    $('.dummyspace').css({ "background": "linear-gradient(to right, #191654, #43C6AC)", "color": "white" });
    $('.my-class').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" }); // Footer solid background
 
   
}

function setDarkTheme() {
    $('.navbar.navbar-expand-lg.navbar-light').removeClass('bg-light');
    $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "black" });
    $('#title1').css({ "color": "black" });
    
    // Smart background targeting - only change body if counter-background doesn't exist
    if ($('#counter-background').length > 0) {
        $('#counter-background').css({ "background": "#191212" }); // For pomodoro/timer pages
    } else {
        $('body').css({ "background": "#191212" }); // For main stopwatch page
    }
    
    $('.digit').css({ "color": "rgb(216 137 31)" }); // Main stopwatch digits
    $('.timer').css({ "color": "rgb(216 137 31)" }); // Custom timer digits - orange in dark mode
    $('.buttons').css({ "border-color": "white" });
    $('#light').prop("checked", true);
    $('.foot').css({ "background": "#a7a7a7 " });
    $('.dummyspace').css({ "background": "#191212", "color": "rgb(216 137 31)" });
    $('.my-class').css({ "background": "#191212" }); // Footer solid background
   

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
});

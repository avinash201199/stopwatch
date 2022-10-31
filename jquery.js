function setLightTheme() {
    $('.navbar.navbar-expand-lg.navbar-light').addClass('bg-light');
    $('#title1').css({ "color": "black" });
    $('body').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" })
    $('.digit').css({ "color": "white" })
    $('#light').prop("checked", false);
}

function setDarkTheme() {
    $('.navbar.navbar-expand-lg.navbar-light').removeClass('bg-light');
    $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "black" });
    $('#title1').css({ "color": "black" });
    $('body').css({ "background": "#191212" });
    $('.digit').css({ "color": "rgb(216 137 31)" });
    $('.buttons').css({ "border-color": "white" });
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

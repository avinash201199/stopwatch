$(document).ready(function ()
{

    if (localStorage.getItem("darkmode") == "true")
    {
        $('.navbar.navbar-expand-lg.navbar-light').removeClass('bg-light');
        $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "black" });
        $('#title1').css({ "color": "white" });
        $('body').css({ "background": "#191212" })
        $('.digit').css({ "color": "rgb(216 137 31)" })
        $('#light').click();
    }

    $('#light').on("change paste keyup", function (e)
    {
        if (!e.target.checked)
        {
            $('.navbar.navbar-expand-lg.navbar-light').addClass('bg-light');

            $('#title1').css({ "color": "black" });
            $('body').css({ "background": "linear-gradient(to right, #191654, #43C6AC)" })
            $('.digit').css({ "color": "white" })

            localStorage.setItem("darkmode", false);
        }
        else
        {
            $('.navbar.navbar-expand-lg.navbar-light').removeClass('bg-light');
            $('.navbar.navbar-expand-lg.navbar-light').css({ "background-color": "black" });
            $('#title1').css({ "color": "white" });
            $('body').css({ "background": "#191212" })
            $('.digit').css({ "color": "rgb(216 137 31)" })
            localStorage.setItem("darkmode", true);
        }
    });
});

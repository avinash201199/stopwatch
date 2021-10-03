$( document ).ready(function() {
    $('#dark').hide();
    
    $('#light').click(function(){
        $('.navbar.navbar-expand-lg.navbar-light').removeClass('bg-light');
        $('.navbar.navbar-expand-lg.navbar-light').css({"background-color":"black"});
        $('#title1').css({"color":"white"});
        $('#light').hide();
        $('body').css({"background":"#191212"})
        $('.digit').css({"color":"rgb(216 137 31)"})
        $('#dark').show();
    });

    $('#dark').click(function(){
        $('.navbar.navbar-expand-lg.navbar-light').addClass('bg-light');
        
        $('#title1').css({"color":"black"});
        $('#light').show();
        $('body').css({ "background": "linear-gradient(to right, #191654, #43C6AC)"})
        $('#dark').hide();
    });

});
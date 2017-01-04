var folder = "./img/";

$.ajax({
    url : folder,
    success: function (data) {
        $(data).find("a").attr("href", function (i, val) {
            if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                $(".carousel").append( "<div><img src='"+ folder + val +"' style='height:inherit;'></div>" );
            } 
        });
    }
});
$(document).ajaxComplete(function() {
    $('.carousel').slick({
        arrows: true,
        dots: true,
        centerMode: true,
        centerPadding: '50px',
        variableWidth: true
    });
});
/* Set the width of the side navigation to 250px */
function openNav() {
    if ($(window).width() < 800) {
        $("#holder").width('70%');
        $("#closebtn").css('display', 'block');
    }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    if ($(window).width() < 800) {
        $("#holder").width('0');
        $("#closebtn").css('display', 'none');
    }
}
var image_urls = []
var folder = './img/';
var count = 0;
$.ajax({
    url : folder,
    success: function (data) {
        $(data).find("a").attr("href", function (i, val) {
            if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                $("#img-gal").append( "<div class='img' id="+count+"><img src='"+folder+val + "'></div>");
                count ++;
            } 
        });
    }
});
var curr_display = 0;
var next_display = null;
$(document).ready(function() {
    $(document).ajaxStop(function() {
        if(count > 0) {
            $('#0').css('display', 'block');
            for(i = 1; i < count; i++) {
                $('#'+i).css('display','none');
            }
        }
    });
    nextpic = function() {
        if (curr_display < count-1) {
            next_display = curr_display + 1;
        }
        else {
            next_display = 0;
        }
        for(i = 0; i < count; i++) {
            $('#'+i).css('display','none');
        }
        $('#'+next_display).css('display','block');
        curr_display = next_display;
    }
    prevpic = function() {
        if (curr_display > 0) {
            next_display = curr_display - 1;
        }
        else {
            next_display = count-1;
        }
        for(i = 0; i < count; i++) {
            $('#'+i).css('display','none');
        }
        $('#'+next_display).css('display','block');
        curr_display = next_display;
    }
    $('#prev').mousedown(function(e){ e.preventDefault(); });
    $('#next').mousedown(function(e){ e.preventDefault(); });
});
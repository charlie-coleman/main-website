var over = false;
$(document).ready(function() {
    $('.link').each(function(i, obj) {
        $(this).hover(function() {
            $('html').css('background-color', 'rgba(255, 255, 240, 0)');
            $($('.image')[i]).css({
                'visibility':'visible',
                'opacity':'1'
            });
        });
    });
    $('.link').mouseleave(function() {
        $('html').css('background-color',  'rgba(255, 255, 240, 1)');
        $('.image').each(function() {
            $(this).css({
                'visibility':'hidden',
                'opacity':'0'
            });
        })
    });
});
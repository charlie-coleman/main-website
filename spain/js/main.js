var image_urls = [];

$(document).ready(function() {
    FindFiles('./img/', '.jpg', image_urls);
});
$(document).ajaxStop(function() {
    addToPage(image_urls);
    $('#large-carousel').slick({
        slidesToShow: 1,
        infinite: true,
        slidesToScroll: 1,
        asNavFor: '#small-carousel',
        arrows: false,
        lazyLoad: 'progressive',
        adaptiveHeight: true,
        fade: true
    });
    $('#small-carousel').slick({
        slidesToScroll: 1,
        asNavFor: '#large-carousel',
        dots: false,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        variableWidth: true,
        lazyLoad: 'progressive'
    });
});

FindFiles = function(folder, ext, array) {
    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: folder,
        success: function (data) {
            //List all .png file names in the page
            $(data).find("a:contains(" + ext + ")").each(function () {
                var filename = this.href.replace(window.location.href.replace('/index.html', ''), ".");
                array.push( filename );
            });
            }
    });
}

addToPage = function(array) {
    for (var i = 0; i < array.length; i++) {
        if(i < 10 || i > array.length - 10) {
            $('#large-carousel').append("<img class='img' src='"+array[i]+"'>");
            $('#small-carousel').append("<img class='img' src='"+array[i]+"'>");
        }
        else {
            $('#large-carousel').append("<img class='img' data-lazy='"+array[i]+"'>");
            $('#small-carousel').append("<img class='img' data-lazy='"+array[i]+"'>");
        }
    }
}
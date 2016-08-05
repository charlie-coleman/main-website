equalheight = function(container){

    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
    $(container).each(function() {
        $el = $(this);
        $($el).height('auto')
        topPostion = $el.position().top;

        if (currentRowStart != topPostion) {
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        }
        else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) :    (currentTallest);
        }
        for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
}
function openTab(tabName) {
    var i;
    var tabID;
    var tabs = $('.choice');
    if (tabName == 'main-body') {
        tabID = '#tab2';
        otherID = '#tab1';
        $('#footer').css('display','block');
    }
    else if (tabName=='about-me') {
        tabID = '#tab1';
        otherID = '#tab2';
        $('#footer').css('display','none');
    }
    var x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    var id = '#'+tabName;
    $(id).css('display', 'table');
    $(tabID).css({
        'background-color':"#FAFAFA",
        'color':"#777"
    });
    $(otherID).css({
        'background-color':"#777",
        'color':"#FAFAFA"
    });
    setTimeout(function() {
        equalheight('.main-link');
    }, 100);
}
var tabs = ['main-tab', 'about-me'];
$(document).ready(function() {
    var x = location.hash;
    x = x.substr(1, x.length-1);
    if (x == null || tabs.indexOf(x) == -1) {
        x = 'main-body';
    }
    openTab(x);
    equalheight('.main-link, .pic-link');
    setTimeout(function() {
        equalheight('.main-link, .pic-link');
    }, 10);
    $('#about-me').css('margin-bottom',$('#footer').height());
    $('#main-body').css('margin-bottom',$('#footer').height()+25);
    $('.navbar .choice').css('margin-top', $('#holder').height()-$('.navbar .choice').height()+2)
});
$(window).bind('load', equalheight('.main-link'));

$(window).resize(function(){
    equalheight('.main-link, .pic-link');
    $('#about-me').css('margin-bottom',$('#footer').height());
    $('#main-body').css('margin-bottom',$('#footer').height()+25);
    $('.navbar.choice').css('margin-top', $('#holder').height()-$('.navbar.choice').height()+2)
});
window.equalheight = equalheight;

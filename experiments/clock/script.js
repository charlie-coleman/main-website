function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}


var seconds = 60;
var count = 0;
var s = 0.55;
var v = 1;
function update() {
    count += 1;
    var now = new Date();
    var timeNow = padLeft(now.getHours(), 2)+':'+padLeft(now.getMinutes(),2)+':'+padLeft(now.getSeconds(),2);
    $('#time').text(timeNow);
    var diff = Date.now() % (seconds * 1000);
    var h = diff / (seconds * 1000);
    var rgb = HSVtoRGB(h, s, v);
    var compliment = HSVtoRGB((h+0.5)%1, 1, 1);
    $('body').css('background-color', 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
    var font_size = Math.min($(window).innerWidth()*.1,
                             $(window).innerHeight()*0.5,
                             100);
    $('#time').css({
        'color':'rgb('+compliment.r+','+compliment.g+','+compliment.b+')',
        'font-size':font_size
    })
    $('#color').css({
        'color':'rgb('+compliment.r+','+compliment.g+','+compliment.b+')',
        'font-size':font_size*0.25
    })
    var hex = '#'+padLeft(rgb.r.toString(16),2)+padLeft(rgb.g.toString(16),2)+padLeft(rgb.b.toString(16),2)
    $('#color').text(hex);
}

$(document).ready(function() {
    setInterval(update, 1);
});
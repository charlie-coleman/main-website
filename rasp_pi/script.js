window.onload = function() {
    var lastfm = new LastFM({
        apiKey: '757af7bb63a50e97ce6752f48756951c',
        cache: cache
    });
    LastFMStatus.init({
        username: "lushlollipop",
        apikey: '757af7bb63a50e97ce6752f48756951c'
    });
}
var text = '';
var changeColor = false;
var count = 0;
$(document).ready(function() {
    $('#cal').fullCalendar({
        googleCalendarApiKey: 'AIzaSyAaIMcS3VZFqoavOWDLRqbi4TxNonVJ7xU',
        eventSources: [
            {
                googleCalendarId: 'coleman.charlie97@gmail.com',
                color: '#040',
                textColor: '#FFF'
            },
            {
                googleCalendarId: 'colemanct@slu.edu',
                color: '#004',
                textColor: '#FFF'
            }
        ],
        height: $(window).height() * 0.80,
        header: {
            left: 'title',
            center: '',
            right: '',
        },
        eventLimit: 5,
        fixedWeekCount: false
    });
    setInterval(function() {
        count += 1;
        if(count > 180) {
            location.reload();
        }
        LastFMStatus.init({
            username: 'lushlollipop',
            apikey: '757af7bb63a50e97ce6752f48756951c'
        });
        if(changeColor && text != $('#lfm').text()) {
            var text = $('#lfm').text();
            text = text.replace(/\s+/g, '');
            var  symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\",];
            symbols = symbols.concat(["|", ";", ":", "\'", "\"", ",", "<", ".", ">", "/", "?", "`", "~"]); //All accepted symbols currently
            var replaced = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h",  "i",];
            replaced = replaced.concat(["j", "k", "l",  "m",  "n", "o", "p", "q", "r", "s", "t", "y", "v"]); //What they will be replaced with
            for(var i = 0; i < symbols.length; i++) {//replace all those symbols if they are found
                var hold_count = (text.split(symbols[i])).length-1;
                for(var j = 0; j < hold_count; j++) {
                    text = text.replace(symbols[i], replaced[i]);
                }
            }
            text = text.toLowerCase();
            text = text + text.substring(0, text.length % 3-1);
            var third = text.length/3;
            var r_string = text.substring(0, third);
            var g_string = text.substring(third, 2*third);
            var b_string = text.substring(2*third, 3*third);
            var r_dec = parseInt(r_string, 36);
            var g_dec = parseInt(g_string, 36);
            var b_dec = parseInt(b_string, 36);
            var max = Math.pow(36,r_string.length)-1;
            var r = Math.round(r_dec / max * 255);
            var g = Math.round(g_dec / max * 255);
            var b = Math.round(b_dec / max * 255);
            var hsv = rgb2hsv(r, g, b);
            var h = hsv.h;
            var s = hsv.s;
            var v = hsv.v;
            var rgb = HSVtoRGB(h, s, v);
            var comp = HSVtoRGB((h+0.5)%1, 1, v);
            $('body').css('background-color', 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
            $('body').css('color', 'rgb('+comp.r+','+comp.g+','+comp.b+')');
        }
    }, 1000);
});
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
function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: h,
        s: s,
        v: v
    };
}
var soundFiles = ["airhorn", "iliketurtles", "whatisgoingon", "bekfest",
                  "damnson", "imagiraffe", "itsatrap", "leeroyjenkins",
                  "profamity", "shiasuprise", "smallloan", "surprisemotherfucker",
                  "triple", "weedeveryday", "xfiles", "sniper",
                  "china", "fuckherrightinthepussy", "hitmarker", "getthecamera",
                  "fatality", "timallengrunt", "ballsofsteel", "awfuck",
                  "icantbelieve", "fuckrichard", "itsonlygame", "whyyouhavetobemad",
                  "loudestorgasm", "iknowwords", "thatsaten", "smacking",
                  "really", "onthespectrum", "aysat", "jcijb",
                  "hughmungus", "wot", "jimboonieonly", "bork"];
var soundNames = ["Airhorn", "I like turtles", "What is going on here?", "BEKFEST",
                  "Damn son, where\'d you find this?", "I\'m a giraffe", "It\'s a trap!", "Leeroy Jenkins",
                  "Watch yo profamity", "Just do it!", "Small loan", "Suprise, motherfucker",
                  "Oh Baby a Triple!", "Smoke Weed Everyday", "XFiles", "Intervention",
                  "China", "In the pussy", "Hitmarker", "Mom, get the camera!",
                  "Fatality", "Tim Allen", "Balls of Steel", "Aw Fuck",
                  "I Can\'t Believe", "What the fuck.", "It\'s only game", "Why you have to be mad?",
                  "Loudest Orgasm", "I Know Words","That\'s A Ten", "Cover All 9000 Tastebuds",
                  "Really!", "Thanks Mr. On-the-Spectrum!", "Are you sure?", "Jesus Christ",
                  "Hugh. Mungus.", "Wot?", "It\'s free!", "bork"];
var start_filepath = "soundfiles/";
var extension = '.mp3';
var randColor = function() {
    var h = Math.random();
    var s = 0.5+Math.random()/2;
    var v = 0.5+Math.random()/2;
    rgb = HSVtoRGB(h, s, v);
    comp_rgb = HSVtoRGB((h+0.5)%1, s, v)
    rgb_string = '#'+rgb.r.toString(16).padZero(2)+
                     rgb.g.toString(16).padZero(2)+
                     rgb.b.toString(16).padZero(2);
    comp_rgb_string = '#'+comp_rgb.r.toString(16).padZero(2)+
                          comp_rgb.g.toString(16).padZero(2)+
                          comp_rgb.b.toString(16).padZero(2);
    return [rgb_string, comp_rgb_string];
}
var buttons = [];
var audio_elements = [];
var preload = "auto";
var repeat = true;
$(document).ready(function() {
    /*var html_colors = randColor();
    $('html').css({
        'background-color': html_colors[0],
        'color': html_colors[1]
    });*/
    for (var i = 0; i < soundFiles.length; i++) {
        buttons[i] = $("<input>", {type:"button", class: "btn", value:soundNames[i], id:i.toString()});
        var colors = randColor();
        buttons[i].css({
            'background-color': colors[0],
            'color': colors[1]
        });
        $("#buttons").append(buttons[i]);
        audio_elements[i] = new Audio5js({
            swf_path: './audio5js.swf',
            throw_errors: true,
            format_time: true,
            ready: function (player) {
                this.load(start_filepath+soundFiles[i]+extension);
            }
        });
    }
    buttons_arr = $('.btn');
    $('.btn').click(function(e) {
        num = parseInt(e.currentTarget.id);
        var hold_audio = audio_elements[num];
        if (hold_audio != null && hold_audio.playing) {
            if (repeat) {
                console.log('triggered1');
                audio_elements.push(new Audio5js({
                    swf_path: './audio5js.swf',
                    throw_errors: true,
                    format_time: true,
                    ready: function (player) {
                        this.load(start_filepath+soundFiles[num]+extension);
                        this.play();
                        this.on('ended', function() {
                            audio_elements.splice(audio_elements.indexOf(this), 1);
                        });
                    }
                }));
            }
            else {
                if(!repeat) {
                    for (var i = 0; i < audio_elements.length; i++) {
                        audio_elements[i].volume(0);
                    }
                }
                hold_audio.pause();
                hold_audio.seek(0);
                hold_audio.play();
                hold_audio.volume(1);
            }
        }
        else if (hold_audio != null) {
            if(!repeat) {
                for (var i = 0; i < audio_elements.length; i++) {
                    audio_elements[i].volume(0);
                }
            }
            hold_audio.play();
            hold_audio.volume(1);
        }
    });
});

String.prototype.padZero = function(len, c){
    var s= this, c= c || '0';
    while(s.length< len) s= c+ s;
    return s;
}

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

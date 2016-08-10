var soundFiles = ["airhorn", "iliketurtles", "whatisgoingon", "bekfest",
                  "damnson", "imagiraffe", "itsatrap", "leeroyjenkins",
                  "profamity", "shiasuprise", "smallloan", "surprisemotherfucker",
                  "triple", "weedeveryday", "xfiles", "sniper",
                  "china", "fuckherrightinthepussy", "hitmarker", "getthecamera",
                  "fatality", "timallengrunt", "ballsofsteel", "awfuck",
                  "icantbelieve", "fuckrichard", "itsonlygame", "whyyouhavetobemad",
                  "loudestorgasm", "iknowwords", "thatsaten", "smacking",
                  "really","onthespectrum"];
var soundNames = ["Airhorn", "I like turtles", "What is going on here?", "BEKFEST",
                  "Damn son, where\'d you find this?", "I\'m a giraffe", "It\'s a trap!", "Leeroy Jenkins",
                  "Watch yo profamity", "Just do it!", "Small loan", "Suprise, motherfucker",
                  "Oh Baby a Triple!", "Smoke Weed Everyday", "XFiles", "Intervention",
                  "China", "In the pussy", "Hitmarker", "Mom, get the camera!",
                  "Fatality", "Tim Allen", "Balls of Steel", "Aw Fuck",
                  "I Can\'t Believe", "What the fuck.", "It\'s only game", "Why you have to be mad?",
                  "Loudest Orgasm", "I Know Words","That\'s A Ten", "Cover All 9000 Tastebuds",
                  "Really!", "Thanks Mr. On-the-Spectrum!"];
var start_filepath = "soundfiles/";
var extension = '.mp3';
var buttons = [];
var audio_elements = [];
var preload = "auto";
$(document).ready(function() {
    for (var i = 0; i < soundFiles.length; i++) {
        buttons[i] = $("<input>", {type:"button", class: "btn", value:soundNames[i], id:i.toString()});
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
        if (hold_audio.playing) {
            hold_audio.pause();
            hold_audio.seek(0);
            hold_audio.play();
        }
        else {
            hold_audio.play();
        }
    });
});

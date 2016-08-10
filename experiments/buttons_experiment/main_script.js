var soundFiles = ["airhorn.wav", "iliketurtles.wav", "whatisgoingon.wav", "bekfest.wav",
                  "damnson.wav", "imagiraffe.wav", "itsatrap.wav", "leeroyjenkins.wav",
                  "profamity.wav", "shiasuprise.wav", "smallloan.wav", "surprisemotherfucker.wav",
                  "triple.wav", "weedeveryday.wav", "xfiles.wav", "sniper.wav",
                  "china.wav", "fuckherrightinthepussy.wav", "hitmarker.wav", "getthecamera.wav",
                  "fatality.wav", "timallengrunt.wav", "ballsofsteel.wav", "awfuck.wav",
                  "icantbelieve.wav", "fuckrichard.wav", "itsonlygame.wav", "whyyouhavetobemad.wav",
                  "loudestorgasm.wav", "iknowwords.wav", "thatsaten.wav", "smacking.wav",
                  "really.wav","onthespectrum.wav"];
var soundNames = ["Airhorn", "I like turtles", "What is going on here?", "BEKFEST",
                  "Damn son, where\'d you find this?", "I\'m a giraffe", "It\'s a trap!", "Leeroy Jenkins",
                  "Watch yo profamity", "Just do it!", "Small loan", "Suprise, motherfucker",
                  "Oh Baby a Triple!", "Smoke Weed Everyday", "XFiles", "Intervention",
                  "China", "In the pussy", "Hitmarker", "Mom, get the camera!",
                  "Fatality", "Tim Allen", "Balls of Steel", "Aw Fuck",
                  "I Can\'t Believe", "What the fuck.", "It\'s only game", "Why you have to be mad?",
                  "Loudest Orgasm", "I Know Words","That\'s A Ten", "Cover All 9000 Tastebuds",
                  "Really!", "Thanks Mr. On-the-Spectrum!"];
var start_filepath = "http://charlie-coleman.com/experiments/buttons/soundfiles/";
var buttons = [];
var audio_elements = [];
var preload = "auto";
$(document).ready(function() {
    $('*').dblclick(function(e) {
        e.preventDefault();
    });
    for (var i = 0; i < soundFiles.length; i++) {
        buttons[i] = $("<input>", {type:"button", class: "btn", value:soundNames[i], id:i.toString()});
        $("#buttons").append(buttons[i]);
        audio_elements[i] = new Audio(start_filepath+soundFiles[i]);
        audio_elements[i].preload = preload;
    }
    buttons_arr = $('.btn');
    $('.btn').click(function(e) {
        num = parseInt(e.currentTarget.id);
        var hold_audio = audio_elements[num];
        if (!hold_audio.paused) {
            hold_audio.pause();
            hold_audio.currentTime = 0;
            hold_audio.play();
        }
        else {
            hold_audio.play();
        }
    });
});

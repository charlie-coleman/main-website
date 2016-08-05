$(document).ready(function () {
    var soundFiles = ["drewfatbird.wav", "drewsofat.wav","drewwow.wav","drewholycrap.wav", "drewwhatthecrap.wav","drewpretty.wav","drewgulps.wav","drewhuhuhuh.wav"],soundNames = ["Fattest Bird", "Soo fat", "WOW","Holy Crap!", "What the crap!","Pretty and Mysterious","Big Gulp","Huh Huh Huh Huh"], buttons = [], audioElements = [], labels = [], fakeImg = [], lastClick, repSound = [], numSound = 0, repeat = false;
    for (var i = 0; i < soundFiles.length; i ++) {
        var name = "button" + i.toString();
        var title = "title" + i.toString();
        var imgs = "img" + i.toString();
        audioElements[i] = document.createElement("audio");
        audioElements[i].setAttribute('src', 'soundfiles/' + soundFiles[i]);
        buttons[i] = $("<button>", {id: name, class: "butt"});
        labels[i] =  $("<span>", {id: title, class: "title"});
        $("#buttons").append(buttons[i]);
    }
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].css("height", buttons[i].width());
        var color = randColor();
        buttons[i].css("background-color", "#" + color);
        buttons[i].css("color", invert(color));
        buttons[i].append(labels[i]);
        labels[i].text(soundNames[i]);
    }
    $(".butt").click(function() {
        var idFull = $(this).attr('id').toString();
        var idFull = $(this).attr('id').toString();
        var num = parseInt(idFull.replace("button", ""));
        if(!repeat) {
            for(var i = 0; i < audioElements.length; i ++) {
                audioElements[i].pause();
                audioElements[i].currentTime = 0;
            }
            for(var i = 0; i < repSound.length; i++) {
                repSound.splice(i,1);
            }
            numSound = 0;
            audioElements[num].play();
        }
        else if(num == lastClick && repeat) {
            repSound[numSound] = document.createElement("audio");
            repSound[numSound].setAttribute('src', 'soundfiles/' + soundFiles[num]);
            repSound[numSound].play();
            numSound++;
        }
        else if(num != lastClick && repeat) {
            for(var i = 0; i < repSound.length; i++) {
                repSound[i].pause()
                repSound.splice(i,1);
            }
            numSound = 0;
            audioElements[num].play();
        }
        lastClick = num;
    });
    $("#toggle").click(function() {
        repeat = !repeat; 
        var labelToggle = (repeat) ? $("#toggle").text().substr(0,23) + "On" : $("#toggle").text().substr(0,23) + "Off";
        $("#toggle").text(labelToggle);
    });
    $("<div>").on("tap", function() {
        var idFull = $(this)[0].attr('id').toString();
        var num = parseInt(idFull.replace("button", ""));
        if(num != lastClick) {
            for(var i = 0; i < audioElements.length; i ++) {
                audioElements[i].pause();
                audioElements[i].currentTime = 0;
            }
            for(var i = 0; i < repSound.length; i++) {
                repSound.splice(i,1);
            }
            numSound = 0;
            audioElements[num].play();
        }
        else if(num == lastClick) {
            repSound[numSound] = document.createElement("audio");
            repSound[numSound].setAttribute('src', 'soundfiles/' + soundFiles[num]);
            repSound[numSound].play();
            numSound++;
        }
        lastClick = num;
    });
});
$(window).resize(function() {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].css("height", buttons[i].width());
    }
})
function invert(c) {
    var col = ('000000' + (('0xffffff' ^ c).toString(16))).slice(-6);
    return col;
}
function randColor() {
    var r,g,b;
    r = Math.round(Math.random()*255);
    g = Math.round(Math.random()*255);
    b = Math.round(Math.random()*255);
    var red = r.toString(16);
    var blue = b.toString(16);
    var green = g.toString(16);
    if(red.length < 2) red = "0" + red;
    if(green.length < 2) green = "0" + green;
    if(blue.length < 2) blue = "0" + blue;
    return (red + green + blue);
}
var i = 0
function PlayPause(audioFile,volume) {
    var audie = document.getElementById("myAudio");
    audie.volume = volume;
    if (!audie.src || audie.src !== audioFile){audie.src = audioFile;}
    if (i == 0){audie.play(); i = 1;}
    else{audie.pause(); i = 0;}
}
l('musicButton').onclick=function(){if(Game.prefs.christmas && i == 0) PlayPause("img/santaclauseiscomingtotown.mp3",0.1); else if(Game.prefs.christmas && i == 1) audie.play(); else PlayPause(songs[i],0.1);}
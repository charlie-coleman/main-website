
function play(url,volume) {
	var soundFile = document.createElement("audio");
	soundFile.preload = "auto";
	
	var src = document.createElement("source");
	src.src = url;
	soundFile.appendChild(src);
	if(volume > 0)
		soundFile.volume = volume;
	else
		soundFile.volume = 1.0000;
	
	soundFile.load();
	soundFile.play();
	function time() {
	   	soundFile.currentTime = 0.01;
	   	soundFile.volume = volume;
	
	   	setTimeout(function(){soundFile.play();},1);
   	}
}
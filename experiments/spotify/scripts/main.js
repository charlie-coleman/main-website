var userID = "";

$(document).ready(function() {
    var currURL = new URL(location.href);
    userID = currURL.searchParams.get("usr");
    
    setInterval(function() {
        $.get("./scripts/get-playback.php", {usr:userID}, function(data) {
            var array = JSON.parse(data);
            $("#album-art").attr("src", array[0]);
            $("#song-name").text(array[1]);
            $("#artist-name").text(array[2]);
        });
    }, 2500);
    
    setInterval(function() {
        $.get("./scripts/refresh.php");
    }, 300000);
});


function nextSong() {
    $.get("./scripts/next-song.php", {usr:userID});
}

function previousSong() {
    $.get("./scripts/previous-song.php", {usr:userID});
}
window.onload = function() {
    LastFMStatus.init({
        username: "lushlollipop",
        apikey: '757af7bb63a50e97ce6752f48756951c'
    });
}
$(document).ready(function() {
    setInterval(function() {
        LastFMStatus.init({
            username: 'lushlollipop',
            apikey: '757af7bb63a50e97ce6752f48756951c'
        });
    }, 1000);
    setInterval(function() {
        var loc = document.getElementById('calendar').src;
        console.log(loc);
        document.getElementById('calendar').src = loc;
    }, 60000);
});

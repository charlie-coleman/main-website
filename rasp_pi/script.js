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
$(document).ready(function() {
    setInterval(function() {
        LastFMStatus.init({
            username: 'lushlollipop',
            apikey: '757af7bb63a50e97ce6752f48756951c'
        });
    }, 1000);
});

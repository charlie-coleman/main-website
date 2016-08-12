window.onload = function() {
    LastFMStatus.init({
        username: "lushlollipop",
        apikey: '757af7bb63a50e97ce6752f48756951c'
    });
}
var source = 'https://calendar.google.com/calendar/embed?src=coleman.charlie97%40gmail.com&ctz=America/Chicago&';
var alternate = true;
$(document).ready(function() {
    setInterval(function() {
        LastFMStatus.init({
            username: 'lushlollipop',
            apikey: '757af7bb63a50e97ce6752f48756951c'
        });
    }, 1000);
    setInterval(function() {
        if ($('#calendar1').css('display') == 'block') {
            document.getElementById('calendar2').src += '';
            setTimeout(function() {
                console.log('flop');
                $('#calendar2').css('display', 'block');
            }, 1500);
            setTimeout(function() {
                console.log('flop');
                $('#calendar1').css('display', 'none');
            }, 1500);
        }
        else {
            document.getElementById('calendar1').src += '';
            setTimeout(function() {
                console.log('flop');
                $('#calendar1').css('display', 'block');
            }, 1500);
            setTimeout(function() {
                console.log('flop');
                $('#calendar2').css('display', 'none');
            }, 1500);
        }
    }, 3500);
});

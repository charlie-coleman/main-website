SCP({
    selector: '#spotify-widget',
    username: 'lushlollipop',
    api_key: '757af7bb63a50e97ce6752f48756951c',
    width: '100%',
    height: '10%'
});
setInterval(function() {
    $('#spotify-widget').empty();
    SCP({
        selector: '#spotify-widget',
        username: 'lushlollipop',
        api_key: '757af7bb63a50e97ce6752f48756951c',
        width: '100%',
        height: '10%'
    });
}, 10000);
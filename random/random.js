$(window).ready(function() {
    var sites = ["trusty","gray","trusty48","experiments/1","experiments/2"];
    window.location.href = "http://charlie-coleman.com/" + sites[Math.floor(Math.random()*sites.length)];
});
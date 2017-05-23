var canvas = null;
var ctx = null;
var framerate = 150;

var isPaused = false;
var ballSelected = false;
var selectedIndex = null;

var background_color = '#FFF';
var circle_color = '#000';

var circles = [];
var num_circles = 2;
var positions = [];
var velocities = [], max_vel = 3;
var gravity = [0,0.1];
var radii = [], radius = 20;
var masses = [], mass = 40;

var dimensions;

function create() {
    circles = [];
    positions = [];
    velocities = [];
    radii = [];
    masses = [];
    gravity = [0,0.1];
    canvas = document.getElementById('physics');
    ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);
    ctx.canvas.width = $('#physics').width();
    ctx.canvas.height = $('#physics').height();
    dimensions = [ctx.canvas.width, ctx.canvas.height];
    for (var i = 0; i < num_circles; i++) {
        positions[i] = [Math.random()*ctx.canvas.width-radius, Math.random()*ctx.canvas.height-radius];
        velocities[i] = [(2*Math.random()-1)*max_vel, (2*Math.random()-1)*max_vel];
        radii[i] = radius;
        masses[i] = mass;
        circles[i] = new Circle(positions[i], velocities[i], gravity, radii[i], masses[i]);
    }
    $("#gx").val(gravity[0]);
    $("#gy").val(gravity[1]);
}

function update() {
    if(circles.length > 0) { 
        for(var i = 0; i < circles.length; i++) {
            circles[i].update();
            WallCollide(circles[i], dimensions);
            if (circles.length > 1) {
                for(var j = i+1; j < circles.length; j++) {
                    CheckCollision(circles[i], circles[j]);
                }
            }
        }
    }
}

function draw() {
    selectedBallToggle();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (circles.length > 0) {
        for (var i = 0; i < circles.length; i++) {
            circles[i].draw(ctx);
        }
    }
}

$(document).ready(function() {
    create();
    $('#moreoptinput2').css('display','none');
    $('#physics').on('mouseup', function(e) {
        ballSelected = false;
        selectedIndex = null;
        var pos = getMousePos(canvas, e);
        var xPos = pos.x;
        var yPos = pos.y;
        for (var i = 0; i < circles.length; i++) {
            if (Math.pow(xPos-circles[i].pos[0],2)+Math.pow(yPos-circles[i].pos[1], 2) <= Math.pow(circles[i].r,2)) {
                ballSelected = true;
                selectedIndex = i;
                circles[i].color = '#0F0';
            }
            else {
                circles[i].color = '#000';
            }
        }
        setText();
        draw();
    });
    $("#moreoptlist").change(function(e) {
        setText();
        var i = $("#moreoptlist :selected").index();
        if(i == 0 || i == 1) {
            $("#moreoptinput2").css('display','none');
            $("#moreoptinput1").attr('size','12');
        }
        else {
            $("#moreoptinput2").css('display','inline');
            $("#moreoptinput1").attr('size','5');
        }
    });
    setInterval(function() {
        if (isPaused == false) update();
        else return 0;
    }, 1000/60);
    setInterval(function() {
        if (isPaused == false) draw();
        else return 0;
    }, 1000/framerate);
});

$(window).resize(function() {
    ctx.canvas.width = $('#physics').width();
    ctx.canvas.height = $('#physics').height();
    dimensions = [ctx.canvas.height, ctx.canvas.width];
});

var playpause = function() {
    isPaused = !isPaused;
    var html_string;
    (isPaused) ? html_string = "<i class='fa fa-play'></i>" : html_string = "<i class='fa fa-pause'></i>";
    $('#playpause').html(html_string);
}

var addCircle = function() {
    positions.push([Math.random()*ctx.canvas.width-radius, Math.random()*ctx.canvas.height-radius]);
    velocities.push([(2*Math.random()-1)*max_vel, (2*Math.random()-1)*max_vel]);
    radii.push(radius);
    masses.push(mass);
    i = circles.length;
    circles.push(new Circle(positions[i], velocities[i], gravity, radii[i], masses[i]));
}

var removeCircle = function() {
    positions.pop();
    velocities.pop();
    radii.pop();
    masses.pop();
    circles.pop();
}

var setGrav = function() {
    var gx = parseFloat($("#gx").val());
    var gy = parseFloat($("#gy").val());
    gravity = [gx, gy];
    for(var i = 0; i < circles.length; i++) {
        circles[i].g = gravity;
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var selectedBallToggle = function() {
    if(ballSelected) {
        $("#moreoptions").css({
            'display': 'block',
        });
        $("#controls").css({
            'float':'left',
            'width':'45vw'
        }); 
    }
    else {
        $("#moreoptions").css({
            'display': 'none'
        });
        $("#controls").css({
            'float':'left',
            'width':'100vw'
        });
    }
}

var setOption = function() {
    var i = $("#moreoptlist :selected").index();
    if (i == 0) {
        circles[selectedIndex].r = parseFloat($("#moreoptinput1").val());
    }
    if (i == 1) {
        circles[selectedIndex].m = parseFloat($("#moreoptinput1").val());
    }
    if (i == 2) {
        var x = parseFloat($('#moreoptinput1').val());
        var y = parseFloat($('#moreoptinput2').val());
        circles[selectedIndex].v = [x,y];
        circles[selectedIndex].reset_velocity([x,y]);
        circles[selectedIndex].reset_position(circles[selectedIndex].pos);
    }
    if (i == 3) {
        var x = parseFloat($('#moreoptinput1').val());
        var y = parseFloat($('#moreoptinput2').val());
        circles[selectedIndex].pos = [x,y];
        circles[selectedIndex].reset_position([x,y]);
        circles[selectedIndex].reset_velocity(circles[selectedIndex].v);
    }
    draw();
}

var setText = function() {
    var i = $("#moreoptlist :selected").index();
    if(i == 0) {
        $("#moreoptinput1").val(circles[selectedIndex].r);
    }
    else if (i == 1) {
        $("#moreoptinput1").val(circles[selectedIndex].m);
    }
    else if (i == 2) {
        $("#moreoptinput1").val(circles[selectedIndex].v[0]);
        $("#moreoptinput2").val(circles[selectedIndex].v[1]);
    }
    else if (i == 3) {
        $("#moreoptinput1").val(circles[selectedIndex].pos[0]);
        $("#moreoptinput2").val(circles[selectedIndex].pos[1]);
    }
}
/*~~~~VARIABLES~~~~*/
var point_arr = create_array(8,2);
var circle_arr = create_array(8);
var angle_sep = (2*Math.PI)/point_arr.length;
var center_point = [200, 200];
var radius = 100;
var c = null;
var ctx = null;

/*~~~~~CLASSES~~~~~*/
function Circle(x, y, radius, color, velocity_x, velocity_y) {
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.color = color,
    this.vx = velocity_x,
    this.vy = velocity_y,
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};

/*~~~~~~SETUP~~~~~~*/
$(function() {
    c = document.getElementById("physics_shapes");
    c.height = $(window).height();
    c.width = $(window).width();
    ctx = c.getContext("2d");
    for(var i = 0; i < point_arr.length; i++) {
        point_arr[i] = [Math.cos(i*angle_sep)*radius + center_point[0], Math.sin(i*angle_sep)*radius + center_point[1]];
        circle_arr[i] = new Circle(point_arr[i][0], point_arr[i][1], '#000', 10, 0);
    }
});

/*~~~~MAIN LOOP~~~~*/
function update() {
    clear_screen();
    for(var i = 0; i < circle_arr.length; i++) {
        circle_arr[i].x += circle_arr[i].vx;
    circle_arr[i].draw();
    }
}
setInterval(update, 1000/60);
/*~~~~FUNCTIONS~~~~*/
function create_array(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = create_array.apply(this, args);
    }

    return arr;
}
function clear_screen() {
    ctx.clearRect(0, 0, c.width, c.height);   
}
function draw_circle(circle) {
    
}
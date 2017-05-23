function Circle(position, velocity, gravity, radius, mass, color) {
    this.pos = position;
    this.start_velocity = velocity;
    this.start_position = position;
    this.v = velocity;
    this.g = gravity;
    this.r = radius;
    this.m = mass;
    this.color = color || '#000';
    this.update = function() {
        this.pos = AddVector(this.pos, this.v);
        this.v = AddVector(this.v, this.g);
    }
    this.reset_velocity = function(velocity) {
        this.start_velocity = velocity;
        this.v = velocity;
    }
    this.reset_position = function(position) {
        this.start_position = position;
        this.pos = position;
    }
    this.draw = function(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.pos[0], this.pos[1], this.r, 0, 2*Math.PI, 0);
        context.fill();
    }
}
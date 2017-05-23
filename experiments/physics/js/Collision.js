function CheckCollision(circle1, circle2) {
    var distance = SubtractVector(circle1.pos, circle2.pos);
    if(Math.pow(distance[0],2)+Math.pow(distance[1],2) <= Math.pow((circle1.r + circle2.r),2)) {
        Collide(circle1, circle2);
        while(Math.pow(circle1.pos[0]-circle2.pos[0],2)+Math.pow(circle1.pos[1]-circle2.pos[1],2) <= Math.pow((circle1.r + circle2.r),2)) {
            circle1.update();
            circle2.update();
        }
    }
}

function Collide(circle1, circle2) {
    var v1 = circle1.v;
    var v2 = circle2.v;
    var x1 = circle1.pos;
    var x2 = circle2.pos;
    var m1 = circle1.m;
    var m2 = circle2.m;
    var mult1 = (2*m2) * Math.pow((m1+m2),-1) * DotProduct( SubtractVector(v1,v2), SubtractVector(x1,x2) ) / Math.pow( VectorLength(SubtractVector(x1,x2)),2);
    var mult2 = 2*m1/(m1+m2)*DotProduct(SubtractVector(v2,v1), SubtractVector(x2,x1))*Math.pow(VectorLength(SubtractVector(x2,x1)),-2);
    var velocity1 = SubtractVector(v1, MultiplyVector(mult1, SubtractVector(x1,x2)));
    var velocity2 = SubtractVector(v2, MultiplyVector(mult2, SubtractVector(x2,x1)));
    circle1.reset_velocity(velocity1);
    circle2.reset_velocity(velocity2);
    circle1.reset_position(circle1.pos);
    circle2.reset_position(circle2.pos);
    circle1.update();
    circle2.update();
}

function WallCollide(circle, dimensions) {
    var vel_init = circle.start_velocity;
    var vel_curr = circle.v;
    var acc = circle.g;
    var force = MultiplyVector(circle.m, circle.g);
    var pos_init = circle.start_position;
    var pos_curr = circle.pos;
    var radius = circle.r;
    var mass = circle.m;
    if (pos_curr[1]+vel_curr[1]+radius >= dimensions[1]) {
        var vel_y = -1*vel_curr[1];
        var pos;
        if (force[1] == 0)
            pos = -pos_curr[1]+pos_init[1];
        else
            pos = 0.5*mass*(Math.pow(vel_init[1], 2) - Math.pow(vel_y,2))/force[1];
        circle.v = [vel_curr[0], vel_y];
        circle.pos = [pos_curr[0], pos_init[1]-pos];
        while(circle.pos[1] > dimensions[1]-radius-2) {
            circle.update();
        }
    }
    else if (pos_curr[1]+vel_curr[1]-radius <= 0) {
        var vel_y = -1*vel_curr[1];
        var pos;
        if (force[1] == 0)
            pos = -pos_curr[1]+pos_init[1];
        else
            pos = 0.5*mass*(Math.pow(vel_init[1], 2) - Math.pow(vel_y,2))/force[1];
        circle.v = [vel_curr[0], vel_y];
        circle.pos = [pos_curr[0], pos_init[1]-pos];
        while(circle.pos[1] < radius+2) {
            circle.update();
        }
    }
    if (pos_curr[0]+vel_curr[0]+radius >= dimensions[0]) {
        var vel_x = -1*vel_curr[0];
        var pos;
        if (force[0] == 0)
            pos = -pos_curr[0]+pos_init[0]
        else
            pos = 0.5*mass*(Math.pow(vel_init[0], 2) - Math.pow(vel_x,2))/force[0];
        circle.v = [vel_x, vel_curr[1]];
        circle.pos = [pos_init[0]-pos, pos_curr[1]];
        while(circle.pos[0] > dimensions[0]-radius-2) {
            circle.update();
        }
    }
    else if (pos_curr[0]+vel_curr[0]-radius <= 0) {
        var vel_x = -1*vel_curr[0];
        var pos;
        if (force[0] == 0)
            pos = -pos_curr[0]+pos_init[0]
        else
            pos = 0.5*mass*(Math.pow(vel_init[0], 2) - Math.pow(vel_x,2))/force[0];
        circle.v = [vel_x, vel_curr[1]];
        circle.pos = [pos_init[0]-pos, pos_curr[1]];
        while(circle.pos[0] < radius+2) {
            circle.update();
        }
    }
}
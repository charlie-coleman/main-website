function LSystemConstruct(ctx, constants, axiom, size, start_angle, angle, x, y, rules, draw_end) {
    this.ctx = ctx;
    this.constants = constants;
    this.orig_axiom = axiom;
    this.axiom = axiom;
    this.size = size;
    this.start_angle = start_angle;
    this.curr_angle = start_angle;
    this.angle = angle;
    this.start_x = x;
    this.start_y = y;
    this.x = x;
    this.y = y;
    this.rules = rules;
    this.draw_end = draw_end || false;
    this.i = 0;
    this.created = false;
    this.level = 0;
    this.j = 0;
    this.length = this.axiom.length;
    this.hold = this.axiom;
    this.hold_num = 0;
    this.temp_x_arr = [];
    this.temp_y_arr = [];
    this.angle_arr = [];
    this.pos_arr = [];
    this.fin_angle_arr = [];
    this.rainbow = true;
    this.h = 0;
    this.s = 0.6;
    this.v = 1;
    this.max_x = 0;
    this.max_y = 0;
    this.min_x = 1<<12;
    this.min_y = 1<<12;
    this.color_i = 0;
    this.random_rules = false;
    this.create = function() {
        this.ctx.moveTo(this.x, this.y);
        this.ctx.closePath();
    }
    this.draw = function(ctx) {
        this.move_me(ctx, this.axiom[this.i]);
    }
    this.move_me = function(ctx, i, tf) {
        tf = tf || true;
        if (this.rainbow) {
            this.color_i += 1;
            if (this.color_i > this.axiom.length)
                this.color_i = 0;
            var rgb = this.HSVtoRGB(this.color_i/this.axiom.length, this.s, this.v)
            ctx.strokeStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        }
        if (tf)
            this.interp_letter_draw(i);
        if (this.x > this.max_x)
            this.max_x = this.x;
        if (this.y > this.max_y)
            this.max_y = this.y;
        if (this.x < this.min_x)
            this.min_x = this.x;
        if (this.y < this.min_y)
            this.min_y = this.y;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.closePath();
        ctx.moveTo(this.x, this.y);
    }
    this.interp_letter_draw = function(string) {
        if (string == '+') {
            this.curr_angle += this.angle;
        }
        else if (string == '-') {
            this.curr_angle -= this.angle;
        }
        else if (string == '[') {
            this.temp_x_arr.push(this.x);
            this.temp_y_arr.push(this.y);
            this.angle_arr.push(this.curr_angle);
        }
        else if (string == ']') {
            this.curr_angle = this.angle_arr.pop();
            this.x = this.temp_x_arr.pop();
            this.y = this.temp_y_arr.pop();
            this.ctx.moveTo(this.x, this.y);
        }
        else if (string == 'F') {
            var rad_angle = this.curr_angle*Math.PI/180.0;
            var x = Math.cos(rad_angle)*this.size;
            var y = Math.sin(rad_angle)*this.size;
            this.x += Math.cos(rad_angle)*this.size;
            this.y += Math.sin(rad_angle)*this.size;
        }
        this.pos_arr.push([this.x, this.y]);
        this.fin_angle_arr.push(this.curr_angle);
    }
    this.interp_letter = function(string) {
        if (string == '+') {
            return '+';
        }
        if (string == '-') {
            return '-';
        }
        if (string == '[') {
            return '[';
        }
        if (string == ']') {
            return ']';
        }
        var i = [];
        for (var k = 0; k < this.constants.length; k++) {
            if (this.constants[k] == string)
                i.push(k);
        }
        if (i.length > 1)
            this.random_rules = true;
        if (i.length != 0) {
            return this.rules[i[Math.floor(Math.random()*i.length)]];
        }
    }
    this.create_string = function(level) {
        if(this.j == 0 && this.level < level) {
            this.hold = this.axiom;
            this.hold_num = 0;
            this.length = this.axiom.length;
        }
        if(this.j < this.length && this.level < level) {
            var string = this.interp_letter(this.axiom[this.j]) || '';
            this.hold = this.hold.splice(this.hold_num, 1, string);
            this.hold_num = this.hold_num + string.length;
            this.j += 1;
        }
        else if(this.j == this.length && this.level < level) {
            this.axiom = this.hold;
            this.level += 1;
            this.hold_num = 0;
            this.j = 0;
        }
        else if (this.level == level) {
            this.axiom = this.hold;
            this.level = level;
            if (this.draw_end) {
                this.axiom = this.axiom.replace(/(A|B)/g, "F");
            }
            else {
                this.axiom = this.axiom.replace(/(A|B)/g, "");
            }
            this.created = true;
        }
    }
    this.HSVtoRGB = function(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    this.reset = function() {
        this.i = 0;
        this.curr_angle = this.start_angle;
        this.temp_x_arr = [];
        this.temp_y_arr = [];
        this.angle_arr = [];
        this.pos_arr = [];
        this.fin_angle_arr = [];
        this.color_i = 0;
        this.max_x = 0;
        this.max_y = 0;
        this.min_x = 1<<12;
        this.min_y = 1<<12;
    }
}
function Slider(label,x, y, width, height, start, end, step, init, lColor, rColor, int) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.start = start;
    this.end = end;
    this.step = step;
    this.init = init;
    this.lColor = lColor;
    this.rColor = rColor;
    this.int = int;
    this.label = label;
    this.rect = new Phaser.Rectangle(this.x,this.y,this.width,this.height);
    this.line = new Phaser.Line(this.x+this.width/15,this.y+this.height/2,this.x+this.width/15*12,this.y+this.height/2);
    this.lines = [];
    this.lineVal = [];
    this.containsMouse = false;
    this.createLines = function() {
        for(var i = 0; i < (((this.end - this.start)/this.step)) + 1; i++) {
            this.lines[i] = new Phaser.Line(this.line.x + (this.line.width/((this.end - this.start)/this.step))*i, this.y + 3*this.height / 8, this.line.x + (this.line.width/((this.end - this.start)/this.step))*i, this.y + 5*this.height / 8);
            this.lineVal[i] = this.step*i;
        }
        this.selectSquare = new Phaser.Rectangle((this.init - this.start)*this.line.width / (this.end - this.start) + this.line.x - 1/16*this.height, this.line.y - 1/16*this.height, 1/8*this.height, 1/8*this.height);
        this.created = true;
    };
    this.draw = function(g) {
        g.debug.geom(this.rect, this.rColor);
        g.debug.geom(this.line,this.lColor);
        for(var i = 0; i < this.lines.length; i++) {
            g.debug.geom(this.lines[i],this.lColor);
        }
        g.debug.geom(this.selectSquare,this.lColor);
        g.debug.text(this.label, this.rect.x, this.rect.y + this.height/4, this.lColor);
        g.debug.text(this.start, this.line.x - 5*(this.start.toString().length), this.line.y + 7/16*this.height, this.lColor);
        g.debug.text(this.end, this.line.x - 5*(this.end.toString().length) + this.line.width, this.line.y + 7/16*this.height, this.lColor);
        g.debug.text(this.currentValue, this.line.x + this.line.width + 1/10*this.width - this.currentValue.toString().length*5, this.line.y + 5, this.lColor)
    };
    this.currentValue = this.init;
    this.move = function(g) {
        if(g.input.mousePointer.isDown) {
            if(this.containsMouse) {
                if(g.input.x > this.line.x && g.input.x < this.line.x + this.line.width) {
                    this.selectSquare.centerX = g.input.x;
                    this.currentValue = (this.selectSquare.centerX - this.line.x)/this.line.width*(this.end - this.start) + this.start;
                    if(this.int) this.currentValue = Math.round(this.currentValue - 0.3);
                    else this.currentValue = this.currentValue.toPrecision(4);
                }
                else if(g.input.x < this.line.x) {
                    this.selectSquare.centerX = this.line.x;
                    this.currentValue = this.start;
                }
                else if(g.input.x > this.line.x + this.line.width) {
                    this.selectSquare.centerX = this.line.x + this.line.width;
                    this.currentValue = this.end;
                }
                this.init = this.currentValue;
            }
        }
    }
    this.update = function(g) {
        this.rect = new Phaser.Rectangle(this.x,this.y,this.width,this.height);
        this.line = new Phaser.Line(this.x+this.width/15,this.y+this.height/2,this.x+this.width/15*12,this.y+this.height/2);
        this.createLines(g);
        this.containsMouse = this.rect.contains(g.input.x, g.input.y);
        this.move(g);
    }
};
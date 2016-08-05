
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {preload: preload, create:create, update: update, render: render});
function preload() {
}
function Slider(label,x, y, width, height, start, end, step, init, lColor, rColor, draw, int) {
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
    this.line = new Phaser.Line(this.x+this.width/15,y+this.height/2,this.x+this.width/15*12,this.y+this.height/2);
    this.lines = [];
    this.lineVal = [];
    this.checkMouse = function(g) {
        return this.rect.contains(this.rect,g.input.x, g.input.y);
    };
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
            if(this.rect.contains(g.input.x,g.input.y)) {
                if(g.input.x > this.line.x && g.input.x < this.line.x + this.line.width) this.selectSquare.centerX = g.input.x;
                else if(g.input <= this.line.x) this.selectSquare.centerX = this.line.x;
                else if(g.input >= this.line.x + this.line.width) this.selectSquare.centerX = this.line.x+this.line.width;
                this.currentValue = (this.selectSquare.centerX - this.line.x)/this.line.width*(this.end - this.start) + this.start;
                if(!this.int) this.currentValue = Math.round(this.currentValue);
            }
        }
    }
};
var hideSlide = false;
var scaleSlider = new Slider("Scale",0,0,300,50,0,100,5,5,"#FFF","#000", true);
var numLineSlider = new Slider("Number of Lines",0,50,300,50,1,1000,50,123,"#FFF","#000",true);
var ballSizeSlider = new Slider("Ball Size",0,100,300,50,10,1000,50,200,"#FFF","#000",true);
var angleSlider = new Slider("Angle",0,150,300,50,0,360,30,0,"#FFF","#000",true);
var leftLines = [];
var rightLines = [];
var circleLines = [];
var circle = 200;
var colors = ["#9b9b9b","#ff0000","#2f2f2f"];
var numLine = 123;
var scale = 50;
var angle = 1;
var thick = 1;
var clicked = false;
var x = 0, y = 0, useX, useY;
var inSlider = false;
var sepLine = window.innerHeight / numLine*2;
function create() {
    for(var i = 0; i < numLine; i++) {
        leftLines[i] = new Phaser.Line(0,i*sepLine/2,window.innerWidth/2,i*sepLine/2);
        rightLines[i] = new Phaser.Line(window.innerWidth/2,i*sepLine/2,window.innerWidth,i*sepLine/2);
    }
    scaleSlider.createLines();
    numLineSlider.createLines();
    ballSizeSlider.createLines();
    angleSlider.createLines();
}
function update() {
    if(!scaleSlider.checkMouse(game) && !numLineSlider.checkMouse(game) && !ballSizeSlider.checkMouse(game) && !angleSlider.checkMouse(game)) {
        game.input.onTap.add(function() {
            clicked = !clicked;
            x = game.input.x;
            y = game.input.y;
        });
    }
    var sepLine = window.innerHeight / numLine*2;
    if(clicked) {
        useX = game.input.x;
        useY = game.input.y;
    }
    else if(!clicked) {
        useX = x;
        useY = y;
    }
    for(var i = leftLines.length; i < numLine; i++) {
        leftLines[i] = new Phaser.Line(0,i*sepLine/2,window.innerWidth/2,i*sepLine/2);
        rightLines[i] = new Phaser.Line(window.innerWidth/2,i*sepLine/2,window.innerWidth,i*sepLine/2);
    }
    circleLines = [];
    if(leftLines.length > numLine) {
        leftLines.splice(numLine, leftLines.length - numLine);
        rightLines.splice(numLine, rightLines.length - numLine);
    }
    for(var i = 0; i < numLine; i++) {
        var top = i*sepLine/2;
        var dist = (leftLines[i].y < useY + circle/2 && leftLines[i].y > useY - circle/2 ) ? Math.sqrt(Math.pow(circle/2,2) - Math.abs(Math.pow(Math.abs(top - useY),2))) : 0;
        var x1 = useX - dist;
        leftLines[i].setTo(0, i*sepLine/2, x1, i*sepLine/2);
        var x2 = useX + dist;
        rightLines[i].setTo(x2, i*sepLine/2, window.innerWidth, i*sepLine/2);
        circleLines[i] = new Phaser.Line(x1,i*sepLine/2-scale/4*sepLine,x2,i*sepLine/2-scale/4*sepLine);
        if(i > Math.ceil(scale/2)) {
            if(leftLines[i].y < useY + circle/2 && leftLines[i].y > useY) {
                if(leftLines[i - Math.ceil(scale/2)].width > leftLines[i].width) 
                    leftLines[i-Math.ceil(scale/2)].setTo(0, (i-Math.ceil(scale/2))*sepLine/2 ,leftLines[i].x + leftLines[i].width,(i-Math.ceil(scale/2))*sepLine/2);
                if(rightLines[i - Math.ceil(scale/2)].width > rightLines[i].width) 
                    rightLines[i-Math.ceil(scale/2)].setTo(rightLines[i].x,(i-Math.ceil(scale/2))*sepLine/2, window.innerWidth,(i-Math.ceil(scale/2))*sepLine/2);
            }
        }
        if(i > Math.floor(scale/2)) {
            if(leftLines[i].y < useY && leftLines[i].y > useY - circle/2) {
                if(leftLines[i - Math.floor(scale/2)].width > leftLines[i].width) 
                    leftLines[i-Math.floor(scale/2)].setTo(0, (i-Math.floor(scale/2))*sepLine/2 ,leftLines[i].x+leftLines[i].width, (i-Math.floor(scale/2))*sepLine/2);
                if(rightLines[i - Math.floor(scale/2)].width > rightLines[i].width) 
                    rightLines[i-Math.floor(scale/2)].setTo(rightLines[i].x, (i-Math.floor(scale/2))*sepLine/2, window.innerWidth,(i-Math.floor(scale/2))*sepLine/2);
            }
        }
    }
    for(var i = 0; i < circleLines.length; i++) {
        circleLines[i].rotateAround(useX, useY - scale/4*sepLine, angle*3.14159265/180);
    }
    scale = scaleSlider.currentValue;
    scaleSlider.move(game);
    numLine = numLineSlider.currentValue;
    numLineSlider.move(game);
    circle = ballSizeSlider.currentValue;
    ballSizeSlider.move(game);
    angle = angleSlider.currentValue;
    angleSlider.move(game);
    game.stage.backgroundColor = colors[2];
}
function render() {
    for(var i = 0; i < leftLines.length; i ++) {
        game.debug.geom(leftLines[i],colors[0]);
        game.debug.geom(rightLines[i],colors[0]);
    }
    for(var i = 0; i < circleLines.length; i ++) {
        game.debug.geom(circleLines[i],colors[1]);
    }
    if(!hideSlide) {
        scaleSlider.draw(game);
        numLineSlider.draw(game);
        ballSizeSlider.draw(game);
        angleSlider.draw(game);
    }
}
$(window).resize(function() {
    sepLine = window.innerHeight / numLine*2;
    game.width = window.innerWidth;
    game.height = window.innerHeight;
});
function changeBallSize(size) {circle = size;}
function changeScale(s) {scale = s;}
function changeThickness(t) {thick = t;}
function changeLineNum(n) {numLine = n;}
function changeLineColor(s) {colors[0] = s;}
function changeBallColor(s) {colors[1] = s; }
function changeBgColor(s) {colors[3] = s;}
function hide() {hideSlide = !hideSlide;}
function centerBall() {useX = window.innerWidth/2; useY = window.innerHeight/2;}
window.changeBallSize = changeBallSize;
window.changeBallSize = changeScale;
window.changeBallSize = changeThickness;
window.changeBallSize = changeLineNum;
window.changeBallSize = changeLineColor;
window.changeBallSize = changeBallColor;
window.changeBallSize = changeBgColor;
window.hide = hide;
window.centerBall = centerBall;
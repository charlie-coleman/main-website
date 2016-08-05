
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {preload: preload, create:create, update: update, render: render});
function preload() {
}
var topVal = 30, rightVal = 0;
var scaleSlider = new Slider("Scale",rightVal,topVal,300,50,0,100,5,5,"#FFF","#000", true);
var numLineSlider = new Slider("Number of Lines",rightVal,topVal+50,300,50,1,1000,50,123,"#FFF","#000",true);
var ballSizeSlider = new Slider("Ball Size",rightVal,topVal+100,300,50,10,1000,50,200,"#FFF","#000",true);
var thicknessSlider = new Slider("Thickness",rightVal,topVal+150,300,50,1,15,1,1,"#FFF","#000",true);
var menuButton = new Button("Options Menu", 0, 0, 300, 30, "#000", "#FFF", "24px Courier New");
var leftLines = [], rightLines = [], circleLines = [];
var circle = 200;
var colors = ["#9b9b9b","#ff0000","#2f2f2f"];
var numLine = 123, scale = 5, angle = 1, thick = 1, clicked = false, drawSliders = false;
var x = 0, y = 0, useX, useY;
var inSlider = false;
var sepLine = window.innerHeight / numLine*2;
var buttonDown = false;
var circleDown = false;
function create() {
    game.canvas.oncontextmenu = function(e) {e.preventDefault();};
    for(var i = 0; i < numLine; i++) {
        leftLines[i] = new Phaser.Rectangle(0,i*sepLine/2,window.innerWidth/2,thick);
        rightLines[i] = new Phaser.Rectangle(window.innerWidth/2,i*sepLine/2,window.innerWidth/2,thick);
    }
    scaleSlider.createLines();
    numLineSlider.createLines();
    ballSizeSlider.createLines();
    thicknessSlider.createLines();
}
function update() {
    game.input.onDown.add(function(){
        if(menuButton.containsMouse && !buttonDown) {
            buttonDown = true;
        }
        else if(!scaleSlider.containsMouse && !numLineSlider.containsMouse && !ballSizeSlider.containsMouse && !thicknessSlider.containsMouse && !menuButton.containsMouse) {
            circleDown = true;
        }
    });
    game.input.onUp.add(function() {
        if(menuButton.containsMouse && buttonDown) {
            console.log("Success!");
            buttonDown = false;
            drawSliders = !drawSliders;
        }
        else if(!scaleSlider.containsMouse && !numLineSlider.containsMouse && !ballSizeSlider.containsMouse && !thicknessSlider.containsMouse && !menuButton.containsMouse && circleDown) {
            circleDown = false;
            clicked = !clicked;
            x = game.input.x;
            y = game.input.y;
        }
    })
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
        leftLines[i] = new Phaser.Rectangle(0,i*sepLine/2,window.innerWidth/2,thick);
        rightLines[i] = new Phaser.Rectangle(window.innerWidth/2,i*sepLine/2,window.innerWidth/2,thick);
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
        leftLines[i].setTo(0, i*sepLine/2, x1, thick);
        var x2 = useX + dist;
        rightLines[i].setTo(x2, i*sepLine/2, window.innerWidth - x2, thick);
        circleLines[i] = new Phaser.Rectangle(x1,i*sepLine/2-scale/4*sepLine,x2-x1,thick);
        if(i > Math.ceil(scale/2)) {
            if(leftLines[i].y < useY + circle/2 && leftLines[i].y > useY) {
                if(leftLines[i - Math.ceil(scale/2)].width > leftLines[i].width) leftLines[i-Math.ceil(scale/2)].setTo(0, (i-Math.ceil(scale/2))*sepLine/2 ,leftLines[i].width,thick);
                if(rightLines[i - Math.ceil(scale/2)].width > rightLines[i].width) rightLines[i-Math.ceil(scale/2)].setTo(rightLines[i].x, (i-Math.ceil(scale/2))*sepLine/2, rightLines[i].width,thick);
            }
        }
        if(i > Math.floor(scale/2)) {
            if(leftLines[i].y < useY && leftLines[i].y > useY - circle/2) {
                if(leftLines[i - Math.floor(scale/2)].width > leftLines[i].width) leftLines[i-Math.floor(scale/2)].setTo(0, (i-Math.floor(scale/2))*sepLine/2 ,leftLines[i].width,thick);
                if(rightLines[i - Math.floor(scale/2)].width > rightLines[i].width) rightLines[i-Math.floor(scale/2)].setTo(rightLines[i].x, (i-Math.floor(scale/2))*sepLine/2, rightLines[i].width,thick);
            }
        }
    }
    if(drawSliders) {
        scale = scaleSlider.currentValue;
        scaleSlider.update(game);
        numLine = numLineSlider.currentValue;
        numLineSlider.update(game);
        circle = ballSizeSlider.currentValue;
        ballSizeSlider.update(game);
        thick = thicknessSlider.currentValue;
        thicknessSlider.update(game);
    }
    game.stage.backgroundColor = colors[2];
    menuButton.update(game);
}
function render() {
    for(var i = 0; i < leftLines.length; i ++) {
        game.debug.geom(leftLines[i],colors[0]);
        game.debug.geom(rightLines[i],colors[0]);
    }
    for(var i = 0; i < circleLines.length; i ++) {
        game.debug.geom(circleLines[i],colors[1]);
    }
    menuButton.draw(game);
    if(drawSliders) {
        scaleSlider.draw(game);
        numLineSlider.draw(game);
        ballSizeSlider.draw(game);
        thicknessSlider.draw(game);
    }
}
$(window).resize(function() {
    sepLine = window.innerHeight / numLine*2;
    game.width = window.innerWidth;
    game.height = window.innerHeight;
});
function changeLineColor(s) {colors[0] = s;}
function changeBallColor(s) {colors[1] = s; }
function changeBgColor(s) {colors[3] = s;}

$(function() {
    $.fn.textWidth = function(text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    };
    var canvas = document.getElementById("canvas"),
            ctx = canvas.getContext("2d");
    canvas.height = $(window).height() * 0.885;
    canvas.width = $(window).width() * 0.8;
    $("#canvas").css("margin-top", $(window).height() * 0.01);
    $("#canvas").css("margin-left", $(window).width() * 0.1);
    $("#radius").css({
        "margin-top": "2%",
        "margin-left": "0.5%",
        "width": canvas.width * 0.85,
    });
    $("#radius").slider({
        range:"min",
        min: 5,
        max: 50,
        value: 15,
        slide: function(event, ui) {
            var red = Math.round((ui.value / $("#radius").slider("option", "max")) * 255);
            var c = $.Color("rgb(255" + "," + (255-red) + "," + (255-red) + ")");
            $("#radius .ui-slider-range").css("background",c);
            radius = ui.value;
            for(var i = 0; i < ball.length; i++) {
                ball[i].radius = ui.value;   
            }
        }
    });
    $("#gravity").css({
        "margin-top": "1.5%",
        "margin-left": "0.5%",
        "width":canvas.width * 0.64
    });
    $("#gravity").slider({
        range: "min",
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var red = Math.round((ui.value / $("#gravity").slider("option", "max")) * 255);
            var c = $.Color("rgb(" + (255-red) + ",255" + "," + (255-red) + ")");
            $("#gravity .ui-slider-range").css("background",c);
            grav = ui.value/100;
            for(var i = 0; i < ball.length; i++) {
                ball[i].gravity = ui.value/100;   
            }
        }
    });
    $("#minus, #plus").button();
    $("#minus, #plus").css({
        "width":canvas.width * 0.1,
        "margin-top":"-1%"
    });
    $("#minus .ui-button-text, #plus .ui-button-text").css({
        "line-height":"0.5",
        "color":"#ZZ0000"
    });
    function randInt(l,u) {
        return Math.floor(Math.random() * (u-l)) + l;   
    }
    $("#plus").click(function() {
        var width = $("#canvas").width() - radius;
        var height = $("#canvas").height() - radius;
        ball[ball.length] = new BallClass(randInt(radius, width), randInt(radius, height), radius, "blue", randSpeed(1,3), randSpeed(1,3), grav, bounceConst);
    });
    $("#minus").click(function() {
         ball.pop();
    });
    function BallClass(x, y, r, c, vx, vy, g, b) {
        this.x = x,
        this.y = y,

        this.gravity = g,
        this.bounceFactor = b,
        
        this.radius = r,
        this.color = c,
        this.vx = vx,
        this.vy = vy,

        this.draw = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    };
    function randSpeed(l,u) {
           return (Math.floor((Math.random() * (u-1))) + l) * Math.pow(-1, Math.floor(Math.random()*2)+1);
    }
    var radius = 15;
    var grav = 0.05;
    var bounceConst = 0.99;
    var ball = [];
    ball[0] = new BallClass(100, 100, radius, "blue", randSpeed(1,5), randSpeed(1,5), grav, bounceConst);
    ball[1] = new BallClass($("#canvas").width() - 100, 100, radius, "blue", randSpeed(1,5), randSpeed(1,5), grav, bounceConst);
    /*$("#canvas").click(function(e) {
        var offset = $(this).offset();
        ball[ball.length] = new BallClass(e.clientX - offset.left, e.clientY - offset.top, radius, "blue", randSpeed(1,3), randSpeed(1,3), grav, bounceConst);
    });*/
    function clearCanvas() {
        ctx.clearRect(0, 0, $("#canvas").width(), $("#canvas").height());
    }
    function randColor() {
        var r = Math.floor((Math.random() * 255)) + 1;
        var g = Math.floor((Math.random() * 255)) + 1;
        var b = Math.floor((Math.random() * 255)) + 1;
        return new $.Color("rgb(" + r + "," + g + "," + b + ")");
    }
    function collision(b1, b2) {
        if(dist(b1.x, b1.y, b2.x, b2.y) < b1.radius + b2.radius) {
            var distX = Math.abs(b2.x - b1.x);
            var distY = Math.abs(b2.y - b1.y);
            var xF1 = distX * (b1.radius / (b1.radius + b2.radius));
            var yF1 = distY * (b1.radius / (b1.radius + b2.radius));
            var xF2 = distX * (b2.radius / (b1.radius + b2.radius));
            var yF2 = distY * (b2.radius / (b1.radius + b2.radius));
            var speed1 = ((xF1 * xF1) + (yF1 * yF1));
            var speed2 = ((xF2 * xF2) + (yF2 * yF2));
            var oSpeed1 = ((b1.vx * b1.vx) + (b1.vy * b1.vy));
            var oSpeed2 = ((b2.vx * b2.vx) + (b2.vy * b2.vy));
            if (speed1 != oSpeed1) {
                xF1 = Math.sqrt((oSpeed1 * (xF1 * xF1)) / speed1);
                yF1 = Math.sqrt((oSpeed1 * (yF1 * yF1)) / speed1);
            }
            if (speed2 != oSpeed2) {
                xF2 = Math.sqrt((oSpeed2 * (xF2 * xF2)) / speed2);
                yF2 = Math.sqrt((oSpeed2 * (yF2 * yF2)) / speed2);
            }
            if (b1.x > b2.x)
                xF2 = -xF2;
            else if (b1.x < b2.x)
                xF1 = -xF1;
            if (b1.y > b2.y)
                yF2 = -yF2;
            else if (b1.y < b2.y)
                yF1 = -yF1;
            b1.vx = xF1;
            b1.vy = yF1;
            b2.vx = xF2;
            b2.vy = yF2;
            /*b1.color = randColor();
            b2.color = randColor();*/
        }
    }
    function dist(x1, y1, x2, y2) {
        return Math.round(Math.pow((Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)), 0.5));
    }
    function distColor() {
        var red = 0;
        var green = 0;
        var blue = 0;
        var num = 0;
        for(var i = 0; i < ball.length; i++) {
            for(var j = i+1; j < ball.length; j++) {
                var distance = dist(ball[i].x, ball[i].y, ball[j].x, ball[j].y);
                var totalDistance = dist(0,0,canvas.width, canvas.height);
                var x = 1-(distance/totalDistance);
                red += 21552.8*Math.pow(x,6) - 80822.9*Math.pow(x,5) + 106339*Math.pow(x,4) - 55371.4*Math.pow(x,3) + 7258.19*Math.pow(x,2) + 1299.29*x;
                green += -4080*(Math.pow(x,2)) + 4080*(x) - 765;
                blue += 64491.4*Math.pow(x,8)-394474*Math.pow(x,7) + 908820*Math.pow(x,6) - 1016400*Math.pow(x,5) + 575542*Math.pow(x,4) - 148944*Math.pow(x,3) + 12452.4*Math.pow(x,2) - 641.525*x + 255;
                num++;
            }
        }
        red = Math.round(red/num)
        green = Math.round(green/num)
        blue = Math.round(blue/num);
        var c = new $.Color("rgb(" + (255-red) + "," + (255-green) + "," + (255-blue) + ")");
        for(var i = 0; i < ball.length; i++) {
            for(var j = i+1; j < ball.length; j++) {
                ball[i].color = new $.Color("rgb(" + Math.abs(255-red) + "," + Math.abs(255-green) + "," + Math.abs(255-blue) + ")");
                ball[j].color = new $.Color("rgb(" + Math.abs(255-red) + "," + Math.abs(255-green) + "," + Math.abs(255-blue) + ")");
            }
        }
        $("#canvas").css({
            "background": "rgb(" + red + "," + green + "," + blue + ")"
        });
    }
    function invert(rgb) {
        rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
        for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
        return rgb.join(", ");
    }
    function invColor(c) {
        var color = "rgb(" + (255-c.red()) + "," + (255 - c.green()) + "," + (255-c.blue()) + ")";
        return new $.Color(color);
    }
    function update() {
        clearCanvas();
        distColor();
        for(var i = 0; i < ball.length; i++) {
            ball[i].draw();
            ball[i].y += ball[i].vy;
            ball[i].vy += ball[i].gravity;
            if(ball[i].y + ball[i].radius > $("#canvas").height()) {
                ball[i].y = $("#canvas").height() - ball[i].radius;
                ball[i].vy *= -ball[i].bounceFactor;
                //ball[i].color = randColor();
            }
            if(ball[i].y - ball[i].radius < 0) {
                ball[i].y = ball[i].radius;
                ball[i].vy *= -ball[i].bounceFactor;
                //ball[i].color = randColor();
            }
            ball[i].x += ball[i].vx;
            if(ball[i].x + ball[i].radius > $("#canvas").width()) {
                ball[i].x = $("#canvas").width() - ball[i].radius;
                ball[i].vx *= -1;
                //ball[i].color = randColor();
            }
            if(ball[i].x - ball[i].radius < 0) {
                ball[i].x = ball[i].radius;
                ball[i].vx *= -1;
                //ball[i].color = randColor();
            }
        }
        for(var i = 0; i < ball.length; i++) {
            for(var j = i+1; j < ball.length; j++) {
                collision(ball[i],ball[j]);
            }
        }
    }
    $(window).resize(function() {
        canvas.height = $(window).height() * 0.8;
        canvas.width = $(window).width() * 0.8;
        $("#canvas").css("margin-top", $(window).height() * 0.01);
        $("#canvas").css("margin-left", $(window).width() * 0.1);
        $("#radius").css({
            "width":canvas.width * 0.885
        });
        $("#gravity").css({
            "width":canvas.width * 0.67
        });
        $("#gravityLabel").css({
            "margin-right": (canvas.width * 0.1) - $("#gravityLabel").textWidth()
        });
        $("#radiusLabel").css({
            "margin-right": (canvas.width * 0.1) - $("#radiusLabel").textWidth()
        });
        $("#minus, #plus").css({
            "width":canvas.width * 0.1
        });
    });
    $("#gravityLabel").css({
        "margin-right": ($(window).width() * 0.08) - $("#gravityLabel").textWidth()
    });
    $("#radiusLabel").css({
        "margin-right": ($(window).width() * 0.08) - $("#radiusLabel").textWidth()
    });
    var timeout, ballChosen = false, ballc;
    var eX, eY;
    $("#canvas").mousedown(function(e) {
        timeout = setInterval(function() {
            var offset = $("#canvas").offset();
            eX = e.clientX - offset.left;
            eY = e.clientY - offset.top;
            if(!ballChosen) {
                for(var i = 0; i < ball.length; i++) {
                    if(dist(eX, eY, ball[i].x, ball[i].y) 
                       < ball[i].radius) {
                        ball[i].vx = 0;
                        ball[i].vy = 0;
                        ballc = i;
                        ballChosen = true;
                    }
                }
            }
        }, 1);
    });
    $(document).mouseup(function(e) {
        clearInterval(timeout);
        ball[ballc].vx = ((e.clientX - eX)/50);
        ball[ballc].vy = ((-e.clientY + eY)/50);
        ballChosen = false;
        ballc = -1;
    });
    $("#canvas").mouseleave(function(e) {
        clearInterval(timeout);
        ballChosen = false;
        ballc = -1;
    });
    $("#canvas").mousemove(function(e) {
        if(ballChosen) {
            var offset = $("#canvas").offset();
            eX = e.clientX - offset.left;
            eY = e.clientY - offset.top;
            ball[ballc].vx = 0;
            ball[ballc].vy = 0;
            ball[ballc].x = eX;
            ball[ballc].y = eY;
        } 
    });
    $("#radius .ui-slider-range").css("background","rgb(255,178,178)");
    $("#gravity .ui-slider-range").css("background","rgb(229,255,229)");
    setInterval(update, 1000/100);
    $(window).trigger("resize");
});
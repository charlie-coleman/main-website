$(function() {
    var canvas = document.getElementById("drawSpace"),
            ctx = canvas.getContext("2d");
        canvas.height = $(window).height() * 0.97 - $("#addTextButton").height()*2;
        canvas.width = $(window).width() * 0.97;
        $("#addHolder").css({
            "width":"97%",
            'float':'left'
        });
        $("#canvasHolder").css({
            'float':'right' 
        });
    $("#drawSpace").css({
        "border":"1px solid #888"
    });
    var strings = ["Charlie", "Coleman", "Experiment #3", "Use a \\ to put in an image"];
    var fonts = ["40px Arial", "45px BebasNeue", "40px Times", "40px Georgia"];
    var availableFonts = ["Arial", "Times", "Verdana", "Georgia", "BebasNeue", "cursive", "Helvetica", "Exo", "Seaside", "GoodDog", "Titillium", "Lobster"];
    var colors = ["rgb(153, 0, 153)", "rgb(88, 195, 102)", "#01193B", "#002e6d"];
    var texts = [];
    var images = [];
    $.fn.textWidth = function(text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    };
    function Text(x, y, t, f, c, vx, vy) {
        this.x = x,
        this.y = y,
        this.color = c,
        this.text = t,
        this.font = f,
        this.vx = vx,
        this.vy = vy,
        this.height = getTextHeight(this.font).height,
        this.draw = function() {
            ctx.beginPath();
            ctx.font = f;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
            this.width = ctx.measureText(this.text).width;
            ctx.fill();
            ctx.closePath();
        }
    };
    function ImageMove(x, y, url, velx, vely) {
        this.x = x,
        this.y = y,
        this.url = url,
        this.vx = velx,
        this.vy = vely,
        this.draw = function() {
            ctx.beginPath();
            var image = new Image();
            image.src = this.url;
            var x = this.x;
            var y = this.y;
            var mult = 100 / image.height;
            this.height = image.height * mult;
            this.width = image.width * mult;
            image.onload = function() {
                ctx.drawImage(image, x, y, image.width * mult, image.height * mult);
            }
            ctx.closePath();
        }
    };
    var getTextHeight = function(font) {
        var text = $('<span>Hg</span>').css({ fontFamily: font });
        var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
        var div = $('<div></div>');
        div.append(text, block);
        var body = $('body');
        body.append(div);
        try {
            var result = {};
            block.css({ verticalAlign: 'baseline' });
            result.ascent = block.offset().top - text.offset().top; 
            block.css({ verticalAlign: 'bottom' });
            result.height = block.offset().top - text.offset().top;
            result.descent = result.height - result.ascent;
        } finally {
            div.remove();
        }

        return result;
    };
    for(var i = 0; i < strings.length; i++) {
        texts[texts.length] = new Text(randInt(0,canvas.width), randInt(0, canvas.height), strings[i], fonts[i], colors[i], randSpeed(1,3), randSpeed(1,3));
    }
    console.log(getTextHeight(fonts[0]));
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);   
    };
    function randSpeed(l,u) {
           return (((Math.random() * (u-1))) + l) * Math.pow(-1, Math.floor(Math.random()*2)+1);
    };
    function collideWall(text) {
        if(text.x + text.width >= canvas.width || text.x <= 0) {
            text.vx *= -1;   
        }
        if(text.y >= canvas.height) {
            text.vy *= -1;
        }
        else if(text.y - text.height < 0) {
            text.vy *= -1;   
        }
        
    }
    function collideImage(text) {
        if(text.x + text.width >= canvas.width || text.x <= 0) {
            text.vx *= -1;   
        }
        if(text.y <= 0 || text.y + text.height >= canvas.height) {
            text.vy *= -1;   
        }
        
    }
    function checkResolveOOB(t1) {
        if(t1.x + t1.width > canvas.width) {
            t1.x = canvas.width - t1.width;   
        }
        if(t1.x < 0) {
            t1.x = 0;   
        }
        if(t1.y - t1.height < 0) {
            t1.y = t1.height;
        }
        if(t1.y > canvas.height) {
            t1.y = canvas.height;   
        }
    }
    function collideTexts(t1, t2) {
        if((t1.y - t1.height <= t2.y && t1.y - t1.height > t2.y - t2.height)
          && (t1.x + t1.width >= t2.x && t1.x < t2.x + t2.height)) {
            var distX = Math.abs(t2.x - t1.x);
            var distY = Math.abs(t2.y - t1.y);
            var xF1 = distX * (t1.width / (t1.width + t2.width));
            var yF1 = distY * (t1.height / (t1.height + t2.height));
            var xF2 = distX * (t2.width / (t1.width + t2.width));
            var yF2 = distY * (t2.height / (t1.height + t2.height));
            var speed1 = ((xF1 * xF1) + (yF1 * yF1));
            var speed2 = ((xF2 * xF2) + (yF2 * yF2));
            var oSpeed1 = ((t1.vx * t1.vx) + (t1.vy * t1.vy));
            var oSpeed2 = ((t2.vx * t2.vx) + (t2.vy * t2.vy));
            if (speed1 != oSpeed1) {
                xF1 = Math.sqrt((oSpeed1 * (xF1 * xF1)) / speed1);
                yF1 = Math.sqrt((oSpeed1 * (yF1 * yF1)) / speed1);
            }
            if (speed2 != oSpeed2) {
                xF2 = Math.sqrt((oSpeed2 * (xF2 * xF2)) / speed2);
                yF2 = Math.sqrt((oSpeed2 * (yF2 * yF2)) / speed2);
            }
            if (t1.x > t2.x)
                xF2 = -xF2;
            else if (t1.x < t2.x)
                xF1 = -xF1;
            if (t1.y > t2.y)
                yF2 = -yF2;
            else if (t1.y < t2.y)
                yF1 = -yF1;
            t1.vx = xF1;
            t1.vy = yF1;
            t2.vx = xF2;
            t2.vy = yF2;
        }
    }
    function randInt(l,u) {
        return Math.floor(Math.random() * (u-l)) + l;
    }
    $("#addTextButton").click(function() {
        addName($("#addText").val());
        $("#addText").val('');
    });
    $('#addText').keyup(function(e){
        if(e.keyCode == 13)
        {
            addName($("#addText").val());
            $("#addText").val('');
        }
    });
    function randColor() {
        var r = Math.floor(Math.random()*256);
        var g = Math.floor(Math.random()*256);
        var b = Math.floor(Math.random()*256);
        if((r + g + b) / 3 > 105) {
            r /= (r+g+b)/105;
            g /= (r+g+b)/105;
            b /= (r+g+b)/105;
        }
        return "rgb("+r+","+g+","+b+")";
    }
    window.removeAll = removeAll;
    window.addName = addName;
    window.removeLastText = removeLastText;
    window.removeLastImage = removeLastImage;
    window.remove = remove;
    window.printAll = printAll;
    function removeAll() {
        texts = [];
        images = [];
    }
    function removeLastText() {
        texts.splice(texts.length-1, 1);
    }
    function removeLastImage() {
        images.splice(images.length-1, 1);
    }
    function printAll() {
        for(var i = 0; i < texts.length; i++) {
            console.log(texts[i].text);   
        }
    }
    function remove(t) {
        if(t.charAt(0) != "\\"){
            for(var i = 0; i < texts.length; i++) {
                if(texts[i].text.toLowerCase() === t.toLowerCase()) {
                    texts.splice(i,1);
                }
            }
        }
        else if(t.charAt(0) == "\\") {
            var url = t.substring(1, t.length);
            for(var i = 0; i < images.length; i++) {
                if(images[i].url.toLowerCase() === url.toLowerCase()) {
                    images.splice(i,1);
                }
            }
        }
    }
    function addName(text) {
        if(text.charAt(0) != "\\"){
            var font = randInt(20,30) + "px "+ availableFonts[randInt(0,availableFonts.length-1)];
            texts[texts.length] = new Text(randInt(0,canvas.width), randInt(0, canvas.height), text, font, randColor(), randSpeed(1,3), randSpeed(1,3));
        }
        else if(text.charAt(0) == "\\") {
            var url = text.substring(1, text.length);
            images[images.length] = new ImageMove(randInt(0,canvas.width - 100), randInt(0, canvas.height - 100),url,randSpeed(1,3), randSpeed(1,3)
);
        }
    }
    function update() {
        clearCanvas();
        for(var i = 0; i < texts.length; i++) {
            texts[i].draw();
            texts[i].x += texts[i].vx;
            texts[i].y += texts[i].vy;
            collideWall(texts[i]);
            checkResolveOOB(texts[i]);
        }
        for(var i = 0; i < images.length; i++) {
            images[i].draw();
            images[i].x += images[i].vx;
            images[i].y += images[i].vy;
            collideImage(images[i]);
        }
    };
    var marginLeftAdd = $(window).width - $("#addText").width()/2 - $("#addTextButton").width()/2 - $("#addText").css("margin-right")/2 - $("#addTextButton").css("margin-left")/2; 
    $("#addHolder").css("padding-left",marginLeftAdd);
    $(window).resize(function() {
        canvas.height = $(window).height() * 0.97 - $("#addTextButton").height()*2;
        canvas.width = $(window).width() * 0.97;
        $("#addHolder").css({
            "width":"97%",
            'float':'left'
        });
        $("#canvasHolder").css({
            'float':'right' 
        });
    });
    setInterval(update, 1000/100);
    function praiseGaben() {
        removeAll();
        for(var i = 0; i < 20; i++) {
                var url = "img/gaben.jpg";
                images[images.length] = new ImageMove(randInt(0,canvas.width - 100), randInt(0, canvas.height - 100),url,randSpeed(1,3), randSpeed(1,3));
        }
    }
    window.praiseGaben = praiseGaben;
});
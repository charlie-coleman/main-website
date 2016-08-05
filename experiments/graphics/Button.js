function Button(label, x, y, width, height, lColor, rColor, font) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 200;
    this.height = height || 40;
    this.label = label || "Fuck You Set This";
    this.text_color = lColor || "#FFF";
    this.bg_color = rColor || "#000";
    this.font = font || "12px Courier New";
    this.rect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
    this.containsMouse = false;
    this.draw = function(g) {
        g.debug.geom(this.rect, this.bg_color);
        g.debug.text(this.label, this.x + (this.width-this.getTextWidth())/2, this.y + (this.height + this.getTextHeight())/2, this.text_color, this.font);
    }
    this.getTextWidth = function() {
        textWidth = $('<div>' + this.label + '</div>').hide().appendTo(document.body);
        textWidth.css('font', this.font);
        var width = textWidth.width();
        textWidth.remove();
        return width;
    }
    this.getTextHeight = function() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = this.font;
        var metrics = context.measureText(this.text);
        var height = metrics.width / this.font.length;
        return height;
    }
    this.update = function(g) {
        this.containsMouse = this.rect.contains(g.input.x, g.input.y);
    }
};
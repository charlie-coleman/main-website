var preDefString = ["prettyandmysterious"], preDefBg = ["06060A"], preDefC = ["332949"], matchPreDef = false, matched = 0;
$(function() {
    $(window).ready( function() { //Sets a text value on page load.
        var welcomeMessages = ["Welcome to the jam", "HZ00HZ", "Totally not blue",
                               "I think, therefore I am", "0o0", "charlie-coleman.com/experiments/1",
                               "colors are fun!","charlie coleman", "zz0000", "00zz00", "0000zz",
                               "00ZZZZ", "ZZZZ00", "ZZ00ZZ", "go ahead, type something", "you know you want to"]; //all the possible messages
        $("#RGB-text").val(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
        changeTextSize($("#RGB-text").css("font-size"));
        var c = base36to16($("#RGB-text").val());
        changeEverything(c);
    });
    $('#RGB-text').keyup(function(e) {
        if(e.keyCode == 27) { //clear the screen and update on ESC press
            $("#RGB-text").val("");
            changeTextSize($("#RGB-text").css("font-size"));
            var c = base36to16($("#RGB-text").val());
            changeEverything(c);
        }
    });
    $("#RGB-text").on('input', function(e) {
        if(e.keyCode != 27) { //What happens when you type
            changeTextSize($("#RGB-text").css("font-size")); //change the text size to fit the screen
            var stringVal = $("#RGB-text").val(); //gets the text in the input location
            //" , < . > / ? ` ~
            var  symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\",];
            symbols = symbols.concat(["|", ";", ":", "\'", "\"", ",", "<", ".", ">", "/", "?", "`", "~"]); //All accepted symbols currently
            var replaced = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h",  "i",];
            replaced = replaced.concat(["j", "k", "l",  "m",  "n", "o", "p", "q", "r", "s", "t", "y", "v"]); //What they will be replaced with
            for(var i = 0; i < symbols.length; i++) {//replace all those symbols if they are found
                var hold_count = (stringVal.split(symbols[i])).length-1;
                for(var j = 0; j < hold_count; j++) {
                    stringVal = stringVal.replace(symbols[i], replaced[i]);
                }
            }
            matchPreDef = false;
            stringVal = stringVal.replace(/\s{1}/g, '');
            stringVal = stringVal.replace(/[^a-zA-Z 0-9]{1}/g, '');
            for(var i = 0; i < preDefString.length; i++) {
                if(stringVal == preDefString[i]) {
                    matchPreDef = true;
                    matched = i;
                }
            }
            if(!matchPreDef) {
                var c = base36to16(stringVal); //send it to the math factory
                changeEverything(c); //update the screen
            }
            else {
                $("html,#container2,#container,#hexcolor,#RGB-text,body").css("background-color",preDefBg[matched]); //sets all backgrounds to the given color
                $("#RGB-text").css("color", preDefC[matched]);
                $("#hexcolor").text("Background: #" + preDefBg[matched]); //sets the text of the color values
                $("#hextext").text("Text: #" + preDefC[matched]);
                $("#hexcolor, #hextext").css("color",preDefC[matched]); //sets text colors
                $("#container").css("width","100%");
            }
        }
        else if(e.keyCode == 27) { //clear the screen and update on ESC press
            $("#RGB-text").val("");
            changeTextSize($("#RGB-text").css("font-size"));
            var c = base36to16($("#RGB-text").val());
            changeEverything(c);
        }
    });
});
$.fn.textWidth = function(text, font) { //text width calculation from http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};
function base36to16(color) { //Function to turn the string into a color. Most important function. Enter the math factory.
    color = color.replace(/\s+/g, '');
    color = color.replace(/[^a-zA-Z 0-9]+/g, '');
    var lengthC = color.length; //length of the string
    var amount = Math.ceil(lengthC/3); //Determine length of the 3 parts that will define R, G, and B
    var add = amount*3 - lengthC; //Determine how many characters need to be added to reach the length needed
    if(color.length > add) //if the string is longer than the number of characters to be added (if length != 1, basically)
        color+=color.substring(0, add); //x is the number of characters to be added, takes x characters from the start of the string and adds them to the end.
    else { //if length == 1, basically
        for(var i = 0; i < add; i++) {
            color += color.substring(0,1); //adds the first charecter until you have enough charecters
        }
    }
    var red36 = color.substring(0, amount); //splits the string into 3 sections of equal length
    var green36 = color.substring(amount, amount*2);
    var blue36 = color.substring(amount*2, amount*3);
    if(red36 == '')
        red36 = '0';
    if(green36 =='')
        green36 = '0';
    if(blue36 == '')
        blue36 = '0';
    var red = parseInt(red36,36); //Turns the numbers from base-36 to base-10 (decimal)
    var green = parseInt(green36,36);
    var blue = parseInt(blue36,36);
    var max = Math.pow(36,amount)-1; // calculates the maximum possible value for a base-36 number of the length that each of the sections is
    if(max == 0)
        max = 1;
    var red16 = Math.round((red/max)*255).toString(16); //scales each value down to fit between 0 and 255, then converts them to base-16 (hexadecimal)
    var green16 = Math.round((green/max)*255).toString(16);
    var blue16 = Math.round((blue/max)*255).toString(16);
    if(red16.length < 2) //makes sure all 3 parts are 2 digits long
        red16 = "0" + red16;
    if(green16.length < 2)
        green16 = "0" + green16;
    if(blue16.length < 2)
        blue16 = "0" + blue16;
    var newColor = "#"+red16+green16+blue16; //creates the color
    return newColor; //returns the color
};
function changeEverything(c) { //function to update everything
    $("html").css("background",c); //sets all backgrounds to the given color
    $("body").css("background",c);
    $("#RGB-text").css("background", c);
    $("#hexcolor").css("background",c);
    $("#container").css("background",c);
    $("#container2").css("background",c);
    var max = Math.max(red_val(c), green_val(c), blue_val(c)); //Finds highest color
    var min = Math.min(red_val(c), green_val(c), blue_val(c)); //Finds lowest color
    var avg = (red_val(c) + green_val(c) + blue_val(c)) / 3;
    var tol = 25;
    var high = 1.1; //Defines difference required to use complementary instead of opposite
    var low = 0.9;
    var red = (255-red_val(c)).toString(16);
    var green = (255-green_val(c)).toString(16);
    var blue = (255-blue_val(c)).toString(16);
    if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
        red = "0" + red;
    if(green.length < 2)
        green = "0" + green;
    if(blue.length < 2)
        blue = "0" + blue;
    var RGB = "#" + red + green + blue;
    if(((red_val(c)/avg) > low && (red_val(c)/avg) < high && (green_val(c)/avg) > low && (green_val(c)/avg) < high && (blue_val(c)/avg) > low && (blue_val(c)/avg) < high) || ((red_val(c)-min) < tol && (green_val(c)-min) < tol && (blue_val(c)-min) < tol)) {//if all colors are too close together
        var red = (255-red_val(c)).toString(16);
        var green = (255-green_val(c)).toString(16);
        var blue = (255-blue_val(c)).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue; //uses opposite
    }
    else if(max == red_val(c) && min == green_val(c)) {//else
        var red = green_val(c).toString(16);
        var green = red_val(c).toString(16);
        var blue = (red_val(c) + green_val(c) - blue_val(c)).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue;  //uses complementary
    }
    else if(max == red_val(c) && min == blue_val(c)) {//all different combinations for complementary colors
        var red = blue_val(c).toString(16);
        var green = (red_val(c) + blue_val(c) - green_val(c)).toString(16);
        var blue = red_val(c).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue;
    }
    else if(max == green_val(c) && min == red_val(c)) {//else
        var red = green_val(c).toString(16);
        var green = red_val(c).toString(16);
        var blue = (red_val(c) + green_val(c) - blue_val(c)).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue;
    }
    else if(max == green_val(c) && min == blue_val(c)) {//else
        var red = (blue_val(c) + green_val(c) - red_val(c)).toString(16);
        var green = blue_val(c).toString(16);
        var blue = green_val(c).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue;
    }
    else if(max == blue_val(c) && min == red_val(c)) {//else
        var red = blue_val(c).toString(16);
        var green = (red_val(c) + blue_val(c) - green_val(c)).toString(16);
        var blue = red_val(c).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue;
    }
    else if(max == blue_val(c) && min == green_val(c)) {//else
        var red = (blue_val(c) + green_val(c) - red_val(c)).toString(16);
        var green = blue_val(c).toString(16);
        var blue = green_val(c).toString(16);
        if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
            red = "0" + red;
        if(green.length < 2)
            green = "0" + green;
        if(blue.length < 2)
            blue = "0" + blue;
        var RGB = "#" + red + green + blue;
    }
    $("#RGB-text").css("color", RGB);
    var red = red_val(c).toString(16); //converts all parts of the RGB color to hexadecimal numbers
    var green = green_val(c).toString(16);
    var blue = blue_val(c).toString(16);
    var red2 = red_val(RGB).toString(16);
    var green2 = green_val(RGB).toString(16);
    var blue2 = blue_val(RGB).toString(16);
    if(red.length < 2) //makes sure all parts of the hexadecimal color are 2 digits
        red = "0" + red;
    if(green.length < 2)
        green = "0" + green;
    if(blue.length < 2)
        blue = "0" + blue;
    if(red2.length < 2)
        red2 = "0" + red2;
    if(green2.length < 2)
        green2 = "0" + green2;
    if(blue2.length < 2)
        blue2 = "0" + blue2;
    $("#hexcolor").text("Background: #" + red + green + blue); //sets the text of the color values
    $("#hextext").text("Text: #" + red2 + green2 + blue2);
    $("#hexcolor, #hextext").css("color",RGB); //sets text colors
    $("#container").css("width","100%");
};
function changeTextSize(text) {
    var textSize = parseInt(text.substring(0,text.length - 2)); //find the height of the current font
    var textWidth = $("#RGB-text").textWidth(); //finds the width of the current text at the current font size
    var scale = ($(window).width()*0.8) / textWidth; //finds out what percentage the text needs to be thinner to fit on the screen
    var newSize = scale * textSize; //finds the text height when the new font size is applied
    if(newSize > ($(window).height() * 0.7)) { //if the new size is taller than the screen
        newSize = $(window).height() * 0.7; //sets the font size to a size that is small enough to fit on screen
    }
    $("#RGB-text").css("font-size",newSize+"px"); //sets the text size
};
function red_val(hex) {
    hex_num = hex.substr(1,2);
    return parseInt(hex_num, 16)
}
function green_val(hex) {
    var hex_num = hex.substr(3,2);
    var val = parseInt(hex_num, 16);
    return val;
}
function blue_val(hex) {
    hex_num = hex.substr(5,2);
    return parseInt(hex_num, 16)
}

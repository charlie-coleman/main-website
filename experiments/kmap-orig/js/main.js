// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ GLOBAL VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var defaultDim, defaultVar, defaultOut;
var dimension, variables, output;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ WINDOW LOAD AND RESIZE FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$(window).on('load', function() {
    defaultDim = $("#dimension").val();
    defaultVar = $("#variables").val();
    defaultOut = $("#output-var").val();
    
    $("#minterms").keyup(mapInput);
    $("#dontcares").keyup(mapInput);
});

$(window).resize(function() {
    
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ CONTINUE FROM EACH STEP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

setupContinue = function() {
    dimension = parseInt(stripHTML($("#dimension").val()), 10);
    variables = stripHTML($("#variables").val()).split(',');
    output = stripHTML($("#output-var").val());
    if (assertSetupInputs(dimension, variables, output)) {
        buildTable(dimension, variables, output);
        
        $("#map").css({"display":"block"});
        $("html, body").animate({
            scrollTop: $("#map").offset().top
        }, 1000);
        $("html, body").promise().done( function() {
            $("#setup").css({"display":"none"});
        });
    }
}

mapContinue = function() {
    var minterms = stripHTML($("#minterms").val()).split(',');
    if(minterms.length == 1 && minterms[0] == '')
        minterms = [];
    for (var i = 0; i < minterms.length; i++) minterms[i] = +minterms[i];
    var dontcares = stripHTML($("#dontcares").val()).split(',');
    if(dontcares.length == 1 && dontcares[0] == '')
        dontcares = [];
    for (var i = 0; i < dontcares.length; i++) dontcares[i] = +dontcares[i];
    
    $("#solution").css({"display":"block"});
    $("html, body").animate({
        scrollTop: $("#solution").offset().top
    }, 1000);
    $("html, body").promise().done( function() {
        $("#map").css({"display":"none"});
    });
    var strings = petrick(minterms, dontcares, dimension, variables, output);
    $('#genSolution').text(strings[0]);
    $('#VHDLSolution').text(strings[1]);
    $('#verilogSolution').text(strings[2]);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ RESTART FROM EACH STEP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

mapRestart = function() {
    $("#dimension").val(defaultDim);
    $("#variables").val(defaultVar);
    $("#output-var").val(defaultOut);
    $("#minterms").val("");
    $("#dontcares").val("");
    
    $("#setup").css({"display":"block"});
    $("#map").css({"display":"none"});
}

solBack = function() {
    var minterms = stripHTML($("#minterms").val()).split(',');
    var dontcares = stripHTML($("#dontcares").val()).split(',');
    
    $("#map").css({"display":"block"});
    $("#solution").css({"display":"none"});
}

solRestart = function() {
    $("#dimension").val(defaultDim);
    $("#variables").val(defaultVar);
    $("#output-var").val(defaultOut);
    $("#minterms").val("");
    $("#dontcares").val("");
    
    $("#setup").css({"display":"block"});
    $("#solution").css({"display":"none"});
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ BUILD KARNAUGH MAP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

buildTable = function(d, v, o) {
    $("#kmap").empty();
    var rowNum = 2 ** Math.floor(d / 2);
    var colNum = 2 ** Math.ceil(d / 2);
    $("#kmap").append('<tr class="map-row-labels" id="row-title" style="height:0%;">'+
                        '<td class="column-label" id="column-label-space1">'+output+': </td>'+
                        '<td class="column-label" id="column-label-space2"></td>'+
                        '<td class="column-label" style="vertical-align:bottom;">'+v.slice(Math.floor(d/2), Math.floor(d/2)+Math.ceil(d/2)).join('')+'</td>'+
                      '</tr>' );
    $("#kmap").append('<tr class="map-row-labels" id="label-row"></tr>');
    $("#label-row").append('<td class="map-row-label" id="label-fill1"></td>');
    $("#label-row").append('<td class="map-row-label" id="label-fill2"></td>');
    for(var i = 1; i < colNum+1; i++) {
        $("#label-row").append('<td class="map-row-label" id="row-label-'+i+'">'+generateGray(i-1, Math.ceil(d/2))+'</td>');
    }
    for (var i = 0; i < rowNum; i++) {
        $("#kmap").append("<tr id='row-"+i+"'class='map-table-row'></tr>");
        var letters = (i == 0) ? v.slice(0, Math.floor(d/2)).join('') : '';
        $("#row-"+i).append("<td id='row-label'>"+letters+"</td>");
        $("#row-"+i).append('<td class="map-column-label" id="col-label-'+i+' style="height:1em;">'+generateGray(i, Math.floor(d/2))+'</td>')
        for (var j = 0; j < colNum; j++) {
            $("#row-"+i).append('<td class="map-table-cell" id="cell-'+i+'-'+j+'">'+
                                '<button class="map-table-button" id="button-'+i+'-'+j+'" onclick="javascript:changeButton('+i+','+j+');">0</button>'+
                                '</td>');
        }
    }
    mapInput();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ VERIFY SETUP INPUTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

assertSetupInputs = function(d, v, o) {
    if (isNaN(d) || (parseInt(d, 10) != d)) {
        alert("Number of inputs must be an integer.");
        return false;
    }
    else if ( parseInt(d,10) <= 1) {
        alert("Number of inputs must be greater than 1.");
        return false;
    }
    if (v.length != parseInt(d)) {
        alert("Number of variables must equal number of given variable names. (make sure they're comma-seperated)");
        return false;
    }
    return true;
}

assertMapInputs = function(min, dont) {
    var minterms = min.split(',');
    var dontcares = dont.split(',');
    for (var i = 0; i < minterms.length; i++) {
        if(isNaN(minterms[i]))
            return false;
    }
    for (var i = 0; i < dontcares; i++) {
        if (isNaN(dontcares[i]))
            return false;
    }
    return true;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ ACCEPT KMAP INPUTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

changeButton = function(r, c) {
    var currVal = stripHTML($("#button-"+r+"-"+c).text());
    var loc = parseInt(generateGray(r, Math.floor(dimension/2)) + generateGray(c, Math.ceil(dimension/2)),2).toString(10);
    var nextVal;
    if (currVal == '0') {
        nextVal = '1';
        
        var minVal = stripHTML($('#minterms').val());
        var newString = (minVal == '') ? loc : minVal + ',' + loc;
        $('#minterms').val(newString);
    }
    else if (currVal == '1') {
        nextVal = '-';
        
        var dVal = stripHTML($('#dontcares').val());
        var newString = (dVal == '') ? loc : dVal + ',' + loc;
        $('#dontcares').val(newString);
        
        var minVal = stripHTML($('#minterms').val());
        var newString = minVal.replace(loc, '');
        newString = newString.replace(',,',',');
        newString = (newString.substr(0,1) == ',') ? newString.substr(1) : newString;
        newString = (newString.substr(newString.length-1) == ',') ? newString.substr(0, newString.length-1) : newString;
        $('#minterms').val(newString);
    }
    else {
        nextVal = '0';
        
        var dVal = stripHTML($('#dontcares').val());
        var newString = dVal.replace(loc, '');
        newString = newString.replace(',,',',');
        newString = (newString.substr(0,1) == ',') ? newString.substr(1) : newString;
        newString = (newString.substr(newString.length-1) == ',') ? newString.substr(0, newString.length-1) : newString;
        $('#dontcares').val(newString);
    }
    $('#minterms').val(stripHTML($('#minterms').val()).split(',').sort(function(a, b){return a-b}).join(','));
    $('#dontcares').val(stripHTML($('#dontcares').val()).split(',').sort(function(a, b){return a-b}).join(','));
    $('#button-'+r+'-'+c).text(nextVal);
}

mapInput = function() {
    var minValues = stripHTML($("#minterms").val()).split(',').filter(function(n){return (n != "") && (n <= 2**dimension);});
    var dValues = stripHTML($("#dontcares").val()).split(',').filter(function(n){return n != "";});
    $(".map-table-button").text('0');
    for (var i = 0; i < dValues.length; i++) {
        var binString = leftPadString(parseInt(dValues[i],10).toString(2), dimension, "0");
        var rowNum = generateBin(parseInt(binString.substr(0, Math.floor(dimension/2)),2)); 
        var colNum = generateBin(parseInt(binString.substr(Math.floor(dimension/2), Math.ceil(dimension/2)),2));
        $("#button-"+rowNum+"-"+colNum).text('-');
    }
    for (var i = 0; i < minValues.length; i++) {
        var binString = leftPadString(parseInt(minValues[i],10).toString(2), dimension, "0");
        var rowNum = generateBin(parseInt(binString.substr(0, Math.floor(dimension/2)),2)); 
        var colNum = generateBin(parseInt(binString.substr(Math.floor(dimension/2), Math.ceil(dimension/2)),2));
        $("#button-"+rowNum+"-"+colNum).text('1');
    }
}

mapClear = function() {
    var clear = confirm("This will clear the Karnaugh map. Continue?");
    if (clear) {
        $("#minterms, #dontcares").val('');
        $(".map-table-button").text("0");
    }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ HELPER FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

generateGray = function(i, b) {
    i = i ^ (i >> 1);
    i = i.toString(2);
    i = Array(b - i.length + 1).join("0") + i;
    return i;
}

generateBin = function(g) {
    var b = g;
    for (var i = 1; i < b.toString(2).length; i++) {
        b = b ^ (g >> i);
    }
    return b;
}

leftPadString = function(s, l, p) {
    s = Array(l - s.length + 1).join(p) + s;
    return s;
}

function stripHTML(str){
  var strippedText = $("<div/>").html(str).text();
  return strippedText;
}
const calqAmt = 1;
const redAmt = 1;
var fruitAmt = 5, regAmt = 5, spiritAmt = 1;
var currXp, goalXp, currLvl, goalLvl, gpPerXP, gpPerDay, xpPerDay;

$(document).ready(function() {
    initializeForm();
    populateFruit();
    populateReg();
    populateSpecials();
    
    $("#curr-lvl").on('input', function() { onCurrLvlChange(); });
    $("#goal-lvl").on('input', function() { onGoalLvlChange(); });
    
    $("#curr-xp").on('input', function() { onCurrXpChange(); });
    $("#goal-xp").on('input', function() { onGoalXpChange(); });
    
    $("#fruit-select").change(function() { populateFruit(); });
    $("#reg-select").change(function() { populateReg(); });
});

function initializeForm() {
    var fruitSel = $("#fruit-select");
    $.each(trees.fruit, function(i, obj) {
        fruitSel.append($("<option></option>").attr("value", i).text(obj.name));
    });
    $("#fruit-amt").text(5);
    
    var regSel = $("#reg-select");
    $.each(trees.reg, function(i, obj) {
        regSel.append($("<option></option>").attr("value", i).text(obj.name));
    });
    $("#reg-amt").text(5);
    
    $("#spirit-amt").text(1/2);
}

function populateFruit() {
    var i = $("#fruit-select").val();
    $("#fruit-lvl").text(trees.fruit[i].level);
    $("#fruit-protection").text(trees.fruit[i].protection.name + " x" + trees.fruit[i].protection.amount);
    var totXp = parseFloat(trees.fruit[i].plant, 10) + parseFloat(trees.fruit[i].check, 10) + 6*parseFloat(trees.fruit[i].harvest, 10);
    $("#fruit-tot-xp").text(commaify(totXp));
}

function populateReg() {
    var i = $("#reg-select").val();
    $("#reg-lvl").text(trees.reg[i].level);
    $("#reg-protection").text(trees.reg[i].protection.name + " x" + trees.reg[i].protection.amount);
    var totXp = parseFloat(trees.reg[i].plant, 10) + parseFloat(trees.reg[i].check, 10);
    $("#reg-tot-xp").text(commaify(totXp));
}

function populateSpecials() {
    $("#calq-lvl").text(trees.calquat.level);
    $("#calq-name").text(trees.calquat.name);
    $("#calq-protection").text(trees.calquat.protection.name + " x" + trees.calquat.protection.amount);
    $("#calq-amt").text(1);
    var totXp = parseFloat(trees.calquat.plant, 10) + parseFloat(trees.calquat.check) + 6*parseFloat(trees.calquat.harvest, 10);
    $("#calq-tot-xp").text(commaify(totXp));
    
    $("#spirit-lvl").text(trees.spirit.level);
    $("#spirit-name").text(trees.spirit.name);
    var htmlProt = "";
    $.each(trees.spirit.protection, function(i, obj) {
        htmlProt += obj.name + " x" + obj.amount + "<br />";
    });
    $("#spirit-protection").html(htmlProt);
    totXp = parseFloat(trees.spirit.plant, 10) + parseFloat(trees.spirit.check, 10);
    $("#spirit-tot-xp").text(commaify(totXp));
    
    $("#red-lvl").text(trees.redwood.level);
    $("#red-name").text(trees.redwood.name);
    $("#red-protection").text(trees.redwood.protection.name + " x" + trees.redwood.protection.amount);
    $("#red-amt").text(1/4);
    totXp = parseFloat(trees.redwood.plant, 10) + parseFloat(trees.redwood.check, 10);
    $("#red-tot-xp").text(commaify(totXp));
}

function xpFromLevel(level) {
    return xp[level];
}

function levelFromXP(xpIn) {
    for (var i = 1; i < Object.keys(xp).length; i++) if (xpIn >= xp[i] && xpIn < xp[i+1]) return i;
    return 126;
}

function onCurrXpChange() {
    currXp = parseInt($("#curr-xp").val(), 10);
    $("#goal-xp").attr("min", currXp+1);
    if(!isNaN(currXp)) $("#curr-lvl").val(levelFromXP(currXp));
}

function onGoalXpChange() {
    goalXp = parseInt($("#goal-xp").val(), 10);
    if(!isNaN(goalXp)) $("#goal-lvl").val(levelFromXP(goalXp));
}

function onCurrLvlChange() {
    currLvl = parseInt($("#curr-lvl").val(), 10);
    $("#goal-lvl").attr("min", currLvl);
    if(!isNaN(currLvl)) $("#curr-xp").val(xpFromLevel(currLvl));
}

function onGoalLvlChange() {
    goalLvl = parseInt($("#goal-lvl").val(), 10);
    if(!isNaN(goalLvl)) $("#goal-xp").val(xpFromLevel(goalLvl));
}

function commaify(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPrice(id) {
//    $.getJSON("https://rsbuddy.com/exchange/graphs/180/"+id+".json", function(data) {
//        console.log(data);
//    });
    getJSON("https://rsbuddy.com/exchange/graphs/180/"+id+".json", function(err, data) {
        console.log(err, data);
    });
}

var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    
    xhr.onload = function() {
    
        var status = xhr.status;
        
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    
    xhr.send();
};

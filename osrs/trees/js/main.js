const calqAmt = 1;
const redAmt = 1;
var fruitAmt = 5, regAmt = 5, spiritAmt = 1;
var currXp, goalXp, currLvl, goalLvl, gpPerXP, gpPerDay, xpPerDay;

var prices = {
    fruit: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ],
    reg: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ],
    calquat: [0, 0],
    spirit: [0, 0],
    redwood: [0, 0]
};

var values = {
    fruit: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0
    },
    reg: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0
    },
    calquat: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0
    },
    spirit: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0
    },
    redwood: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0
    }
}

$(document).ready(function() {
    getAllPrices(initializeForm);
    
    $("#curr-lvl").on('input', function() { onCurrLvlChange(); });
    $("#goal-lvl").on('input', function() { onGoalLvlChange(); });
    
    $("#curr-xp").on('input', function() { onCurrXpChange(); });
    $("#goal-xp").on('input', function() { onGoalXpChange(); });
    
    $("#fruit-select").change(function() { populateFruit(); });
    $("#reg-select").change(function() { populateReg(); });
    
    $("#fruit-en").change(function() { values.fruit.enabled = $("#fruit-en").prop("checked"); populateFruit(); });
    $("#reg-en").change(function() { values.reg.enabled = $("#reg-en").prop("checked"); populateReg(); });
    $("#calq-en").change(function() { values.calq.enabled = $("#calq-en").prop("checked"); });
    $("#spirit-en").change(function() { values.spirit.enabled = $("#spirit-en").prop("checked"); });
    $("#red-en").change(function() { values.redwood.enabled = $("#redwood-en").prop("checked"); });
    
    $("#fruit-protect").change(function() { values.fruit.protect = $("#fruit-protect").prop("checked"); populateFruit(); });
    $("#reg-protect").change(function() { values.reg.protect = $("#reg-protect").prop("checked"); populateReg(); });
    $("#calq-protect").change(function() { values.calq.protect = $("#calq-protect").prop("checked"); });
    $("#spirit-protect").change(function() { values.spirit.protect = $("#spirit-protect").prop("checked"); });
    $("#red-protect").change(function() { values.redwood.protect = $("#redwood-protect").prop("checked"); });
});

function getAllPrices(callback) {
    $.each(trees.fruit, function(i, obj) {
        getPrice(obj["item-id"]).done(function(data) {
            prices.fruit[i][0] = data[data.length-1].buyingPrice;
            callback();
        });
        getPrice(obj.protection["item-id"]).done(function(data) {
            prices.fruit[i][1] = data[data.length-1].buyingPrice;
            callback();
        });
    });
    $.each(trees.reg, function(i, obj) {
        getPrice(obj["item-id"]).done(function(data) {
            prices.reg[i][0] = data[data.length-1].buyingPrice;
            callback();
        });
        getPrice(obj.protection["item-id"]).done(function(data) {
            prices.reg[i][1] = data[data.length-1].buyingPrice;
            callback();
        });
    });
    
    getPrice(trees.calquat["item-id"]).done(function(data) {
        prices.calquat[0] = data[data.length-1].buyingPrice;
        callback();
    });
    getPrice(trees.calquat.protection["item-id"]).done(function(data) {
        prices.calquat[1] = data[data.length-1].buyingPrice;
        callback();
    });
    
    $.each(trees.spirit.protection, function(i, obj) {
        if(obj["item-id"] !== "untradeable") 
            getPrice(obj["item-id"]).done(function(data) {
                prices.spirit[1] += (data[data.length-1].buyingPrice*parseInt(obj.amount,10));
                callback();
            });
    });
    
    getPrice(trees.redwood["item-id"]).done(function(data) {
        prices.redwood[0] = data[data.length-1].buyingPrice;
        callback();
    });
    getPrice(trees.redwood.protection["item-id"]).done(function(data) {
        prices.redwood[1] = data[data.length-1].buyingPrice;
        callback();
    });
}

function initializeForm() {
    var fruitSel = $("#fruit-select");
    fruitSel.empty();
    $.each(trees.fruit, function(i, obj) {
        fruitSel.append($("<option></option>").attr("value", i).text(obj.name));
    });
    $("#fruit-amt").text(5);
    
    var regSel = $("#reg-select");
    regSel.empty();
    $.each(trees.reg, function(i, obj) {
        regSel.append($("<option></option>").attr("value", i).text(obj.name));
    });
    $("#reg-amt").text(5);
    
    $("#spirit-amt").text(1/2);

    populateFruit();
    populateReg();
    populateSpecials();
}

function populateFruit() {
    var i = $("#fruit-select").val();
    var cost = prices.fruit[i][0];
    var protCost = prices.fruit[i][1]*parseInt(trees.fruit[i].protection.amount, 10);
    values.fruit.gp = cost + protCost;
    
    $("#fruit-en").prop("checked", values.fruit.enabled);
    $("#fruit-lvl").text(trees.fruit[i].level);
    $("#fruit-cost").text(commaify(cost));
    $("#fruit-protect").prop("checked", values.fruit.protect);
    $("#fruit-protection").text(trees.fruit[i].protection.name + " x" + trees.fruit[i].protection.amount);
    $("#fruit-protect-cost").text(commaify(protCost));
    $("#fruit-tot-cost").text(commaify(values.fruit.gp));
    
    values.fruit.xp = parseFloat(trees.fruit[i].plant, 10) + parseFloat(trees.fruit[i].check, 10) + 6*parseFloat(trees.fruit[i].harvest, 10);
    values.fruit.gpxp = values.fruit.gp / values.fruit.xp;
    
    $("#fruit-tot-xp").text(commaify(values.fruit.xp));
    $("#fruit-gp-xp").text(values.fruit.gpxp.toFixed(3));
}

function populateReg() {
    var i = $("#reg-select").val();
    var cost = prices.reg[i][0];
    var protCost = prices.reg[i][1]*parseInt(trees.reg[i].protection.amount, 10);
    values.reg.gp = values.reg.protect ? cost + protCost : cost;
    
    $("#reg-en").prop("checked", values.reg.enabled);
    $("#reg-lvl").text(trees.reg[i].level);
    $("#reg-cost").text(commaify(cost));
    $("#reg-protect").prop("checked", values.reg.protect);
    $("#reg-protection").text(trees.reg[i].protection.name + " x" + trees.reg[i].protection.amount);
    $("#reg-protect-cost").text(commaify(protCost));
    $("#reg-tot-cost").text(commaify(values.reg.gp));
    
    values.reg.xp = parseFloat(trees.reg[i].plant, 10) + parseFloat(trees.reg[i].check, 10);
    values.reg.gpxp = values.reg.gp/values.reg.xp;
    
    $("#reg-tot-xp").text(commaify(values.reg.xp));
    $("#reg-gp-xp").text(values.reg.gpxp.toFixed(3));
}

function populateSpecials() {
    var cost = prices.calquat[0];
    var protCost = prices.calquat[1]*parseInt(trees.calquat.protection.amount, 10);
    values.calquat.gp = cost + protCost;
    
    $("#calq-en").prop("checked", values.calquat.enabled);
    $("#calq-lvl").text(trees.calquat.level);
    $("#calq-name").text(trees.calquat.name);
    $("#calq-cost").text(commaify(cost));
    $("#calq-protect").prop("checked", values.calquat.protect);
    $("#calq-protection").text(trees.calquat.protection.name + " x" + trees.calquat.protection.amount);
    $("#calq-protect-cost").text(commaify(protCost));
    $("#calq-tot-cost").text(commaify(values.calquat.gp));
    $("#calq-amt").text(1);
    
    values.calquat.xp = parseFloat(trees.calquat.plant, 10) + parseFloat(trees.calquat.check) + 6*parseFloat(trees.calquat.harvest, 10);
    values.calquat.gpxp = values.calquat.gp / values.calquat.xp;
    
    $("#calq-tot-xp").text(commaify(values.calquat.xp));
    $("#calq-gp-xp").text(values.calquat.gpxp.toFixed(3));
    
    cost = prices.spirit[0];
    protCost = prices.spirit[1];
    values.spirit.gp = cost + protCost;
    
    $("#spirit-en").prop("checked", values.spirit.enabled);
    $("#spirit-lvl").text(trees.spirit.level);
    $("#spirit-name").text(trees.spirit.name);
    $("#spirit-cost").text(commaify(cost));
    $("#spirit-protect").prop("checked", values.spirit.protect);
    var htmlProt = "";
    $.each(trees.spirit.protection, function(i, obj) {
        htmlProt += obj.name + " x" + obj.amount + "<br />";
    });
    $("#spirit-protection").html(htmlProt);
    $("#spirit-protect-cost").text(commaify(protCost));
    $("#spirit-tot-cost").text(commaify(values.spirit.gp));
    values.spirit.xp = parseFloat(trees.spirit.plant, 10) + parseFloat(trees.spirit.check, 10);
    values.spirit.gpxp = values.spirit.gp/values.spirit.xp;
    $("#spirit-tot-xp").text(commaify(values.spirit.xp));
    $("#spirit-gp-xp").text(values.spirit.gpxp.toFixed(3));
    
    cost = prices.redwood[0];
    protCost = prices.redwood[1];
    values.redwood.gp = cost + protCost;
    
    $("#red-en").prop("checked", values.redwood.enabled);
    $("#red-lvl").text(trees.redwood.level);
    $("#red-name").text(trees.redwood.name);
    $("#red-cost").text(commaify(cost));
    $("#red-protect").prop("checked", values.redwood.protect);
    $("#red-protection").text(trees.redwood.protection.name + " x" + trees.redwood.protection.amount);
    $("#red-protect-cost").text(commaify(protCost));
    $("#red-tot-cost").text(commaify(values.redwood.gp));
    $("#red-amt").text(1/4);
    
    values.redwood.xp = parseFloat(trees.redwood.plant, 10) + parseFloat(trees.redwood.check, 10);
    values.redwood.gpxp = values.redwood.gp/values.redwood.xp;
    
    $("#red-tot-xp").text(commaify(values.redwood.xp));
    $("#red-gp-xp").text(values.redwood.gpxp.toFixed(3));
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
    $("#goal-lvl").attr("min", currLvl);
}

function onGoalXpChange() {
    goalXp = parseInt($("#goal-xp").val(), 10);
    if(!isNaN(goalXp)) $("#goal-lvl").val(levelFromXP(goalXp));
}

function onCurrLvlChange() {
    currLvl = parseInt($("#curr-lvl").val(), 10);
    $("#goal-lvl").attr("min", currLvl);
    if(!isNaN(currLvl)) $("#curr-xp").val(xpFromLevel(currLvl));
    $("#goal-xp").attr("min", currXp+1);
}

function onGoalLvlChange() {
    goalLvl = parseInt($("#goal-lvl").val(), 10);
    if(!isNaN(goalLvl)) $("#goal-xp").val(xpFromLevel(goalLvl));
}

function commaify(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPrice(id) {
    return $.getJSON("https://cors.io/?https://rsbuddy.com/exchange/graphs/1440/"+id+".json").then(function(data) {
        return data;
    });
}
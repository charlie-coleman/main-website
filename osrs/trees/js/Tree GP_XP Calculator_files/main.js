const calqAmt = 1;
const redAmt = 1;
var fruitAmt = 5, regAmt = 5, spiritAmt = 1;
var currXp = 0, goalXp = 83, currLvl = 1, goalLvl = 2, gpPerXP, gpPerDay, xpPerDay;

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
        gpxp: 0,
        perday: 5
    },
    reg: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0,
        perday: 5
    },
    calquat: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0,
        perday: 1
    },
    spirit: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0,
        perday: 1
    },
    redwood: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0,
        perday: 0.25
    }
}

$(document).ready(function() {
    getAllPrices(initializeForm);
    
    $("#curr-lvl").on('input', function() {
        onCurrLvlChange();
        updateStats();
    });
    $("#goal-lvl").on('input', function() {
        onGoalLvlChange();
        updateStats();
    });
    
    $("#curr-xp").on('input', function() {
        onCurrXpChange();
        updateStats();
    });
    $("#goal-xp").on('input', function() {
        onGoalXpChange();
        updateStats();
    });
    
    $("#fruit-select").change(function() { populateFruit(); updateStats(); });
    $("#reg-select").change(function() { populateReg(); updateStats(); });
    
    $("#fruit-en").change(function() {
        values.fruit.enabled = $("#fruit-en").prop("checked");
        populateFruit();
        updateStats();
    });
    $("#reg-en").change(function() {
        values.reg.enabled = $("#reg-en").prop("checked");
        populateReg();
        updateStats();
    });
    $("#calq-en").change(function() {
        values.calq.enabled = $("#calq-en").prop("checked");
        populateSpecials();
        updateStats();
    });
    $("#spirit-en").change(function() {
        values.spirit.enabled = $("#spirit-en").prop("checked");
        populateSpecials();
        updateStats();
    });
    $("#red-en").change(function() {
        values.redwood.enabled = $("#red-en").prop("checked");
        populateSpecials();
        updateStats();
    });
    
    $("#fruit-protect").change(function() { 
        values.fruit.protect = $("#fruit-protect").prop("checked");
        populateFruit();
        updateStats();
    });
    $("#reg-protect").change(function() {
        values.reg.protect = $("#reg-protect").prop("checked");
        populateReg();
        updateStats();
    });
    $("#calq-protect").change(function() {
        values.calq.protect = $("#calq-protect").prop("checked");
        populateSpecials();
        updateStats();
    });
    $("#spirit-protect").change(function() {
        values.spirit.protect = $("#spirit-protect").prop("checked");
        populateSpecials();
        updateStats();
    });
    $("#red-protect").change(function() {
        values.redwood.protect = $("#red-protect").prop("checked");
        populateSpecials();
        updateStats();
    });
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
    levelCutoffs();
    updateStats();
}

function populateFruit() {
    var i = $("#fruit-select").val();
    var cost = prices.fruit[i][0];
    var protCost = prices.fruit[i][1]*parseInt(trees.fruit[i].protection.amount, 10);
    values.fruit.gp = values.fruit.protect ? cost + protCost : cost;
    
    $("#fruit-en").prop("checked", values.fruit.enabled);
    $("#fruit-lvl").text(trees.fruit[i].level);
    $("#fruit-amt").text(values.fruit.perday);
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
    $("#reg-amt").text(values.reg.perday);
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
    values.calquat.gp = values.calquat.protect ? cost + protCost : cost;
    
    $("#calq-en").prop("checked", values.calquat.enabled);
    $("#calq-lvl").text(trees.calquat.level);
    $("#calq-name").text(trees.calquat.name);
    $("#calq-cost").text(commaify(cost));
    $("#calq-protect").prop("checked", values.calquat.protect);
    $("#calq-protection").text(trees.calquat.protection.name + " x" + trees.calquat.protection.amount);
    $("#calq-protect-cost").text(commaify(protCost));
    $("#calq-tot-cost").text(commaify(values.calquat.gp));
    $("#calq-amt").text(values.calquat.perday);
    
    values.calquat.xp = parseFloat(trees.calquat.plant, 10) + parseFloat(trees.calquat.check) + 6*parseFloat(trees.calquat.harvest, 10);
    values.calquat.gpxp = values.calquat.gp / values.calquat.xp;
    
    $("#calq-tot-xp").text(commaify(values.calquat.xp));
    $("#calq-gp-xp").text(values.calquat.gpxp.toFixed(3));
    
    cost = prices.spirit[0];
    protCost = prices.spirit[1];
    values.spirit.gp = values.spirit.protect ? cost + protCost : cost;
    
    $("#spirit-en").prop("checked", values.spirit.enabled);
    $("#spirit-lvl").text(trees.spirit.level);
    $("#spirit-amt").text(values.spirit.perday);
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
    values.redwood.gp = values.redwood.protect ? cost + protCost : cost;
    
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

function updateStats() {
    gpPerDay = 0;
    $.each(values, function(i, obj) {
        gpPerDay += obj.enabled ? obj.gp * obj.perday : 0;
    });
    $("#gpday").text(commaify(gpPerDay));
    xpPerDay = 0;
    $.each(values, function(i, obj) {
        xpPerDay += obj.enabled ? obj.xp * obj.perday : 0;
    });
    $("#xpday").text(commaify(xpPerDay.toFixed(1)));
    gpPerXP = gpPerDay/xpPerDay;
    $("#gpxp").text(gpPerXP.toFixed(3));
    var daysToGoal = Math.ceil((goalXp - currXp) / xpPerDay);
    $("#days").text(commaify(daysToGoal));
    var totCost = gpPerDay * daysToGoal;
    $("#cost").text(commaify(totCost));
}

function levelCutoffs() {
    values.reg.perday = (currLvl >= 65) ? 6 : 5;
    values.fruit.perday = (currLvl >= 85) ? 6 : 5;
    
    values.calquat.enabled = (currLvl >= 72);
    toggleRow("calq", values.calquat.enabled);
    
    values.spirit.enabled = (currLvl >= 83);
    toggleRow("spirit", values.spirit.enabled);
    
    values.redwood.enabled = (currLvl >= 90);
    toggleRow("red", values.redwood.enabled);
    
    values.spirit.perday = (currLvl >= 99) ? 2.5 : (currLvl >= 91) ? 1 : 0.5;
    
    populateFruit();
    populateReg();
    populateSpecials();
    updateStats();
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
    if(!isNaN(currXp)) $("#curr-lvl").val(levelFromXP(currXp));
    updateGoal();
    levelCutoffs();
}
function onCurrLvlChange() {
    currLvl = parseInt($("#curr-lvl").val(), 10);
    currXp = parseInt(xpFromLevel(currLvl));
    if(!isNaN(currLvl)) $("#curr-xp").val(currXp);
    updateGoal();
    levelCutoffs();
}

function onGoalXpChange() {
    goalXp = parseInt($("#goal-xp").val(), 10);
    if(!isNaN(goalXp)) $("#goal-lvl").val(levelFromXP(goalXp));
}
function onGoalLvlChange() {
    goalLvl = parseInt($("#goal-lvl").val(), 10);
    goalXp = xpFromLevel(goalLvl);
    if(!isNaN(goalLvl)) $("#goal-xp").val(goalXp);
}

function updateGoal() {
    $("#goal-lvl").attr("min", currLvl);
    $("#goal-xp").attr("min", currXp+1);
    
    goalXp = (goalXp <= currXp) ? currXp+1 : goalXp;
    goalLvl = levelFromXP(parseInt(goalXp, 10));
    $("#goal-xp").val(goalXp);
    $("#goal-lvl").val(goalLvl);
}

function toggleRow(id, en) {
    if(en) $("#" + id + "-row").removeClass("disable");
    else $("#" + id + "-row").addClass("disable");
}

function commaify(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPrice(id) {
    return $.getJSON("https://cors.io/?https://rsbuddy.com/exchange/graphs/1440/"+id+".json").then(function(data) {
        return data;
    });
}
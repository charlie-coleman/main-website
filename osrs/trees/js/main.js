const calqAmt = 1;
const redAmt = 1;
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
    hard: [
        [0, 0],
        [0, 0],
    ],
    calq: [
        [0, 0],
    ],
    spirit: [
        [0, 0],
    ],
    red: [
        [0, 0],
    ],
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
    hard: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0,
        perday: 1
    },
    calq: {
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
    red: {
        enabled: true,
        protect: true,
        gp: 0,
        xp: 0,
        gpxp: 0,
        perday: 0.25
    }
}

$(document).ready(function() {
    // getAllPrices(initializeForm);
    
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
    
    $.each(trees, function(i, obj) {
        $("#tree-table").append("<tr class='tree-row' id='" + obj.id + "-row' ></tr>")
        
        var nameHTML;
        if(obj.options.length > 1) {
            nameHTML = `<td><select class="tree-select" id="${obj.id}-select"></select></td>`;
        } else {
            nameHTML = `<td><span class="tree-select" id="${obj.id}-select"></span></td>`;
        }
        
        $("#"+obj.id+"-row").html(`
                <td><input class="tree-enable" id="${obj.id}-en" type="checkbox" /></td>
                <td><span class="tree-attr" id="${obj.id}-type"></span></td>
                <td><span class="tree-attr" id="${obj.id}-lvl"></span></td>
                ${nameHTML}
                <td><span class="tree-attr" id="${obj.id}-amt"></span></td>
                <td><span class="tree-attr" id="${obj.id}-cost"></span></td>
                <td><input class="tree-enable" id="${obj.id}-protect" type="checkbox" /></td>
                <td><span class="tree-attr" id="${obj.id}-protection"></span></td>
                <td><span class="tree-attr" id="${obj.id}-protect-cost"></span></td>
                <td><span class="tree-attr" id="${obj.id}-tot-cost"></span></td>
                <td><span class="tree-attr" id="${obj.id}-tot-xp"></span></td>
                <td><span class="tree-attr" id="${obj.id}-gp-xp"></span></td>`);
    
        $("#"+obj.id+"-en").change(function() {
            values[obj.id].enabled = $("#"+obj.id+"-en").prop("checked");
            populateRow(i);
            toggleRow(i, values[obj.id].enabled);
            updateStats();
        });
        
        
    
        $("#"+obj.id+"-select").change(function() { populateRow(i); updateStats(); });
    
        $("#"+ obj.id +"-protect").change(function() { 
            values[obj.id].protect = $("#"+obj.id+"-protect").prop("checked");
            populateRow(i);
            updateStats();
        });
    });
    
    
    initializeForm();
    getAllPrices();
    levelCutoffs();
});

function getAllPrices() {
    
    $.each(trees, function(i, obj) {
        $.each(obj.options, function(j, obj2) {
            if(obj2["item-id"] !== "untradeable")    
                getPrice(obj2["item-id"]).done(function(data) {
                    prices[obj.id][j][0] = data[data.length-1].buyingPrice;
                    populateRow(i);
                    updateStats();
                });
            if(obj2.protection.length === undefined) {
                getPrice(obj2.protection["item-id"]).done(function(data) {
                    prices[obj.id][j][1] = data[data.length - 1].buyingPrice;
                    populateRow(i);
                    updateStats();
                });
            } else {
                $.each(obj2.protection, function(k, obj3) {
                    if (obj3["item-id"] !== "untradeable")
                        getPrice(obj3["item-id"]).done(function(data) {
                            prices[obj.id][j][1] += (data[data.length-1].buyingPrice * parseInt(obj3.amount, 10));
                            populateRow(i);
                            updateStats();
                        });
                });
            }
        });
    });
}

function initializeForm() {
    
    $.each(trees, function(i, obj) {
        var select = $(`#${obj.id}-select`);
        if (obj.options.length > 1) {
            select.empty();
            $.each(trees[i].options, function(j, obj2) {
                select.append($("<option></option>").attr("value", j).text(obj2.name));
            });
        }
        else {
            select.text(obj.options[0].name);
        }
        populateRow(i);
    });

    levelCutoffs();
    updateStats();
}

function populateRow(rowNum) {
    var id = trees[rowNum].id;
    var i = 0;
    if (trees[rowNum].options.length > 1) i = $("#" + id + "-select").val();
    var cost = prices[id][i][0];
    
    var protString = "";
    var protCost = 0;
    values[id].gp = values[id].protect ? cost + protCost : cost;
    if (trees[rowNum].options[i].protection.length !== undefined) {
        $.each(trees[rowNum].options[i].protection, function(j, obj) {
            protString += `${trees[rowNum].options[i].protection[j].name} x${trees[rowNum].options[i].protection[j].amount} <br />`;
            protCost = prices[id][i][1];
        });
    }
    else {
        protString = `${trees[rowNum].options[i].protection.name} x${trees[rowNum].options[i].protection.amount}`;
        protCost = prices[id][i][1]*parseInt(trees[rowNum].options[i].protection.amount, 10);
    }
    values[id].gp = values[id].protect ? cost + protCost : cost;
    
    $("#"+id+"-en").prop("checked", values[id].enabled);
    $("#"+id+"-type").text(trees[rowNum]["row-name"]);
    $("#"+id+"-lvl").text(trees[rowNum].options[i].level);
    $("#"+id+"-amt").text(values[id].perday);
    $("#"+id+"-cost").text(commaify(cost));
    $("#"+id+"-protect").prop("checked", values[id].protect);
    $("#"+id+"-protection").html(protString);
    $("#"+id+"-protect-cost").text(commaify(protCost));
    $("#"+id+"-tot-cost").text(commaify(values[id].gp));
    
    values[id].xp = parseFloat(trees[rowNum].options[i].plant, 10) + parseFloat(trees[rowNum].options[i].check, 10);
    values[id].xp += (trees[rowNum].options[i].harvest === undefined) ? 0 : 6*trees[rowNum].options[i].harvest;
    values[id].gpxp = values[id].gp / values[id].xp;
    
    $("#"+id+"-tot-xp").text(commaify(values[id].xp));
    $("#"+id+"-gp-xp").text(values[id].gpxp.toFixed(3));
    
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
    
    values.calq.enabled = (currLvl >= 72);
    $("#calq-en").attr("disabled", !values.calq.enabled)
    toggleRow(3, values.calq.enabled);
    
    values.spirit.enabled = (currLvl >= 83);
    $("#spirit-en").attr("disabled", !values.spirit.enabled);
    toggleRow(4, values.spirit.enabled);
    
    values.red.enabled = (currLvl >= 90);
    $("#red-en").attr("disabled", !values.red.enabled);
    toggleRow(5, values.red.enabled);
    
    values.spirit.perday = (currLvl >= 99) ? 2.5 : (currLvl >= 91) ? 1 : 0.5;
    
    $.each(trees, populateRow);
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

function toggleRow(rowNum, en) {
    var id = trees[rowNum].id;
    if(en) $("#" + id + "-row").removeClass("disable");
    else $("#" + id + "-row").addClass("disable");
    
    $("#" + id + "-select").attr("disabled", !en);
    $("#" + id + "-protect").attr("disabled", !en);
}

function commaify(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPrice(id) {
    return $.getJSON("https://cors.io/?https://rsbuddy.com/exchange/graphs/1440/"+id+".json").then(function(data) {
        return data;
    });
}
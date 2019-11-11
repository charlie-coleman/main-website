var variableNames, returnName, dimension;
var dontCares, minterms;

var computable = true;
var errorStr = "";
var termLimit;

var petrick;

$(window).on('load', function() {
    petrick = new Petrick([], [], 0, [], "");
    onInfoChange();

    $("#variable-names").keyup(onInfoChange);
    $("#return-name").keyup(onInfoChange);
    $("#minterms").keyup(onInfoChange);
    $("#dont-cares").keyup(onInfoChange);
});

function onInfoChange() {
    fetchAttributes();
    fetchTerms();
    checkInputs();
    if (computable)
        calculate();
    else {
        setSolution("#generic-solution", errorStr);
        setSolution("#vhdl-solution", "");
        setSolution("#verilog-solution", "");
    }
}

function fetchAttributes() {
    variableNames = getInputStr("#variable-names").split(",");
    variableNames = removeEmptyStrings(variableNames);
    variableNames = variableNames.map(function(val, i) {
        return $.trim(val);
    });
    returnName = getInputStr("#return-name");
    dimension = variableNames.length;
    termLimit = Math.pow(2, dimension) - 1;
}

function fetchTerms() {
    let temp = getInputStr("#minterms").split(",");
    temp = removeEmptyStrings(temp);
    minterms = temp.map(function(val) {
        return parseInt($.trim(val), 10);
    });

    temp = getInputStr("#dont-cares").split(",");
    temp = removeEmptyStrings(temp);
    dontCares = temp.map(function(val) {
        return parseInt($.trim(val), 10);
    });

    minterms.sort();
    dontCares.sort();
}

function removeEmptyStrings(arr) {
    return arr.filter(v => v != "");
}

function calculate() {
    petrick.setVariableNames(variableNames);
    petrick.setReturnName(returnName);
    petrick.setDimension(dimension);
    petrick.setMinTerms(minterms);
    petrick.setDontCares(dontCares);

    petrick.calculateEssentials();
    setSolution("#generic-solution", petrick.getGeneric());
    setSolution("#vhdl-solution", petrick.getGeneric());
    setSolution
}

function setSolution(id, sol) {
    $(id).val(sol);
} 

function checkInputs() {
    computable = true;

    if (minterms.includes(NaN))
        setError("One of your minterms is not a number.");
    else if (dontCares.includes(NaN))
        setError("One of your don't cares is not a number.");
    else if (minterms.length > 0 && !termInBounds(minterms[minterms.length - 1]))
        setError("One of your minterms is out of range (too high or below zero).");
    else if (dontCares.length > 0 && !termInBounds(dontCares[dontCares.length - 1]))
        setError("One of your don't cares is out of range (too high or below zero).");
    else if (returnName === "")
        setError("Function output name is unset.");
    else if (variableNames.length === 0)
        setError("No inputs set.");
}

function setError(str) {
    computable = false;
    errorStr = str;
}

function termInBounds(term) {
    return (term >= 0 && term <= termLimit);
}

function getInputStr(id) {
    return stripHtml($(id).val());
}

function stripHtml(str) {
    return $("<div />").html(str).text();
}
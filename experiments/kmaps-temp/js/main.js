var petrick;
var prevDimension = -1;
var maxDimension = 10;
var drawKmap = true;
var sop = false;

$(window).on('load', function() {
    petrick = new Petrick([], [], [], 0, [], "");
    checkWindowSize();
    onInfoChange();

    $("#variable-names").keyup(onInfoChange);
    $("#return-name").keyup(onInfoChange);
    $("#minterms").keyup(() => onInfoChange(false));
    $("#dont-cares").keyup(() => onInfoChange(false));
});

$(window).resize(checkWindowSize);

function checkWindowSize() {
    if ($(window).width() < 960 && drawKmap) {
        drawKmap = false;
        onInfoChange();
    }
    else if ($(window).width() >= 960 && !drawKmap) {
        drawKmap = true;
        onInfoChange();
    }
}

function onInfoChange(forceKmapRedraw = true) {
    let {
        variableNames,
        returnName,
        dimension,
        termLimit
    } = fetchAttributes();

    let {
        minterms,
        maxterms,
        dontCares,
    } = fetchTerms(dimension);

    if ((forceKmapRedraw) || (drawKmap && dimension <= maxDimension)) {
        if (dimension != prevDimension) {
            prevDimension = dimension;
            createKmap(variableNames, returnName, dimension);
        }
        populateKmap(minterms, dontCares, dimension);
    }
    else {
        $("#kmap").empty();
        $("#kmap").append(`<label id="kmap-replace-text">Kmap too large to display</label>`);
        prevDimension = -1;
    }

    let { computable, errorStr } = checkInputs(minterms, dontCares, variableNames, returnName, termLimit);
    
    if (computable) {
        let essentials = calculate(variableNames, returnName, dimension, minterms, maxterms, dontCares, sop);
        colorKmap(essentials, dimension);
    }
    else {
        setSolution("#generic-solution", errorStr);
        setSolution("#vhdl-solution", "");
        setSolution("#verilog-solution", "");
    }
}

function fetchAttributes() {
    let variableNames = getInputStr("#variable-names").split(",");
    variableNames = variableNames.map(function(val, i) {
        return $.trim(val);
    });
    variableNames = removeEmptyStrings(variableNames);
    
    let returnName = getInputStr("#return-name");
    
    let dimension = variableNames.length;
    
    let termLimit = Math.pow(2, dimension) - 1;

    return {
        variableNames,
        returnName,
        dimension,
        termLimit
    };
}

function fetchTerms(dimension) {
    let minterms = getMinterms();
    let dontCares = getDontCares();

    let maxterms = allTerms(dimension).filter(v => (minterms.indexOf(v) == -1 && dontCares.indexOf(v) == -1));

    minterms.sort((a, b) => (a - b));
    dontCares.sort((a, b) => (a - b));

    return {
        minterms,
        maxterms,
        dontCares
    }
}

function removeEmptyStrings(arr) {
    return arr.filter(v => v != "");
}

function calculate(vN, rN, dim, minterms, maxterms, dc) {
    petrick.setVariableNames(vN);
    petrick.setReturnName(rN);
    petrick.setDimension(dim);
    petrick.setMinterms(minterms);
    petrick.setMaxterms(maxterms);
    petrick.setDontCares(dc);

    if (sop) {
        petrick.calculateSOPEssentials();
        setSolution("#generic-solution", petrick.getSOPGeneric());
        setSolution("#vhdl-solution", petrick.getSOPVhdl());
        setSolution("#verilog-solution", petrick.getSOPVerilog());
        
        return petrick.getSOPEssentials();
    }
    else {
        petrick.calculatePOSEssentials();
        setSolution("#generic-solution", petrick.getPOSGeneric());
        setSolution("#vhdl-solution", petrick.getPOSVhdl());
        setSolution("#verilog-solution", petrick.getPOSVerilog());

        return petrick.getPOSEssentials();
    }
}

function setSolution(id, sol) {
    $(id).val(sol);
} 

function checkInputs(minterms, dontCares, variableNames, returnName, termLimit) {
    if (minterms.includes(NaN))
        return setError("One of your minterms is not a number.");
    else if (dontCares.includes(NaN))
        return setError("One of your don't cares is not a number.");
    else if (minterms.length > 0 && !termsInBounds(minterms, termLimit))
        return setError("One of your minterms is out of range (too high or below zero).");
    else if (dontCares.length > 0 && !termsInBounds(dontCares, termLimit))
        return setError("One of your don't cares is out of range (too high or below zero).");
    else if (returnName === "")
        return setError("Function output name is unset.");
    else if (variableNames.length === 0)
        return setError("No inputs set.");
    else {
        return {
            computable: true,
            errorStr: ""
        };
    }
}

function setError(str) {
    return {
        computable: false,
        errorStr: str,
    };
}

function createKmap(variableNames, returnName, dimension) {
    $("#kmap").empty();

    if (dimension == 0) return;

    let rowDim = Math.floor(dimension / 2);
    let colDim = Math.ceil(dimension / 2);
    let rowNum = Math.pow(2, rowDim);
    let colNum = Math.pow(2, colDim);

    $("#kmap").append(`
    <tr class="map-row" id="title-row">
        <td class="var-label" id="return-varible">${ returnName }:</td>
        <td class="column-label" />
        <td class="var-label" id="col-variables"> ${ variableNames.slice(rowDim).join('') }</td>
    </tr>        
    `);

    $("#kmap").append(`<tr class="map-row" id="binary-label"></tr>`);
    $("#binary-label").append('<td></td>'.repeat(2));

    for (let i = 0; i < colNum; i++) {
        let str = intToBin(indexToGray(i), colDim);
        $("#binary-label").append(`<td class="col-label" id="col-${ str }">${ str }</td>`);
    }

    for (let i = 0; i < rowNum; i++) {
        let rowId = `row-${i}`;
        let rowStr = intToBin(indexToGray(i), rowDim);
        $("#kmap").append(`<tr id="${rowId}" class="kmap-row"></tr>`);

        $(`#${rowId}`).append(`<td ${ (i == 0) ? `class="var-label" id="row-variables"` : "" }>${ (i == 0) ? variableNames.slice(0, rowDim).join('') : "" }</td>`);
        $(`#${rowId}`).append(`<td class="row-label" id="row-${ rowStr }">${ rowStr }</td>`);

        for (let j = 0; j < colNum; j++) {
            let cellId = `cell-${coordsToGray(i, rowDim, j, colDim)}`
            $(`#${rowId}`).append(`
            <td class="kmap-cell" id="${cellId}" onclick="javascript:cellChange(${i}, ${rowDim}, ${j}, ${colDim})">
                <label class="kmap-cell-label" id="${cellId}-label">0</label>
            </td>
            `);
        }
    }
    let w = $("#cell-0").width();
    let h = $("#cell-0").height();

    let size = Math.max(w, h);

    $("#kmap tr, td").width(size);
    $("#kmap tr, td").height(size);
}

function populateKmap(minterms, dontCares, dimension) {
    let limit = Math.pow(2, dimension) - 1;
    Array.from($(".kmap-cell")).forEach(function(val) {
        let num = parseInt(val.id.slice(5), 10);
        if (minterms.indexOf(num) !== -1) {
            setCell(num, "1");
        }
        else if (dontCares.indexOf(num) !== -1) {
            setCell(num, "-");
        }
        else {
            setCell(num, "0");
        }
    });
}

function colorKmap(essentials, dimension) {
    let numEss = essentials.length;
    essentials = essentials.sort((a, b) => (a.length - b.length));

    let rowDim = Math.floor(dimension / 2);
    let colDim = Math.ceil(dimension / 2);

    let rowNum = Math.pow(2, rowDim);
    let colNum = Math.pow(2, colDim);

    $(".kmap-cell").css("border", "");

    essentials.forEach(function(terms, i) {
        let color = createPastel((360 * i / numEss));
        terms.forEach(function(i, index) {
            let {row, col} = grayToCoords(i, dimension);
            let cellId = `#cell-${i}`;

            if ((row + 1) >= rowNum) {
                if (terms.indexOf(coordsToGray(0, rowDim, col, colDim)) == -1 || containsCol(terms, col, rowDim, colDim)) 
                    $(cellId).css('border-bottom', `2px solid ${color}`);
            }
            else if (terms.indexOf(coordsToGray(row + 1, rowDim, col, colDim)) == -1)
                $(cellId).css('border-bottom', `2px solid ${color}`);
                
            if ((row - 1) < 0) {
                if (terms.indexOf(coordsToGray(rowNum - 1, rowDim, col, colDim)) == -1 || containsCol(terms, col, rowDim, colDim)) 
                    $(cellId).css('border-top', `2px solid ${color}`);
            }
            else if (terms.indexOf(coordsToGray(row - 1, rowDim, col, colDim)) == -1)
                $(cellId).css('border-top', `2px solid ${color}`);
                
            if ((col + 1) >= colNum) {
                if (terms.indexOf(coordsToGray(row, rowDim, 0, colDim)) == -1 || containsRow(terms, row, rowDim, colDim)) 
                    $(cellId).css('border-right', `2px solid ${color}`);
            }
            else if (terms.indexOf(coordsToGray(row, rowDim, col + 1, colDim)) == -1)
                $(cellId).css('border-right', `2px solid ${color}`);
                
            if ((col - 1) < 0) {
                if (terms.indexOf(coordsToGray(row, rowDim, colNum - 1, colDim)) == -1 || containsRow(terms, row, rowDim, colDim)) 
                    $(cellId).css('border-left', `2px solid ${color}`);
            }
            else if (terms.indexOf(coordsToGray(row, rowDim, col - 1, colDim)) == -1)
                $(cellId).css('border-left', `2px solid ${color}`);
        });
    });
}

function containsRow(terms, row, rowDim, colDim) {
    for (let i = 0; i < Math.pow(2, rowDim); i++) {
        if (terms.indexOf(coordsToGray(row, rowDim, i, colDim)) == -1)
            return false;
    }
    return true;
}

function containsCol(terms, col, rowDim, colDim) {
    for (let i = 0; i < Math.pow(2, colDim); i++) {
        if (terms.indexOf(coordsToGray(i, rowDim, col, colDim)) == -1)
            return false;
    }
    return true;
}

function cellChange(row, rowDim, col, colDim) {
    let gray = coordsToGray(row, rowDim, col, colDim);
    let cellId = `cell-${gray}`;
    let currentValue = getLabelText(`#${cellId} label`);
    let success = false;;

    if (currentValue == "0") {
        setLabelText(`#${cellId} label`, "1");
        success = addToMinterms(gray);
    }
    else if (currentValue == "1") {
        setLabelText(`#${cellId} label`, "-");
        success = removeFromMinterms(gray);
        success = success && addToDontCares(gray);
    }
    else if (currentValue == "-") {
        setLabelText(`#${cellId} label`, "0");
        success = removeFromDontCares(gray);
    }

    if(!success)
        throw("Somehow you broke the kmap. Congratulations?");
}

function setCell(number, value) {
    let cellId = `#cell-${number}`;
    let labelId = `${cellId} label`;
    let currentValue = getLabelText(labelId);

    if (currentValue == value)
        return;
    else if (currentValue == "0") {
        switch(value) {
            case "1":
                setLabelText(labelId, value);
                addToMinterms(number);
                break;
            case "-":
                setLabelText(labelId, value);
                addToDontCares(number);
                break;
        }
    }
    else if (currentValue == "1") {
        switch(value) {
            case "0":
                setLabelText(labelId, value);
                removeFromMinterms(number);
                break;
            case "-":
                setLabelText(labelId, value);
                removeFromMinterms(number);
                addToDontCares(number);
                break;
        }
    }
    else if (currentValue == "-") {
        switch(value) {
            case "0":
                setLabelText(labelId, value);
                removeFromDontCares(number);
                break;
            case "1":
                setLabelText(labelId, value);
                removeFromDontCares(number);
                addToMinterms(number);
                break;
        }
    }
}

function addToMinterms(val) {
    let minterms = getMinterms();
    if (minterms.indexOf(val) === -1) {
        minterms.push(val);
        minterms.sort((a, b) => (a - b));
        setMinterms(minterms);
        return true;
    }
    return false;
}

function removeFromMinterms(val) {
    let minterms = getMinterms();
    if (minterms.indexOf(val) !== -1) {
        minterms = minterms.filter(v => (v != val));
        setMinterms(minterms);
        return true;
    }
    return false;
}

function addToDontCares(val) {
    let dontCares = getDontCares();
    if (dontCares.indexOf(val) == -1) {
        dontCares.push(val);
        dontCares.sort((a, b) => (a - b));
        setDontCares(dontCares);
        return true;
    }
    return false;
}

function removeFromDontCares(val) {
    let dontCares = getDontCares();
    if (dontCares.indexOf(val) !== -1) {
        dontCares = dontCares.filter(v => (v != val));
        setDontCares(dontCares);
        return true;
    }
    return false;
}

function getMinterms() {
    let temp = getInputStr("#minterms").split(",");
    temp = temp.map(v => $.trim(v));
    temp = removeEmptyStrings(temp);
    return temp.map(v => parseInt(v, 10));
}

function setMinterms(minterms) {
    $("#minterms").val(minterms.join(","));
    onInfoChange();
}

function getDontCares() {
    let temp = getInputStr("#dont-cares").split(",");
    temp = temp.map(v => $.trim(v));
    temp = removeEmptyStrings(temp);
    return temp.map(v => parseInt(v, 10));
}

function setDontCares(dontCares) {
    $('#dont-cares').val(dontCares.join(","));
    onInfoChange();
}

function termsInBounds(terms, termLimit) {
    let oobTerms = terms.filter((v) => (v < 0 || v > termLimit));
    return (oobTerms.length == 0);
}

function getInputStr(id) {
    return stripHtml($(id).val());
}

function setInputStr(id, str) {
    $(id).val(str);
}

function getLabelText(id) {
    return $.trim(stripHtml($(id).text()));
}

function setLabelText(id, text) {
    $(id).text(text);
}

function grayToIndex(gray) {
    let mask = gray >> 1;
    while (mask != 0) {
        gray = gray ^ mask;
        mask = mask >> 1;
    }
    return gray;
}

function coordsToGray(row, rowDim, col, colDim) {
    let gray = parseInt(intToBin(indexToGray(row), rowDim) + intToBin(indexToGray(col), colDim), 2);
    return gray;
}

function allTerms(dimension) {
    return [...Array(Math.pow(2, dimension)).keys()];
}

function grayToCoords(gray, dim) {
    let str = intToBin(gray, dim);
    let rowDim = Math.floor(dim / 2);
    return {
        row: grayToIndex(parseInt(str.slice(0, rowDim), 2)),
        col: grayToIndex(parseInt(str.slice(rowDim), 2)),
    };
}

function intToBin(num, dim) {
    let str = num.toString(2);
    return Array(dim - str.length + 1).join("0") + str;
}

function indexToGray(index) {
    return (index ^ (index >> 1));
}

function stripHtml(str) {
    return $("<div />").html(str).text();
}

function createPastel(i) {
    return `hsla(${i}, 70%, 80%, 1)`;
}
var debugrmNE = false;
petrick = function (minterms, dontcares, dim, variables, out) {
    var intTerms = minterms.concat(dontcares);
    var binTerms = new Array(intTerms.length);
    for (var i = 0; i < intTerms.length; i++) {
        binTerms[i] = leftPadString(intTerms[i].toString(2), dim, '0');
    }
    groupedTerms = groupTerms(binTerms, dim);
    reductions = new Array();
    reduc = groupedTerms;
    while (reduc.toString().length > dim) {
        reductions.push(reduc);
        reduc = reduceGroupedTerms(reduc, dim);
    }
    var essentials = findEssentialImplicants(minterms, dontcares, reductions);
    var genString = essentialstoGenString(essentials, variables, out);
    var VHDLString = essentialsToVHDLString(essentials, variables, out);
    var verilogString = essentialsToVerilogString(essentials, variables, out);
    return [genString, VHDLString, verilogString];
}

groupTerms = function (terms, dim) {
    var nGroups = dim + 1;
    var groups = new Array(nGroups);
    for (var i = 0; i < groups.length; i++) {
        groups[i] = new Array();
    }
    for (var i = 0; i < terms.length; i++) {
        groups[(terms[i].match(/1/g) || []).length].push(terms[i]);
    }
    return groups;
}

reduceGroupedTerms = function (gT, dim) {
    var mistakeCount = 0;
    var reducedGroup = new Array(dim + 1);
    for (var i = 0; i < reducedGroup.length; i++) {
        reducedGroup[i] = new Array();
    }
    for (var i = 0; i < gT.length - 1; i++) {
        for (var j = 0; j < gT[i].length; j++) {
            for (var k = 0; k < gT[i + 1].length; k++) {
                var aStr = gT[i][j].replace(/-/g, '0');
                var bStr = gT[i + 1][k].replace(/-/g, '0');
                var a = parseInt(aStr, 2);
                var b = parseInt(bStr, 2);
                var abStr = leftPadString((b - a).toString(2), dim, '0');
                if (differenceCount(gT[i][j],gT[i+1][k]) == 1) {
                    var newStr = gT[i][j].substr(0, abStr.indexOf('1')) + '-' + aStr.substr(abStr.indexOf('1') + 1);
                    if ((newStr.match(/-/g) || []).length > (gT[i][j].match(/-/g) || []).length)
                        reducedGroup[i].push(newStr);
                }
            }
        }
    }
    return reducedGroup;
}

differenceCount = function(a, b) {
    var l = 0;
    var count = 0;
    if (a.length > b.length) {
        l = b.length;
        count += a.length - l;
    }
    else {
        l = a.length;
        count += b.length - l;
    }
    for (var i = 0; i < l; i++) {
        if(a[i] != b[i])
            count++;
    }
    return count;
}

findEssentialImplicants = function(iT, dc, rGT) {
    var intTerms = iT;
    var essentials = new Array();
    for (var i = rGT.length - 1; i >= 0; i--) {
        for (var j = rGT[i].length - 1; j >= 0; j--) {
            for (var k = 0; k < rGT[i][j].length; k++) {
                var term = rGT[i][j][k];
                var values = termCoverage(term);
                if(intersect(values, intTerms).length > 0) {
                    essentials.push(term);
                    intTerms = intTerms.filter(function(n) {
                        return intersect(values, iT).indexOf(n) == -1;
                    });
                }
            }
        }
    }
    essentials = removeNonEssentials(essentials, dc);
    return essentials;
}

termCoverage = function(term) {
    if((term.match(/-/g)||[]).length == 0) {
        return [parseInt(term,2)];
    }
    else {
        var inserts = new Array(2 ** (term.match(/-/g)||[]).length);
        var values = new Array(2 ** (term.match(/-/g)||[]).length);
        for (var i = 0; i < inserts.length; i++) {
            inserts[i] = leftPadString(i.toString(2), (term.match(/-/g)||[]).length, '0');
            var hold = term;
            for (var j = 0; j < inserts[i].length; j++) {
                hold = hold.substr(0, hold.indexOf('-')) + inserts[i][j] + hold.substr(hold.indexOf('-')+1);
            }
            values[i] = parseInt(hold,2);
        }
        return values;
    }
}

removeNonEssentials = function(essentials, dontcares) {
    if(debugrmNE) console.log('essentials:', essentials);
    var totalCoverage = [];
    var reducedEssentials = [];
    for (var i = 0; i < essentials.length; i++) {
        totalCoverage = totalCoverage.concat(termCoverage(essentials[i]));
    }
    for (var i = 0; i < dontcares.length; i++) {
        totalCoverage = totalCoverage.filter(function(n) {return n != dontcares[i];});
    }
    for (var i = essentials.length-1; i >= 0; i--) {
        var currCov = termCoverage(essentials[i]);
        if(debugrmNE) console.log('total coverage:', totalCoverage);
        if(debugrmNE) console.log('term coverage: ', currCov);
        var added = false;
        for (var j = 0; j < currCov.length; j++) {
            var count = totalCoverage.filter(function(n){return n==currCov[j];}).length;
            if(count == 1 || added == true) {
                if (!added) {
                    reducedEssentials.push(essentials[i]);
                    added = true;
                }
                totalCoverage = totalCoverage.filter(function(n) {return n != currCov[j];});
            }
            else {
                var indx = totalCoverage.indexOf(currCov[j]);
                if (indx != -1)
                    totalCoverage = totalCoverage.slice(0, indx).concat(totalCoverage.slice(indx+1, totalCoverage.length));
            }
            if(debugrmNE) console.log('reduced essentials: ', reducedEssentials);
            if(debugrmNE) console.log('total coverage:', totalCoverage);
        }
    }
    if(debugrmNE) console.log('reduced essentials:', reducedEssentials);
    return reducedEssentials;
}

essentialstoGenString = function(essentials, variables, output) {
    if (essentials.length == 0)
        return output + ' = 0';
    else if (essentials.length == 1 && (essentials[0].match(/-/g)||[]).length == essentials[0].length)
        return output + ' = 1';
    var string = output + ' = ';
    for (var i = 0; i < essentials.length; i++) {
        var subtract = 0;
        for (var j = 0; j < essentials[i].length; j++) {
            if (essentials[i][j] == '0') {
                string += variables[j] + "'";
                subtract = 0;
            }
            else if (essentials[i][j] == '1') {
                string += variables[j];
                subtract = 0;
            }
        }
        string = string.substr(0, string.length - subtract) + ' + ';
    }
    string = string.substr(0, string.length - 3);
    return string;
}

essentialsToVHDLString = function(essentials, variables, output) {
    if (essentials.length == 0)
        return output + ' <= 0;';
    else if (essentials.length == 1 && (essentials[0].match(/-/g)||[]).length == essentials[0].length)
        return output + ' <= 1;';
    var string = output + ' <= (';
    for (var i = 0; i < essentials.length; i++) {
        var subtract = 0;
        for (var j = 0; j < essentials[i].length; j++) {
            if (essentials[i][j] == '0') {
                string += 'not ' + variables[j] + ' and ';
                subtract = 5;
            }
            else if (essentials[i][j] == '1') {
                string += variables[j] + ' and ';
                subtract = 5;
            }
        }
        string = string.substr(0, string.length - subtract) + ') or (';
    }
    string = string.substr(0, string.length - 5) + ';';
    return string;
}

essentialsToVerilogString = function(essentials, variables, output) {
    if (essentials.length == 0)
        return "assign " + output + ' = 0;';
    else if (essentials.length == 1 && (essentials[0].match(/-/g)||[]).length == essentials[0].length)
        return "assign " + output + ' = 1;';
    var string = 'assign ' + output + ' = (';
    for (var i = 0; i < essentials.length; i++) {
        var subtract = 0;
        for (var j = 0; j < essentials[i].length; j++) {
            if (essentials[i][j] == '0') {
                string += '~' + variables[j] + ' & ';
                subtract = 3;
            }
            else if (essentials[i][j] == '1') {
                string += variables[j] + ' & ';
                subtract = 3;
            }
        }
        string = string.substr(0, string.length - subtract) + ') | (';
    }
    string = string.substr(0, string.length - 4) + ';';
    return string;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

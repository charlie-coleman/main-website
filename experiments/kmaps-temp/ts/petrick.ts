class Petrick {
    private minTerms: number[];
    private dontCares: number[];
    private allTerms: number[];
    private essentials: TableEntry[];
    private dimension: number;
    private variableNames: string[];
    private returnName: string;

    constructor(minTerms: number[], dontCares: number[], dimension: number, variableNames: string[], returnName: string) {
        this.minTerms = minTerms;
        this.dontCares = dontCares;
        this.dimension = variableNames.length;
        this.variableNames = variableNames;
        this.returnName = returnName;
    }

    public getMinTerms(): number[] { return this.minTerms; }
    public getDontCares(): number[] { return this.dontCares; }
    public getDimension(): number { return this.dimension; }
    public getVariableNames(): string[] { return this.variableNames }
    public getReturnName(): string { return this.returnName; }

    public setMinTerms(minTerms: number[]): void { this.minTerms = minTerms; }
    public setDontCares(dontCares: number[]): void { this.dontCares = dontCares; }
    public setDimension(dimension: number): void { this.dimension = dimension; }
    public setVariableNames(variableNames: string[]): void { this.variableNames = variableNames; }
    public setReturnName(returnName: string): void { this.returnName = returnName; }

    public calculateEssentials(): void {
        this.allTerms = this.minTerms.concat(this.dontCares);
        this.essentials = new Array<TableEntry>();

        let groups: TableEntry[][] = this.groupTerms();
        let reducedGroups: TableEntry[][][] = this.reduceGroupedTerms(groups).slice(0, -1); // the last index of the reduced terms is an empty array
        let primeImplicants: TableEntry[] = this.getPrimeImplicants(reducedGroups);
        let columns: TableEntry[][][] = this.getColumns(primeImplicants);
        let reducedColumns: TableEntry[][][] = this.reduceColumns(columns);
        this.essentials = this.essentials.concat(this.getEssentialImplicants(reducedColumns));
    }

    public getGeneric(): string {
        let output: string = this.returnName + "(" + this.variableNames.join(", ") + ") = ";

        if (this.essentials.length == 0)
            return output + "0";
        if (this.essentials.length == 1 && (this.essentials[0].getBinaryRep() == "-".repeat(this.dimension)))
            return output + "1";

        for (let e of this.essentials) {
            let entryString: string = e.getBinaryRep();
            for (let i = 0; i < entryString.length; i++) {
                let c: string = entryString[i];
                if (c == "0")
                    output += this.variableNames[i] + '\'';
                else if (c == "1")
                    output += this.variableNames[i];
            }
            output += " + ";
        }

        return output.slice(0, -3);
    }
 
    public getVhdl(): string {
        let output: string = this.returnName + " <= ";

        if (this.essentials.length == 0)
            return output + "0;";
        else if (this.essentials.length == 1 && (this.essentials[0].getBinaryRep() == "-".repeat(this.dimension)))
            return output + "1;"

        output += "("
        for (let e of this.essentials) {
            let entryString: string = e.getBinaryRep();
            for (let i = 0; i < entryString.length; i++) {
                let c: string = entryString[i];
                let varName = this.variableNames[i];

                if (c == "0")
                    output += "not " + varName + " and ";
                else if (c == "1")
                    output += varName + " and ";
            }
            output = output.slice(0, -5) + ") or ("
        }
        output = output.slice(0, -5) + ";"
        return output;
    }

    public getVerilog(): string {
        let output: string = "assign " + this.returnName + " = ";

        if (this.essentials.length == 0)
            return output + "0;";
        else if (this.essentials.length == 1 && (this.essentials[0].getBinaryRep() == "-".repeat(this.dimension)))
            return output + "1;"

        output += "(";
        for (let e of this.essentials) {
            let entryString: string = e.getBinaryRep();
            for (let i = 0; i < entryString.length; i++) {
                let c: string = entryString[i];
                let varName: string = this.variableNames[i];

                if (c == "0")
                    output += "~" + varName + " & ";
                else if (c == "1")
                    output += varName + " & ";
            }
            output = output.slice(0, -3) + ") | (";
        }
        output = output.slice(0, -4) + ";";
        return output;
    }

    private groupTerms(): TableEntry[][] {
        let groups: TableEntry[][] = this.createGroupsArray();

        for (let i = 0; i < this.allTerms.length; i++) {
            let term: number = this.allTerms[i];
            let num1s: number = this.numberOf1s(term);

            // organize the groups by number of 1s in their binary representation
            groups[num1s].push(new TableEntry([term], this.dimension));
        }

        return groups;
    }

    private reduceGroupedTerms(groupedTerms: TableEntry[][]): TableEntry[][][] {
        let groups: TableEntry[][] = this.createGroupsArray();
        let mergedEntries: TableEntry[][] = this.createGroupsArray();
        let cont: boolean = false;

        // completely loop through the 2d array, checking perms of 2 entries
        for (let i = 0; i < groupedTerms.length - 1; i++) {
            for (let j = i + 1; j < groupedTerms.length; j++) {
                for (let k = 0; k < groupedTerms[i].length; k++) {
                    for (let l = 0; l < groupedTerms[j].length; l++) {
                        let merged: boolean = false;
                        let t1: TableEntry = groupedTerms[i][k];
                        let t2: TableEntry = groupedTerms[j][l];

                        // don't check it against itself
                        merged = this.checkTableEntries(t1, t2, groups);

                        // keep a list of terms that have been reduced/merged. we don't remove now because they make be able to make more reductions
                        if (merged) {
                            mergedEntries[i].push(t1);
                            mergedEntries[j].push(t2);
                        }
                        cont = cont || merged;
                    }
                }
            }
        }

        for (let i = 0; i < groups.length; i++) {
            // remove repeated combinations of minterms (same binary representation)
            groups[i] = groups[i].filter(function (filtVal: TableEntry, filtIndex: number) {
                let otherIndex: number = groups[i].findIndex(function (findVal: TableEntry, findIndex: number) {
                    let repeatValue: boolean = findVal.getBinaryRep() == filtVal.getBinaryRep();
                    return repeatValue;
                });
                return filtIndex == otherIndex;
            });

            // filter out all of the merged/reduced terms, as they are covered by a larger size implicant now
            groupedTerms[i] = groupedTerms[i].filter(function(val, index) {
                return (mergedEntries[i].indexOf(val) == -1);
            });
        }

        // we save the smaller sized implicants because they aren't covered by a larger implicant
        if (cont)
            return [groupedTerms].concat(this.reduceGroupedTerms(groups));
        else
            return [groupedTerms].concat([groups]);
    }

    // flattens out the reduced groups into a 1d array of prime implicants
    private getPrimeImplicants(reducedGroups: TableEntry[][][]): TableEntry[] {
        let primeImplicants: TableEntry[] = new Array<TableEntry>();
        for (let i = 0; i < reducedGroups.length; i++) {
            for (let j = 0; j < reducedGroups[i].length; j++) {
                primeImplicants = primeImplicants.concat(reducedGroups[i][j]);
            }
        }
        return primeImplicants;
    }

    private getColumns(primeImplicants: TableEntry[]): TableEntry[][][] {
        let columns: Map<number, TableEntry[][]> = new Map<number, TableEntry[][]>();
        for (let i = 0; i < this.minTerms.length; i++) {
            columns.set(this.minTerms[i], new Array());
        }

        this.minTerms.forEach(function(minTerm: number, index: number) {
            columns.set(minTerm, primeImplicants.filter(function(implicant, index) {
                return (implicant.getTerms().indexOf(minTerm) != -1);
            }).map((implicant) => ([implicant])));
        });

        for (let [key, value] of columns) {
            if (value.length === 1) {
                this.minTerms = this.minTerms.filter((v) => (v != key));
                this.essentials.push(value[0][0]);
                for (let k of value[0][0].getTerms())
                    columns.delete(k);
            }
        }

        let columnArr: TableEntry[][][] = new Array();

        let ess = this.essentials;
        columns.forEach(function(value, key) {
            columnArr.push(value.filter(v => (ess.indexOf(v[0]) < 0)));
        });

        return columnArr;
    }

    private reduceColumns(columns: TableEntry[][][]): TableEntry[][][] {
        if (columns.length <= 1)
            return columns;

        let column1: TableEntry[][] = columns[0];
        let column2: TableEntry[][] = columns[1];

        let newColumn: TableEntry[][] = new Array();
        for (let i = 0; i < column1.length; i++) {
            for (let j = 0; j < column2.length; j++) {
                let temp: TableEntry[] = column1[i].concat(column2[j]);
                temp = temp.filter(function(value, index) {
                    return (temp.indexOf(value) === index);
                });
                newColumn.push(temp);
            }
        }
        newColumn = this.simplifyColumn(newColumn);

        let newColumns: TableEntry[][][] = [newColumn].concat(columns.slice(2));
        if (newColumns.length > 1)
            return this.reduceColumns(newColumns);
        else
            return newColumns;
    }

    private getEssentialImplicants(reducedColumns: TableEntry[][][]): TableEntry[] {
        let options: TableEntry[][] = reducedColumns[0];
        if (options != undefined && options.length > 0) {
            options = options.sort((a, b) => (a.length - b.length));
            return options[0];
        }
        else
            return [];
    }

    private simplifyColumn(column: TableEntry[][]): TableEntry[][] {
        let returnColumn: TableEntry[][];

        returnColumn = column.filter(function(value, index) {
            return (column.indexOf(value) == index);
        });

        for (let i = 0; i < returnColumn.length - 1; i++) {
            for (let j = i + 1; j < returnColumn.length; j++) {
                if (this.matchesIdentity(returnColumn[i], returnColumn[j])) {
                    returnColumn = returnColumn.slice(0, j).concat(returnColumn.slice(j + 1));
                }
                else if (this.matchesIdentity(returnColumn[j], returnColumn[i])) {
                    returnColumn = returnColumn.slice(0, i).concat(returnColumn.slice(i + 1));
                }
            } 
        }

        return returnColumn;
    }

    // check if the 2 table arrays fit  X + XY = X
    private matchesIdentity(x: TableEntry[], xy: TableEntry[]): boolean {
        for (let t of x) {
            if (xy.indexOf(t) < 0)
                return false;
        }
        return true;
    }

    private numberOf1s(val: number): number {
        let ret: number = 0;
        while (val) {
            ret += (val & 1);
            val = val >> 1;
        }

        return ret;
    }

    private onesInString(s: string): number {
        return (s.match(/1/g) || []).length;
    }

    private createGroupsArray(): TableEntry[][] {
        let nGroups: number = this.dimension + 1;
        let groups: TableEntry[][] = new Array(nGroups);
        for (let i = 0; i < groups.length; i++)
            groups[i] = new Array<TableEntry>();
        return groups;
    }

    private checkTableEntries(t1: TableEntry, t2: TableEntry, groups: TableEntry[][]): boolean {
        if (t1.isAdjacent(t2)) {
            let t3: TableEntry = t1.mergeEntry(t2);
            let num1s: number = this.onesInString(t3.getBinaryRep());

            groups[num1s].push(t3);
            return true;
        }
        return false;
    }
}

class TableEntry {
    private terms: number[];
    private dim: number;
    private binRep: string;

    constructor (terms: number[], dimension: number, binaryRepresentation: string = undefined) {
        this.terms = terms;
        this.dim = dimension;
        if (binaryRepresentation != undefined)
            this.binRep = binaryRepresentation;
        else if (terms.length === 0)
            this.binRep = "";
        else {
            let t1: TableEntry = this.generateBinaryRep(this);
            this.binRep = t1.getBinaryRep();
        }
    }

    public setTerms(terms: number[]): void {
        this.terms = terms;
    }

    public addTerms(terms: number[]): void {
        this.setTerms(this.terms.concat(terms));
        this.removeRepeatedTerms();
        this.setTerms(this.sortByGrayCode(this.getTerms()));
    }
    
    public getTerms(): number[] {
        return this.terms;
    }

    public setBinaryRep(binaryRepresentation: string): void {
        this.binRep = binaryRepresentation;
    }

    public getBinaryRep(): string {
        return this.binRep;
    }

    public setDimension(dim: number): void {
        this.dim = dim;
    }

    public getDimension(): number {
        return this.dim;
    }

    private generateBinaryRep(t: TableEntry): TableEntry {
        let pow: number = Math.log(this.terms.length) / Math.log(2);

        // a table entry must a number of terms that is a power of two
        if (!(pow === parseInt(pow.toString(10), 10))) {
            this.setBinaryRep(undefined);
            return undefined;
        }

        let terms: number[] = t.getTerms();
        terms = this.sortByGrayCode(terms);
        let dimension: number = t.getDimension();
        let currBinRep: string = t.getBinaryRep();
        if (terms.length === 1)
            return new TableEntry([terms[0]], dimension, this.numberToBinary(terms[0]));
        else if (t.getTerms().length == 2) {
            let t1: TableEntry = new TableEntry([terms[0]], dimension, this.numberToBinary(terms[0]));
            let t2: TableEntry = new TableEntry([terms[1]], dimension, this.numberToBinary(terms[1]));

            let t3: TableEntry = t1.mergeEntry(t2);
            return t3;
        }
        else {
            let halfwayPoint: number = Math.floor(terms.length / 2);
            let firstHalf: TableEntry = new TableEntry(terms.slice(0, halfwayPoint), dimension, currBinRep);
            let secondHalf: TableEntry = new TableEntry(terms.slice(halfwayPoint), dimension, currBinRep);

            // recurse through the list of terms, cutting in half each time. when you reach 2, merge and pass up
            let t1: TableEntry = this.generateBinaryRep(firstHalf);
            let t2: TableEntry = this.generateBinaryRep(secondHalf);

            let t3: TableEntry = t1.mergeEntry(t2);
            return t3;
        }
    }

    private numberToBinary(num: number): string {
        if (num >= Math.pow(2, this.dim) || num < 0) // if it isn't within the limits of our kmap, return undef
            return undefined;
        let s: string = num.toString(2);
        s = Array(this.dim - s.length + 1).join("0") + s; // add 0s to the left until it's 'dim' digits long
        return s;
    }

    public mergeEntry(t2: TableEntry): TableEntry {
        let mismatches: number[] = this.findMismatches(t2.getBinaryRep());
        let newEntry: TableEntry = new TableEntry(this.getTerms(), this.getDimension(), this.getBinaryRep());

        if (mismatches.length === 0) {
            newEntry.setTerms(this.terms.concat(t2.terms));
            newEntry.removeRepeatedTerms();
            return newEntry;
        }
        else if (mismatches.length === 1) {
            let newBinRep = newEntry.getBinaryRep();
            newBinRep = this.replaceAt(newBinRep, mismatches[0], "-");

            newEntry.setBinaryRep(newBinRep);
            newEntry.addTerms(t2.getTerms());

            return newEntry;
        }
        else {
            return undefined; // if we have too many differences, they cannot be merged
        }
    }

    public isAdjacent(t2: TableEntry): boolean {
        return (this.findMismatches(t2.getBinaryRep()).length <= 1)
    }

    public findMismatches(rep: string): number[] {
        let mismatches: number[] = new Array<number>();
        for (let i = 0; i < this.binRep.length; i++) {
            if (this.binRep[i] != rep[i]) {
                mismatches.push(i);
            }
        }
        return mismatches;
    }

    public removeRepeatedTerms(): void {
        let newTerms: number[] = this.terms.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });
        this.setTerms(newTerms);
    }

    private replaceAt(value: string, index: number, replacement: string) {
        return value.substr(0, index) + replacement + value.substr(index + replacement.length);
    }

    private sortByGrayCode(terms: number[]): number[] {
        return terms.sort((a: number, b: number) => (this.grayCodeLocation(a) - this.grayCodeLocation(b)));
    }

    private grayCodeLocation(num: number): number {
        let mask: number = num >> 1;
        while (mask != 0) {
            num = num ^ mask;
            mask = mask >> 1;
        }
        return num;
    }
}
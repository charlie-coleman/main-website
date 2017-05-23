function AddVector(vector1, vector2) {
    var error_message = "Arrays of different dimensions cannot be added";
    var width = vector1.length;
    var output = new Array(width);
    if (vector1[0].constructor == Array) {
        for(var i = 0; i < width; i++) {
            output[i] = new Array(vector1[0].length);
        }
    }
    if (vector1.length != vector2.length)
        throw error_message;
    if (vector1[0].constructor == Array ? (vector2[0].constructor != Array) : (vector2[0].constructor == Array))
        throw error_message;
    if ((vector1[0].constructor == Array && vector2[0].constructor == Array) && (vector1.length != vector2.length))
        throw error_message;
    for(var i = 0; i < vector1.length; i++) {
        if(vector1[0].constructor == Array) {
            for(var j = 0; j < vector1[0].length; j++) {
                output[i][j] = vector1[i][j]+vector2[i][j];
            }
        }
        else {
            output[i] = vector1[i] + vector2[i];
        }
    }
    return output;
}

function SubtractVector(vector1, vector2) {
    var error_message = "Arrays of different dimensions cannot be added";
    var width = vector1.length;
    var output = new Array(width);
    if (vector1[0].constructor == Array) {
        for(var i = 0; i < width; i++) {
            output[i] = new Array(vector1[0].length);
        }
    }
    if (vector1.length != vector2.length)
        throw error_message;
    if (vector1[0].constructor == Array ? (vector2[0].constructor != Array) : (vector2[0].constructor == Array))
        throw error_message;
    if ((vector1[0].constructor == Array && vector2[0].constructor == Array) && (vector1.length != vector2.length))
        throw error_message;
    for(var i = 0; i < vector1.length; i++) {
        if(vector1[0].constructor == Array) {
            for(var j = 0; j < vector1[0].length; j++) {
                output[i][j] = vector1[i][j] - vector2[i][j];
            }
        }
        else {
            output[i] = vector1[i] - vector2[i];
        }
    }
    return output;
}

function MultiplyVector(multiplier, vector) {
    var width = vector.length;
    var output = new Array(width);
    if (vector[0].constructor == Array) {
        for(var i = 0; i < width; i++) {
            output[i] = new Array(vector[0].length);
        }
    }
    for(var i = 0; i < vector.length; i++) {
        if (vector[0].constructor == Array) {
            for(var j = 0; j < vector[0].length; j++) {
                output[i][j] = multiplier * vector[i][j];
            }
        }
        else {
            output[i] = multiplier * vector[i];
        }
    }
    return output;
}

function DivideVector(divider, vector) {
    var width = vector.length;
    var output = new Array(width);
    if (vector[0].constructor == Array) {
        for(var i = 0; i < width; i++) {
            output[i] = new Array(vector[0].length);
        }
    }
    for(var i = 0; i < vector.length; i++) {
        if (vector[0].constructor == Array) {
            for(var j = 0; j < vector[0].length; j++) {
                output[i][j] = vector[i][j] / divider;
            }
        }
        else {
            output[i] = vector[i] / divider;
        }
    }
    return output;
}

function VectorLength(vector) {
    if(vector[0].constructor == Array) 
        throw "Vector must be one dimensional."
    var output = 0;
    for(var i = 0; i < vector.length; i++) {
        output += Math.pow(vector[i], 2);
    }
    output = Math.sqrt(output);
    return output;
}

function DotProduct(vector1, vector2) {
    if(vector1.length != vector2.length)
        throw "Vectors must be of equal length"
    var output = 0;
    for (var i = 0; i < vector1.length; i++) {
        output += vector1[i]*vector2[i];
    }
    return output;
}

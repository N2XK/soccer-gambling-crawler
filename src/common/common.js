let fs = require('fs');

module.exports.mkdir = function(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

module.exports.transposeMatrix = function(matrixData) {
    var i, j,
        rowLen = matrixData.length,
        colLen = matrixData[0].length,
        result = new Array(colLen);

    for (i = 0; i < colLen; i++) {
        result[i] = new Array(rowLen);
        for (j = 0; j < rowLen; j++) {
            result[i][j] = matrixData[j][i];
        }
    }

    return result;
}

module.exports.wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
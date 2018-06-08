let XLSX = require('xlsx');
let common = require('../common/common.js');

module.exports.write = async function(date, data2DArray) {
    try {
        let basepath = [];
        let path;
        basepath.push("excels");
        path = basepath.join("/");
        common.mkdir(path);

        var excelData2 = common.transposeMatrix(data2DArray);

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(excelData2, { cellDates: true });
        await XLSX.utils.book_append_sheet(wb, ws, date);

        let filename = date + ".xlsx";
        let filePath = path + "/" + filename;

        await XLSX.writeFile(wb, filePath, { bookSST: true });

    } catch (e) {
        reject(e);
        console.log(e);
    }
}
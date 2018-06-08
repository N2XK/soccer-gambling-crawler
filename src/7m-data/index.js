let spider = require("./spider.js");
let excelWriter = require("./excelWriter.js");


// let dateArray = ["2018-06-01", "2018-06-02", "2018-06-03", "2018-06-04", "2018-06-05", "2018-06-06", "2018-06-07"];
let dateArray = ["2018-06-06", "2018-06-07"];


let urlMap = new Map();
for (let date of dateArray) {
    urlMap.set(date, "http://data.7m.com.cn/result_data/" + date + "/index_gb.js");
}









async function start() {
    for (var [date, dataURL] of urlMap) {
        console.log("Spider the data of :", date, "begining...");
        var start = new Date().getTime(); //起始时间

        let result_2DArray = await spider.spiderURL(date, dataURL);
        var end = new Date().getTime(); //结束时间
        console.log((end - start) + "ms");
        console.log("Spider the data of :", date, "end.");

        console.log("Write excel of :", date, "begining...");
        await excelWriter.write(date, result_2DArray);
        console.log("Write excel of :", date, "end.");

    }
}

start();
let superagent = require("superagent");
let async = require("async");
let common = require('../common/common.js');


let handicapURLevel1Base = "http://data.7m.com.cn/goaldata/js/";
//like http://data.7m.com.cn/goaldata/js/2941505.js?nocache=1528261498140

let handicapUrlLevel2Base1 = "http://data.7m.com.cn/odds_analyse/m_jsdata/";
let handicapUrlLevel2Base2 = "http://crowns2.7m.com.cn/log/";

let RQ_ARR = ["平手", "平/半", "半球", "半/一",
    "一球", "一球/球半", "球半", "球半/二球",
    "二球", "二球/二半", "二半", "二半/三球",
    "三球", "三球/三半", "三半", "三半/四球",
    "四球", "四球/四半", "四半", "四半/五球",
    "五球", "五球/五半", "五半", "五半/六球",
    "六球", "六球/六半", "六半", "六半/七球",
    "七球", "七球/七半", "七半", "七半/八球",
    "八球", "八球/八半", "八半", "八半/九球",
    "九球", "九球/九半", "九半", "九半/十球",
    "十球", "十球/十球半", "十球半", "十球半/十一球",
    "十一球", "十一球/十一球半", "十一球半", "十一球半/十二球",
    "十二球", "十二球/十二球半", "十二球半", "十二球半/十三球",
    "十三球", "十三球/十三球半", "十三球半", "十三球半/十四球",
    "十四球", "十四球/十四球半", "十四球半", "十四球半/十五球",
    "十五球", "十五球/十五球半", "十五球半", "十五球半/十六球",
    "十六球", "十六球/十六球半", "十六球半", "十六球半/十七球",
    "十七球", "十七球/十七球半", "十七球半", "十七球半/十八球",
    "十八球", "十八球/十八球半", "十八球半", "十八球半/十九球",
    "十九球", "十九球/十九球半", "十九球半", "十九球半/二十球", "二十球"
];

let WORL_ARR = ["赢", "赢1/2", "走", "输", "输1/2"];

let headers = {
    "Accept": "*/*",
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
};

module.exports.spiderURL = async function(date, tDataUrl) {
    let result_2DArray = [];
    try {
        const dres = await superagent.get(tDataUrl).set(headers).buffer(true);
        eval(dres.text);
        let pk_txt_Arr = translatePK(pk_Arr);
        let panlu_txt_Arr = translatePanlu(panlu_Arr);
        let quanc_Arr = translateLive_A_B(live_a_Arr, live_b_Arr);

        // console.log(pk_txt_Arr);
        // console.log(panlu_txt_Arr);
        // console.log(quanc_Arr);
        // console.log(pk_Arr.length);

        let handicapDataArray = await spideHandicapData(live_bh_Arr, pk_Arr, Team_A_Arr);

        let team_A_Level0_Arr = handicapDataArray[0];
        let team_B_Level0_Arr = handicapDataArray[1];
        let handicap0_Arr = handicapDataArray[2];
        let handicap1_Arr = handicapDataArray[3];
        let team_A_Level1_Arr = handicapDataArray[4];
        let team_B_Level1_Arr = handicapDataArray[5];

        // console.log("team_A_Level0_Arr", team_A_Level0_Arr)
        // console.log("team_A_Level0_Arr", team_A_Level0_Arr.length)
        // console.log("Team_A_Arr", Team_A_Arr.length)

        /**
         * Start_time_Arr
         * Match_name_Arr
         * banc_Arr
         * quanc_Arr = translateLive_A_B(live_a_Arr, live_b_Arr)
         * Team_A_Arr
         * Rank_a_Arr
         * Team_B_Arr
         * Rank_b_Arr
         * pk_txt_Arr = translatePK(pk_Arr)
         * team_A_Level0_Arr
         * team_B_Level0_Arr
         * handicap0_Arr
         * handicap1_Arr
         * team_A_Level1_Arr
         * team_B_Level1
         * panlu_txt_Arr = translatePanlu(panlu_Arr)
         * */
        result_2DArray.push(Start_time_Arr, Match_name_Arr, banc_Arr, quanc_Arr,
            Team_A_Arr, Rank_a_Arr, Team_B_Arr, Rank_b_Arr, pk_txt_Arr,
            team_A_Level0_Arr, team_B_Level0_Arr, handicap0_Arr, handicap1_Arr, team_A_Level1_Arr, team_B_Level1_Arr, panlu_txt_Arr);
    } catch (err) {
        if (err.status == 404) {
            console.warn("URL not existed:", tDataUrl);
        } else {
            console.error("Error :", err);
        }
    }
    return result_2DArray;
}

function translatePK(pk_Arr) {
    let pk_txt_Arr = [];
    for (let pk of pk_Arr) {
        let pk_text = (pk != "" && !isNaN(Number(pk))) ? RQ_ARR[Math.abs(Number(pk)) * 4] : pk;
        pk_txt_Arr.push(pk_text);
    }
    return pk_txt_Arr;
}

function translatePanlu(panlu_Arr) {
    let panlu_txt_Arr = [];
    for (let panlu of panlu_Arr) {
        let panlu_text = panlu != "" && !isNaN(Number(panlu)) ? WORL_ARR[Number(panlu)] : panlu
        panlu_txt_Arr.push(panlu_text);
    }
    return panlu_txt_Arr;
}

function translateLive_A_B(live_a_Arr, live_b_Arr) {
    let quanc_Arr = [];
    if (live_a_Arr.length != live_b_Arr.length) {
        return quanc_Arr;
    }

    for (let i = 0, len = live_a_Arr.length; i < len; i++) {
        let quanc_result = live_a_Arr[i] + "-" + live_b_Arr[i];
        quanc_Arr.push(quanc_result);
    }
    return quanc_Arr;
}


async function spideHandicapData(live_bh_Arr, pk_Arr, Team_A_Arr) {

    let team_A_Level0_Arr = [];
    let team_B_Level0_Arr = [];
    let handicap0_Arr = [];
    let handicap1_Arr = [];
    let team_A_Level1_Arr = [];
    let team_B_Level1_Arr = [];

    let timeSpent = 0;
    for (let j = 0, len = live_bh_Arr.length; j < len; j++) {
        let live_bh = live_bh_Arr[j];
        let pk = pk_Arr[j];
        let team_A_Name = Team_A_Arr[j];

        let urlResArray = [];

        if (pk.length > 0) {
            let handicapUrlLevel1 = handicapURLevel1Base + live_bh + ".js?nocache=" + new Date().getTime();
            let handicapUrlLevel2 = await spideHandicapURLLevel1(handicapUrlLevel1);

            if (handicapUrlLevel2.length > 0) {
                var start = new Date().getTime(); //起始时间
                urlResArray = await spideHandicapURLLevel2(handicapUrlLevel2, team_A_Name);
                var end = new Date().getTime(); //结束时间
                timeSpent = end - start;
            }
        }

        if (pk.length == 0 || urlResArray.length == 0) {
            team_A_Level0_Arr.push('');
            team_B_Level0_Arr.push('');
            handicap0_Arr.push('');
            handicap1_Arr.push('');
            team_A_Level1_Arr.push('');
            team_B_Level1_Arr.push('');
        } else {
            team_A_Level0_Arr.push(urlResArray[0]);
            team_B_Level0_Arr.push(urlResArray[1]);
            handicap0_Arr.push(urlResArray[2]);
            handicap1_Arr.push(urlResArray[3]);
            team_A_Level1_Arr.push(urlResArray[4]);
            team_B_Level1_Arr.push(urlResArray[5]);
        }
        if (timeSpent < 100) {
            await common.wait(100 - timeSpent);
        }
    }

    return [team_A_Level0_Arr, team_B_Level0_Arr, handicap0_Arr, handicap1_Arr, team_A_Level1_Arr, team_B_Level1_Arr];
}

/**
 * @param handicapUrlLevel1   第一层爬取的url
 * @returns handicapUrlLevel2 第二层要爬取的url
 */
async function spideHandicapURLLevel1(handicapUrlLevel1) {
    let handicapUrlLevel2 = ''; //存放返回结果

    try {
        const res = await superagent.get(handicapUrlLevel1).set(headers).buffer(true);
        eval(res.text);

        //link bh cbh
        if (link == 1) {
            handicapUrlLevel2 = handicapUrlLevel2Base1 + bh + ".js";
        } else if (link == 2) {
            console.info("-------------we need get more info and improve the code -----------------");
        } else if (link == 3) {
            handicapUrlLevel2 = handicapUrlLevel2Base2 + cbh + ".js";
        }
    } catch (err) {
        if (err.status == 404) {
            console.warn("URL not existed:", handicapUrl);
        } else {
            console.error("Error :", err);
        }
    }

    return handicapUrlLevel2;
}

async function spideHandicapURLLevel2(handicapUrl, team_A_Name) {
    let result_data = []; //存放返回结果

    try {
        const result = await superagent.get(handicapUrl).set(headers).buffer(true);

        // console.info("URL:", handicapUrl);
        eval(result.text);
        let team_A_Level0; //主队A初盘水位
        let team_B_Level0; //客队B初盘水位
        let handicap0; //初盘盘口
        let handicap1; //临盘盘口
        let team_A_Level1; //主队A临盘水位
        let team_B_Level1; //客队B临盘水位

        let sx_str0 = "",
            sx_str1 = "";

        if (handicapUrl.indexOf(handicapUrlLevel2Base1) > -1) {
            let length = pk.length;
            handicap0 = pk[length - 1];
            handicap1 = pk[0];

            // console.log(sw1), console.log(sw2), console.log(pk);

            team_A_Level0 = sw1[length - 1]; //A队为SW1
            team_B_Level0 = sw2[length - 1]; //B队为SW2
            team_A_Level1 = sw1[0]; //A队为SW1
            team_B_Level1 = sw2[0]; //B队为SW2
        } else {
            let dataArray;
            if (oddsDatas['ah_all'].indexOf('^') > -1) {
                dataArray = oddsDatas['ah_all'].slice(0, oddsDatas['ah_all'].indexOf('^')).split('$');
                dataArray.pop();
            } else {
                dataArray = oddsDatas['ah_all'].split('$');
            }

            // console.log(oddsDatas['ah_all']) ,console.log("dataArray", dataArray);

            let level0Array = dataArray[0].split(',');
            let level1Array = dataArray[dataArray.length - 1].split(',');

            handicap0 = level0Array[2]; //初盘盘口
            if (handicap0 == 'True' || handicap0 == '1') {
                team_A_Level0 = level0Array[1]; //A队初盘                
                team_B_Level0 = level0Array[0]; //B队初盘
            } else { //'False' '0'
                team_A_Level0 = level0Array[0]; //A队初盘   
                team_B_Level0 = level0Array[1]; //B队初盘
                sx_str0 = "受";
            }

            handicap1 = level1Array[2]; //临盘盘口
            if (handicap1 == 'True' || handicap1 == '1') {
                team_A_Level1 = level1Array[1]; //A队临盘
                team_B_Level1 = level1Array[0]; //B队临盘
            } else { //'False' '0'
                team_A_Level1 = level1Array[0]; //A队临盘
                team_B_Level1 = level1Array[1]; //B队临盘
                sx_str1 = "受";
            }
        }
        let handicap0_text = (handicap0 != "" && !isNaN(Number(handicap0))) ? RQ_ARR[Math.abs(Number(handicap0)) * 4] : handicap0;
        handicap0_text = sx_str0 + handicap0_text;
        let handicap1_text = sx_str1 + (handicap1 != "" && !isNaN(Number(handicap1))) ? RQ_ARR[Math.abs(Number(handicap1)) * 4] : handicap1;
        handicap1_text = sx_str1 + handicap1_text;

        result_data.push(team_A_Level0);
        result_data.push(team_B_Level0);
        result_data.push(handicap0_text);
        result_data.push(handicap1_text);
        result_data.push(team_A_Level1);
        result_data.push(team_B_Level1);

        // console.log("result_data", result_data);
    } catch (err) {
        if (err.status == 404) {
            console.warn("URL not existed:", handicapUrl);
            console.warn("team_A_Name:", team_A_Name);
        } else {
            console.error("Error :", err);
            console.error("team_A_Name:", team_A_Name);
        }
    }

    return result_data;
}
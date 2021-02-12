//*************************************************/
// 共通関数
//*************************************************/
var Cmn = {
    FlgOn: 1
    , FlgOff: 0
    , UnixTime1Min: 60                //UnixTime 1分
    , UnixTime1Hor: 60 * 60           //UnixTime 1時間時
    , UnixTime9Hor: 60 * 60 * 9       //UnixTime 9時間
    , UnixTime1Day: 60 * 60 * 24      //UnixTime 1日
    , UnixTIme1Wek: 60 * 60 * 24 * 7  //UnixTime 1週
    //*************************************************/
    // Date to UnixTIme
    //*************************************************/
    , cnvDate2UnixTime: function (pDate) {
        var ret = {}
        ret = pDate.getTime()
        ret = Math.floor(ret / 1000)   //ミリ秒を秒に変換
        // console.log(ret)
        return ret
    }
    //*************************************************/
    // Date to UnixTIme(日本時間)
    //*************************************************/
    , cnvJstDate2UtcUnixTime: function (pDate) {
        let tmpTime = this.cnvDate2UnixTime(pDate)
        // console.log("tmpTime" + tmpTime)
        return tmpTime + this.UnixTime1Hor
    }
    //*************************************************/
    // Date to 日付文字列(YYYY-MM-DD)
    //*************************************************/
    , cnvDtate2StrYMD(pDate) {
        var y = pDate.getFullYear();
        var m = ("00" + (pDate.getMonth() + 1)).slice(-2);
        var d = ("00" + pDate.getDate()).slice(-2);
        var result = y + "-" + m + "-" + d;
        return result;
    }
    //*************************************************/
    // Date to 日付文字列(YYYY-MM-DD HH:MM)
    //*************************************************/
    , cnvDtate2StrYMDHD(pDate) {
        var y = pDate.getFullYear();
        var m = ("00" + (pDate.getMonth() + 1)).slice(-2);
        var d = ("00" + pDate.getDate()).slice(-2);
        var h = ("00" + pDate.getHours()).slice(-2);
        var t = ("00" + pDate.getMinutes()).slice(-2);
        var result = y + "-" + m + "-" + d + " " + h + ":" + t;
        return result;
    }
    //*************************************************/
    // URLからJSON文字列を取得
    //*************************************************/
    , getJsonString(pstrUrl) {
        let Response = UrlFetchApp.fetch(pstrUrl);
        let JsonStr = Response.getContentText();
        return JsonStr
    }
}
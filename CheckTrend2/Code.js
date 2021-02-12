function myFunction() {
    let DebugFlg = true
    let MeigaraCode = ""
    let aryStock = []
    const aryMeigaraIdx = {
        MeigaraCode: 0
        , MeigaraName: 1
        , LastUpdated: 2
    }

    if (!DebugFlg) {
        Logger.log('START')

        // 銘柄一覧スプレッド(空のスプレッドを作成してURLをコピペ)
        const MeigaraFileUrl = "https://docs.google.com/spreadsheets/d/16WfvU6eD4QgTNcpObTXvbQo8eOSjak50DrH5XR9RGqc/edit#gid=0"
        // 銘柄一覧シート名(最初に作っておかないと動かない)
        const MeigaraSheetName = "List"
        //  銘柄ｼｰﾄ
        var shtMeigara = SpreadsheetApp.openByUrl(MeigaraFileUrl).getSheetByName(MeigaraSheetName)
        var lngMeigaraMaxRow = shtMeigara.getLastRow()
        // 銘柄一覧を取得(getRange(行番号, 列番号, 行数, 列数))
        var aryMeigara = shtMeigara.getRange(2, 1, lngMeigaraMaxRow, 3).getValues()

        /*   銘柄ﾙｰﾌﾟ   */
        for (let idxMei = 0; idxMei < aryMeigara.length; idxMei++) {
            let MeigaraCode = aryMeigara[idxMei][aryMeigaraIdx.MeigaraCode]
            console.log(MeigaraCode)
            if (MeigaraCode == "") {
                break
            }

            /*   ﾃﾞｰﾀ取得   */
            aryStock = StockData.getDayValue(DebugFlg, MeigaraCode, 3, 0.75)

            //バックテスト
            StockData.BackTest(aryStock,
                StockData.aryStokIdx.SarBuyFlg,
                StockData.aryStokIdx.SarBuyReleaseFlg)

            // 保存
            saveData(aryStock
                , idxMei
                , 20
                , aryMeigara[idxMei][aryMeigaraIdx.MeigaraCode]
                , aryMeigara[idxMei][aryMeigaraIdx.MeigaraName])
        }
    } else {
        console.log('Start')
        MeigaraCode = "Debug"

        aryStock = StockData.getDayValue(DebugFlg, MeigaraCode, 3.3, 0.77)
        //バックテスト
        StockData.BackTest(aryStock,
            StockData.aryStokIdx.SarBuyFlg,
            StockData.aryStokIdx.SarBuyReleaseFlg)

        // 保存データ取得
        let ArySave = getSaveArray(MeigaraCode
            , MeigaraCode
            , aryStock
            , aryStock.length)

        let csvContent = "data:text/csv;charset=utf-8,"
            + ArySave.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("value", "download");
        link.setAttribute("download", "my_data" + Cmn.cnvDtate2StrYMDHD(new Date()) + ".csv");
        var text = document.createTextNode("Download")
        link.appendChild(text)
        document.body.appendChild(link); // Required for FF
        //link.click(); // This will download the data file named "my_data.csv".
        document.write("</br>");
        document.write("その日：" + aryStock[aryStock.length - 1][StockData.aryStokIdx.BT_SellProfTtl] + "</br>"
            + "次の日：" + aryStock[aryStock.length - 1][StockData.aryStokIdx.BT_SellNextProfTtl] + "</br>");

    }
}

/*   保存用配列取得   */
function getSaveArray(pstrMeigaraCode, pstrMeigaraName, pAry, pSaveRowNum) {
    let ArySave = []
    let IdxStart = 0
    let now = new Date()

    if (pAry.length > pSaveRowNum) {
        IdxStart = pAry.length - pSaveRowNum
    }

    //Header
    ArySave.push([
        pstrMeigaraCode
        , pstrMeigaraName
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , Cmn.cnvDtate2StrYMDHD(now)
    ])

    // Header
    if (IdxStart != 0){
        ArySave.push([
            pAry[0][StockData.aryStokIdx.YMD]
            , pAry[0][StockData.aryStokIdx.Open]
            , pAry[0][StockData.aryStokIdx.Close]
            , pAry[0][StockData.aryStokIdx.SarBuyFlg]
            , pAry[0][StockData.aryStokIdx.SarBuyReleaseFlg]
            , pAry[0][StockData.aryStokIdx.SAR_Trend]
            , pAry[0][StockData.aryStokIdx.StdBolaTrend]
            , pAry[0][StockData.aryStokIdx.EMACycle]
            , pAry[0][StockData.aryStokIdx.SMACycle]
            , pAry[0][StockData.aryStokIdx.SAR_BuyLow]
            , pAry[0][StockData.aryStokIdx.SAR_SellHi]
            , pAry[0][StockData.aryStokIdx.SAR]
            , pAry[0][StockData.aryStokIdx.ADX]
            , pAry[0][StockData.aryStokIdx.StdDev]
            , pAry[0][StockData.aryStokIdx.BT_SellYmd]
            , pAry[0][StockData.aryStokIdx.BT_SellClose]
            , pAry[0][StockData.aryStokIdx.BT_SellProf]
            , pAry[0][StockData.aryStokIdx.BT_SellProfTtl]
            , pAry[0][StockData.aryStokIdx.BT_SellNextYmd]
            , pAry[0][StockData.aryStokIdx.BT_SellNextOpen]
            , pAry[0][StockData.aryStokIdx.BT_SellNextProf]
            , pAry[0][StockData.aryStokIdx.BT_SellNextProfTtl]
        ])
    }

    for (let i = IdxStart; i < pAry.length; i++) {
        ArySave.push([
            pAry[i][StockData.aryStokIdx.YMD]
            , pAry[i][StockData.aryStokIdx.Open]
            , pAry[i][StockData.aryStokIdx.Close]
            , pAry[i][StockData.aryStokIdx.SarBuyFlg]
            , pAry[i][StockData.aryStokIdx.SarBuyReleaseFlg]
            , pAry[i][StockData.aryStokIdx.SAR_Trend]
            , pAry[i][StockData.aryStokIdx.StdBolaTrend]
            , pAry[i][StockData.aryStokIdx.EMACycle]
            , pAry[i][StockData.aryStokIdx.SMACycle]
            , pAry[i][StockData.aryStokIdx.SAR_BuyLow]
            , pAry[i][StockData.aryStokIdx.SAR_SellHi]
            , pAry[i][StockData.aryStokIdx.SAR]
            , pAry[i][StockData.aryStokIdx.ADX]
            , pAry[i][StockData.aryStokIdx.StdDev]
            , pAry[i][StockData.aryStokIdx.BT_SellYmd]
            , pAry[i][StockData.aryStokIdx.BT_SellClose]
            , pAry[i][StockData.aryStokIdx.BT_SellProf]
            , pAry[i][StockData.aryStokIdx.BT_SellProfTtl]
            , pAry[i][StockData.aryStokIdx.BT_SellNextYmd]
            , pAry[i][StockData.aryStokIdx.BT_SellNextOpen]
            , pAry[i][StockData.aryStokIdx.BT_SellNextProf]
            , pAry[i][StockData.aryStokIdx.BT_SellNextProfTtl]
        ])
    }

    return ArySave
}

/*   計算結果出力処理   */
function saveData(pAry, pIdx, pSaveRowNum, pMeigaraCode, pMeigaraName) {
    let ArySave = []
    let OutputRow = 1
    OutputRow = pIdx * (1 + 1 + pSaveRowNum + 1) + 1

    // データスプレッド(空のスプレッドを作成してURLをコピペ)
    const MeigaraFileUrl = "https://docs.google.com/spreadsheets/d/16WfvU6eD4QgTNcpObTXvbQo8eOSjak50DrH5XR9RGqc/edit#gid=0"
    // データシート名(最初に作っておかないと動かない)
    const DataSheetName = "Data"
    //  スプレッドシート
    var shtMeigara = SpreadsheetApp.openByUrl(MeigaraFileUrl)
    //  銘柄ｼｰﾄ
    var shtData = shtMeigara.getSheetByName(DataSheetName)

    // 保存データ取得
    ArySave = getSaveArray(pMeigaraCode
        , pMeigaraName
        , pAry
        , pSaveRowNum)
    // getRange(行番号, 列番号, 行数, 列数)
    shtData.getRange(OutputRow, 1, ArySave.length, ArySave[0].length).setValues(ArySave)

    //  個別シート
    var shtKobetsu = shtMeigara.getSheetByName(pMeigaraCode)
    if (shtKobetsu) {
        // 保存データ取得
        ArySave = getSaveArray(pMeigaraCode
            , pMeigaraName
            , pAry
            , pAry.length)
        // getRange(行番号, 列番号, 行数, 列数)
        shtKobetsu.getRange(1, 1, ArySave.length, ArySave[0].length).setValues(ArySave)
    }

}
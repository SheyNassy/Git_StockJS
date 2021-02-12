var StockData = {
    aryStokIdx: {
        YMD: 0
        , Open: 1
        , High: 2
        , Low: 3
        , Close: 4
        , Volume: 5
        , SMA5: 6
        , SMA20: 7
        , SMA40: 8
        , SMA60: 9
        , TR: 10
        , ATR: 11
        , SIP_Max: 12
        , SIP_Min: 13
        , SAR_BuyLow: 14
        , SAR_SellHi: 15
        , SAR_Trend: 16
        , SAR: 17
        , EMA5: 18
        , EMA12: 19
        , EMA20: 20
        , EMA26: 21
        , EMA40: 22
        , EMA60: 23
        , MACD: 24
        , MACDSig: 25
        , MACDHst: 26
        , MACD_TrendLw: 27
        , MACD_TrendHi: 28
        , MACD1: 29
        , MACD2: 30
        , MACD3: 31
        , EMACycle: 32
        , SMACycle: 33
        , DMP: 34
        , DMM: 35
        , DMP_MMA: 36
        , DMM_MMA: 37
        , ATR_MMA: 38
        , DIP: 39
        , DIM: 40
        , DX: 41
        , ADX: 42
        , StdDev: 43
        , StdDev1Sig: 44
        , StdBolaTrend: 45
        , StdBolaBuyFlg: 46
        , StdBolaBuyReleaseFlg: 47
        , StdBolaSellFlg: 48
        , StdBolaSellReleaseFlg: 49
        , CCP: 50
        , CCM: 51
        , SarBuyFlg: 52
        , SarBuyReleaseFlg: 53
        , SarSellFlg: 54
        , SarSellReleaseFlg: 55
        , BT_BuyFlg: 56
        , BT_BuyReleaseFlg: 57
        , BT_SellYmd: 58
        , BT_SellClose: 59
        , BT_SellProf: 60
        , BT_SellProfTtl: 61
        , BT_SellNextYmd: 62
        , BT_SellNextOpen: 63
        , BT_SellNextProf: 64
        , BT_SellNextProfTtl: 65
        // , AibBuyFlg: 13
        // , AibSellFlg: 14
        // , AibIfBuySellYmd: 15
        // , AibIfBuySellClose: 16
        // , AibIfBuySellProf: 17
        // , AibIfBuySellTtl: 18
        // , AibIfBuySellNextYmd: 19
        // , AibIfBuySellNextOpen: 20
        // , AibIfBuySellNextProf: 21
        // , AibIfBuySellNextTtl: 22
        // , TR: 7
        // , ATR: 8
        // , SIP_Max: 9
        // , SIP_Min: 10
        // , SAR_BuyLow: 11
        // , SAR_SellHi: 12
        // , SAR_Trend: 13
        // , SAR: 14
        // , SAR_BLoss: 15
        // , SAR_BProf: 16
        // , SAR_BTjmiDay: 17
        // , SAR_BTjmiVal: 18
        // , SAR_BSoneki: 19
        // , EMA12: 20
        // , EMA26: 21
        // , MACD: 22
        // , MACDSig: 23
        // , MACDHst: 24
        // , MACD_TrendLw: 25
        // , MACD_TrendHi: 26
        // , DMP: 27
        // , DMM: 28
        // , DMP_MMA: 29
        // , DMM_MMA: 30
        // , ATR_MMA: 31
        // , DIP: 32
        // , DIM: 33
        // , DX: 34
        // , ADX: 35
        // , StdDev: 36
        // , SMA20: 37
        // , BBP06Sig: 38
        // , BBM06Sig: 39
        // , ProfLine: 40
        // , StdBolaTrend: 41
        // , StcKLw: 42
        // , StcKHi: 43
        // , StcKLwDiff: 44
        // , StcKHiDiff: 45
        // , StcK: 46
        // , StcKLwDiffSMA: 47
        // , StcKHiDiffSMA: 48
        // , StcD: 49
        // , EMA200: 50
        // , StcasSignal: 51
    }
    //*************************************************/
    //   日足データ取得
    // ----------------------------------------
    //*************************************************/
    , getDayValue: function (pDevFlg, pMeigaraCode, pintSARK, pdecStdBol) {
        let strUrl = ""
        let strJson = ""
        let aryStock = []

        if (pDevFlg) {
            strJson = this.getStrockAryDummy()
        } else {
            strUrl = this.getUrl(pMeigaraCode, "1d", 1000)
            console.log(strUrl)
            //データ取得
            strJson = Cmn.getJsonString(strUrl)
        }
        //データコンバート
        aryStock = this.cnvJsonToStrockAry(strJson);

        //各種計算
        this.calcTechnicalIdx(aryStock, pintSARK, pdecStdBol)

        //ヘッダー行書き込み
        aryStock.unshift(Object.keys(this.aryStokIdx))

        return aryStock;
    }
    //*************************************************/
    //   URL生成
    // ----------------------------------------
    // pstrMeigaraCode : 銘柄ｺｰﾄﾞ(ex,1671.T)
    // plngDayPeriod   : 取得日数
    // ---------- URL Param ----------
    // period1:Start
    // period2:End
    // interval:1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
    //*************************************************/
    , getUrl: function (pstrMeigara, pstrInterval, plngDayPeriod) {
        let datNow = new Date()
        let datStart = new Date(datNow.getFullYear(), datNow.getMonth(), datNow.getDate() - plngDayPeriod)
        let BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/"
        let ret = ""

        ret = BASE_URL + pstrMeigara + "?symbol=" + pstrMeigara
            + "&period1=" + Cmn.cnvJstDate2UtcUnixTime(datStart)
            + "&period2=" + Cmn.cnvJstDate2UtcUnixTime(datNow)
            + "&interval=" + pstrInterval
        return ret
    }
    //*************************************************/
    //   JSONから配列に変換
    // ----------------------------------------
    //*************************************************/
    , cnvJsonToStrockAry: function (pstrJson) {
        let aryRet = []
        let objStock = {}
        if (pstrJson.length > 0) {
            objStock = JSON.parse(pstrJson)
        } else {
            console.error("cnvJsonToStrockAry fail : ")
            return []
        }
        //新着ﾃﾞｰﾀ書き出し用配列に格納
        for (var i = 0; i < objStock.chart.result[0].timestamp.length; i++) {
            tmpDate = new Date(objStock.chart.result[0].timestamp[i] * 1000)
            if (typeof objStock.chart.result[0].indicators.quote[0].volume[i] === 'number') {
                aryRet.push([
                    Cmn.cnvDtate2StrYMD(tmpDate)
                    //      , objStock.chart.result[0].timestamp[i]
                    , objStock.chart.result[0].indicators.quote[0].open[i]
                    , objStock.chart.result[0].indicators.quote[0].high[i]
                    , objStock.chart.result[0].indicators.quote[0].low[i]
                    , objStock.chart.result[0].indicators.quote[0].close[i]
                    , objStock.chart.result[0].indicators.quote[0].volume[i]
                ])
            }
        }
        return aryRet
    }
    //*************************************************/
    //   各種計算
    // ----------------------------------------
    //*************************************************/
    , calcTechnicalIdx: function (paryStock, pintSARK, pdecStdBol) {
        const Trend = {
            None: 0
            , WVI_Buy: 1
            , WVI_Sell: -1
            , MACD_BuyLw: 2
            , MACD_SellLw: -2
            , MACD_BuyHi: 3
            , MACD_SellHi: -3
            , StdVola_Buy: 4
            , StdVola_Sell: -4
            , Stcas_Buy: 5
            , Stcas_Sell: -5
        }
        for (i = 0; i < paryStock.length; i++) {
            // SMA5
            this.setSMA(paryStock, 5, i, this.aryStokIdx.Close, this.aryStokIdx.SMA5)
            // SMA20
            this.setSMA(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.SMA20)
            // SMA40
            this.setSMA(paryStock, 40, i, this.aryStokIdx.Close, this.aryStokIdx.SMA40)
            // SMA60
            this.setSMA(paryStock, 60, i, this.aryStokIdx.Close, this.aryStokIdx.SMA60)

            // TR
            this.setTR(paryStock, i)
            // ATR(7日MMA)
            this.setMMA(paryStock, 7, i, this.aryStokIdx.TR, this.aryStokIdx.ATR)

            // SIP(Max)
            this.setMMax(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.SIP_Max)
            // SIP(Min)
            this.setMMin(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.SIP_Min)
            // Stop And Reverce Max
            paryStock[i][this.aryStokIdx.SAR_BuyLow] = paryStock[i][this.aryStokIdx.SIP_Max] - paryStock[i][this.aryStokIdx.ATR] * pintSARK
            // Stop And Reverce Mim
            paryStock[i][this.aryStokIdx.SAR_SellHi] = paryStock[i][this.aryStokIdx.SIP_Min] + paryStock[i][this.aryStokIdx.ATR] * pintSARK

            // Stop And Reverce
            if (i == 0) {
                paryStock[i][this.aryStokIdx.SAR_Trend] = Trend.None
            } else if (paryStock[i - 1][this.aryStokIdx.SAR_Trend] !== Trend.WVI_Sell &&
                paryStock[i - 1][this.aryStokIdx.SAR_BuyLow] < paryStock[i - 1][this.aryStokIdx.Close] &&
                paryStock[i][this.aryStokIdx.SAR_BuyLow] >= paryStock[i][this.aryStokIdx.Close]) {
                // SAR_SellHiがCloseとGC
                paryStock[i][this.aryStokIdx.SAR_Trend] = Trend.WVI_Sell
                paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_SellHi]
            } else if (paryStock[i - 1][this.aryStokIdx.SAR_Trend] !== Trend.WVI_Buy &&
                paryStock[i - 1][this.aryStokIdx.SAR_SellHi] > paryStock[i - 1][this.aryStokIdx.Close] &&
                paryStock[i][this.aryStokIdx.SAR_SellHi] <= paryStock[i][this.aryStokIdx.Close]) {
                paryStock[i][this.aryStokIdx.SAR_Trend] = Trend.WVI_Buy
                paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_BuyLow]
            } else {
                paryStock[i][this.aryStokIdx.SAR_Trend] = paryStock[i - 1][this.aryStokIdx.SAR_Trend]
                if (paryStock[i][this.aryStokIdx.SAR_Trend] == Trend.WVI_Buy) {
                    paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_BuyLow]
                } else if (paryStock[i][this.aryStokIdx.SAR_Trend] == Trend.WVI_Sell) {
                    paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_SellHi]
                }
            }

            // EMA5
            this.setEMA(paryStock, 5, i, this.aryStokIdx.Close, this.aryStokIdx.EMA5)
            // EMA12
            this.setEMA(paryStock, 12, i, this.aryStokIdx.Close, this.aryStokIdx.EMA12)
            // EMA20
            this.setEMA(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.EMA20)
            // EMA26
            this.setEMA(paryStock, 26, i, this.aryStokIdx.Close, this.aryStokIdx.EMA26)
            // EMA40
            this.setEMA(paryStock, 40, i, this.aryStokIdx.Close, this.aryStokIdx.EMA40)
            // EMA60
            this.setEMA(paryStock, 60, i, this.aryStokIdx.Close, this.aryStokIdx.EMA60)

            // MACD
            paryStock[i][this.aryStokIdx.MACD] = paryStock[i][this.aryStokIdx.EMA12] - paryStock[i][this.aryStokIdx.EMA26]
            // MACD ｼｸﾞﾅﾙ
            this.setEMA(paryStock, 9, i, this.aryStokIdx.MACD, this.aryStokIdx.MACDSig)
            // MACD ﾋｽﾄｸﾞﾗﾑ
            paryStock[i][this.aryStokIdx.MACDHst] = paryStock[i][this.aryStokIdx.MACD] - paryStock[i][this.aryStokIdx.MACDSig]
            // MACD ﾄﾚﾝﾄﾞ
            if (paryStock[i][this.aryStokIdx.MACD] > paryStock[i][this.aryStokIdx.MACDSig]) {
                paryStock[i][this.aryStokIdx.MACD_TrendLw] = Trend.MACD_BuyLw
            } else {
                paryStock[i][this.aryStokIdx.MACD_TrendLw] = Trend.MACD_SellLw
            }
            // MACD Trend High
            paryStock[i][this.aryStokIdx.MACD_TrendHi] = Trend.None
            if (paryStock[i][this.aryStokIdx.MACD] > 0 &&
                paryStock[i][this.aryStokIdx.MACDSig] > 0 &&
                paryStock[i][this.aryStokIdx.MACDHst] > 0) {
                paryStock[i][this.aryStokIdx.MACD_TrendHi] = Trend.MACD_BuyHi
            }
            if (paryStock[i][this.aryStokIdx.MACD] < 0 &&
                paryStock[i][this.aryStokIdx.MACDSig] < 0 &&
                paryStock[i][this.aryStokIdx.MACDHst] < 0) {
                paryStock[i][this.aryStokIdx.MACD_TrendHi] = Trend.MACD_SellHi
            }

            // MACD1
            paryStock[i][this.aryStokIdx.MACD1] = paryStock[i][this.aryStokIdx.EMA5] - paryStock[i][this.aryStokIdx.EMA20]
            // MACD2
            paryStock[i][this.aryStokIdx.MACD2] = paryStock[i][this.aryStokIdx.EMA5] - paryStock[i][this.aryStokIdx.EMA40]
            // MACD3
            paryStock[i][this.aryStokIdx.MACD3] = paryStock[i][this.aryStokIdx.EMA20] - paryStock[i][this.aryStokIdx.EMA40]

            // EMA Cyvle(移動平均大循環分析)
            if (paryStock[i][this.aryStokIdx.EMA5] >= paryStock[i][this.aryStokIdx.EMA20] &&
                paryStock[i][this.aryStokIdx.EMA20] >= paryStock[i][this.aryStokIdx.EMA60]) {
                paryStock[i][this.aryStokIdx.EMACycle] = "ST1"
            }
            if (paryStock[i][this.aryStokIdx.EMA20] >= paryStock[i][this.aryStokIdx.EMA5] &&
                paryStock[i][this.aryStokIdx.EMA5] >= paryStock[i][this.aryStokIdx.EMA60]) {
                paryStock[i][this.aryStokIdx.EMACycle] = "ST2"
            }
            if (paryStock[i][this.aryStokIdx.EMA20] >= paryStock[i][this.aryStokIdx.EMA60] &&
                paryStock[i][this.aryStokIdx.EMA60] >= paryStock[i][this.aryStokIdx.EMA5]) {
                paryStock[i][this.aryStokIdx.EMACycle] = "ST3"
            }
            if (paryStock[i][this.aryStokIdx.EMA60] >= paryStock[i][this.aryStokIdx.EMA20] &&
                paryStock[i][this.aryStokIdx.EMA20] >= paryStock[i][this.aryStokIdx.EMA5]) {
                paryStock[i][this.aryStokIdx.EMACycle] = "ST4"
            }
            if (paryStock[i][this.aryStokIdx.EMA60] >= paryStock[i][this.aryStokIdx.EMA5] &&
                paryStock[i][this.aryStokIdx.EMA5] >= paryStock[i][this.aryStokIdx.EMA20]) {
                paryStock[i][this.aryStokIdx.EMACycle] = "ST5"
            }
            if (paryStock[i][this.aryStokIdx.EMA5] >= paryStock[i][this.aryStokIdx.EMA60] &&
                paryStock[i][this.aryStokIdx.EMA60] >= paryStock[i][this.aryStokIdx.EMA20]) {
                paryStock[i][this.aryStokIdx.EMACycle] = "ST6"
            }

            // SMA Cyvle(移動平均大循環分析)
            if (paryStock[i][this.aryStokIdx.SMA5] >= paryStock[i][this.aryStokIdx.SMA20] &&
                paryStock[i][this.aryStokIdx.SMA20] >= paryStock[i][this.aryStokIdx.SMA60]) {
                paryStock[i][this.aryStokIdx.SMACycle] = "ST1"
            }
            if (paryStock[i][this.aryStokIdx.SMA20] >= paryStock[i][this.aryStokIdx.SMA5] &&
                paryStock[i][this.aryStokIdx.SMA5] >= paryStock[i][this.aryStokIdx.SMA60]) {
                paryStock[i][this.aryStokIdx.SMACycle] = "ST2"
            }
            if (paryStock[i][this.aryStokIdx.SMA20] >= paryStock[i][this.aryStokIdx.SMA60] &&
                paryStock[i][this.aryStokIdx.SMA60] >= paryStock[i][this.aryStokIdx.SMA5]) {
                paryStock[i][this.aryStokIdx.SMACycle] = "ST3"
            }
            if (paryStock[i][this.aryStokIdx.SMA60] >= paryStock[i][this.aryStokIdx.SMA20] &&
                paryStock[i][this.aryStokIdx.SMA20] >= paryStock[i][this.aryStokIdx.SMA5]) {
                paryStock[i][this.aryStokIdx.SMACycle] = "ST4"
            }
            if (paryStock[i][this.aryStokIdx.SMA60] >= paryStock[i][this.aryStokIdx.SMA5] &&
                paryStock[i][this.aryStokIdx.SMA5] >= paryStock[i][this.aryStokIdx.SMA20]) {
                paryStock[i][this.aryStokIdx.SMACycle] = "ST5"
            }
            if (paryStock[i][this.aryStokIdx.SMA5] >= paryStock[i][this.aryStokIdx.SMA60] &&
                paryStock[i][this.aryStokIdx.SMA60] >= paryStock[i][this.aryStokIdx.SMA20]) {
                paryStock[i][this.aryStokIdx.SMACycle] = "ST6"
            }

            // DMP
            // DMM
            paryStock[i][this.aryStokIdx.DMP] = 0
            paryStock[i][this.aryStokIdx.DMM] = 0
            if (i >= 1) {
                paryStock[i][this.aryStokIdx.DMP] = paryStock[i][this.aryStokIdx.High] - paryStock[i - 1][this.aryStokIdx.High]
                paryStock[i][this.aryStokIdx.DMM] = paryStock[i - 1][this.aryStokIdx.Low] - paryStock[i][this.aryStokIdx.Low]
                if (paryStock[i][this.aryStokIdx.DMP] < 0 &&
                    paryStock[i][this.aryStokIdx.DMM] < 0) {
                    paryStock[i][this.aryStokIdx.DMP] = 0
                    paryStock[i][this.aryStokIdx.DMM] = 0
                } else {
                    if (paryStock[i][this.aryStokIdx.DMP] > paryStock[i][this.aryStokIdx.DMM]) {
                        paryStock[i][this.aryStokIdx.DMM] = 0
                    }
                    if (paryStock[i][this.aryStokIdx.DMP] < paryStock[i][this.aryStokIdx.DMM]) {
                        paryStock[i][this.aryStokIdx.DMP] = 0
                    }
                }
            }

            // DIP DIM
            this.setMMA(paryStock, 14, i, this.aryStokIdx.DMP, this.aryStokIdx.DMP_MMA)
            this.setMMA(paryStock, 14, i, this.aryStokIdx.DMM, this.aryStokIdx.DMM_MMA)
            this.setMMA(paryStock, 14, i, this.aryStokIdx.TR, this.aryStokIdx.ATR_MMA)
            //DI+
            paryStock[i][this.aryStokIdx.DIP] = paryStock[i][this.aryStokIdx.DMP_MMA] / paryStock[i][this.aryStokIdx.ATR_MMA] * 100
            //DI-
            paryStock[i][this.aryStokIdx.DIM] = paryStock[i][this.aryStokIdx.DMM_MMA] / paryStock[i][this.aryStokIdx.ATR_MMA] * 100
            //DX
            paryStock[i][this.aryStokIdx.DX] = Math.abs((paryStock[i][this.aryStokIdx.DIP] - paryStock[i][this.aryStokIdx.DIM])) / (paryStock[i][this.aryStokIdx.DIP] + paryStock[i][this.aryStokIdx.DIM]) * 100
            //ADX
            this.setMMA(paryStock, 14, i, this.aryStokIdx.DX, this.aryStokIdx.ADX)

            // 標準偏差
            this.setStdDev(paryStock, 26, i, this.aryStokIdx.Close, this.aryStokIdx.StdDev)

            // ﾎﾞﾘﾝｼﾞｬｰﾊﾞﾝﾄﾞ +1σ
            paryStock[i][this.aryStokIdx.StdDev1Sig] = paryStock[i][this.aryStokIdx.SMA20] + paryStock[i][this.aryStokIdx.StdDev] * 1

            // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ ﾄﾚﾝﾄﾞ
            paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.None
            if (i > 0 &&
                paryStock[i][this.aryStokIdx.ADX] > 0 &&
                paryStock[i][this.aryStokIdx.StdDev] > 0) {
                if (paryStock[i][this.aryStokIdx.StdDev] >= paryStock[i - 1][this.aryStokIdx.StdDev] &&
                    paryStock[i][this.aryStokIdx.ADX] >= paryStock[i - 1][this.aryStokIdx.ADX] &&
                    paryStock[i][this.aryStokIdx.Close] >= (paryStock[i][this.aryStokIdx.SMA20] + paryStock[i][this.aryStokIdx.StdDev] * pdecStdBol)) {
                    paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Buy
                } else if (paryStock[i][this.aryStokIdx.StdDev] >= paryStock[i - 1][this.aryStokIdx.StdDev] &&
                    paryStock[i][this.aryStokIdx.ADX] >= paryStock[i - 1][this.aryStokIdx.ADX] &&
                    paryStock[i][this.aryStokIdx.Close] <= (paryStock[i][this.aryStokIdx.SMA20] - paryStock[i][this.aryStokIdx.StdDev] * pdecStdBol)) {
                    paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Sell
                } else if (paryStock[i - 1][this.aryStokIdx.StdBolaTrend] == Trend.StdVola_Buy &&
                    paryStock[i][this.aryStokIdx.Close] >= (paryStock[i][this.aryStokIdx.SMA20] + paryStock[i][this.aryStokIdx.StdDev] * pdecStdBol)) {
                    paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Buy
                } else if (paryStock[i - 1][this.aryStokIdx.StdBolaTrend] == Trend.StdVola_Sell &&
                    paryStock[i][this.aryStokIdx.Close] <= (paryStock[i][this.aryStokIdx.SMA20] - paryStock[i][this.aryStokIdx.StdDev] * pdecStdBol)) {
                    paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Sell
                }
            }

            // 標準偏差ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙの売り買い
            paryStock[i][this.aryStokIdx.StdBolaBuyFlg] = 0
            paryStock[i][this.aryStokIdx.StdBolaBuyReleaseFlg] = 0
            if (i > 1) {
                // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ 買いﾌﾗｸﾞ

                // 買いﾎﾟｼﾞではないとき
                if (!this.isBuying(paryStock, i, this.aryStokIdx.StdBolaBuyFlg, this.aryStokIdx.StdBolaBuyReleaseFlg)) {
                    //ﾄﾚﾝﾄﾞ2日目
                    if (paryStock[i - 1][this.aryStokIdx.StdBolaTrend] <= 0 &&
                        paryStock[i][this.aryStokIdx.StdBolaTrend] > 0) {
                        paryStock[i][this.aryStokIdx.StdBolaBuyFlg] = 1
                    }
                } else {
                    // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ 売りﾌﾗｸﾞ
                    if (paryStock[i][this.aryStokIdx.StdBolaTrend] <= 0) {
                        paryStock[i][this.aryStokIdx.StdBolaBuyReleaseFlg] = 1
                    }
                }
            }
            paryStock[i][this.aryStokIdx.StdBolaSellFlg] = 0
            paryStock[i][this.aryStokIdx.StdBolaSellReleaseFlg] = 0
            if (i > 1) {
                // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ 売りﾌﾗｸﾞ

                // 買いﾎﾟｼﾞではないとき
                if (!this.isBuying(paryStock, i, this.aryStokIdx.StdBolaSellFlg, this.aryStokIdx.StdBolaSellReleaseFlg)) {
                    //ﾄﾚﾝﾄﾞ2日目
                    if (paryStock[i - 1][this.aryStokIdx.StdBolaTrend] >= 0 &&
                        paryStock[i][this.aryStokIdx.StdBolaTrend] < 0) {
                        paryStock[i][this.aryStokIdx.StdBolaSellFlg] = 1
                    }
                } else {
                    // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ 売りﾌﾗｸﾞ
                    if (paryStock[i][this.aryStokIdx.StdBolaTrend] >= 0) {
                        paryStock[i][this.aryStokIdx.StdBolaSellReleaseFlg] = 1
                    }
                }
            }

            // Continue Count Plus
            // Continue Count Minus
            paryStock[i][this.aryStokIdx.CCP] = 0
            paryStock[i][this.aryStokIdx.CCM] = 0
            if (i >= 2) {
                //DMP & DMM が0の場合
                if (paryStock[i][this.aryStokIdx.DMP] == 0 &&
                    paryStock[i][this.aryStokIdx.DMM] == 0) {
                    if (paryStock[i - 1][this.aryStokIdx.CCP] > 0) {
                        paryStock[i][this.aryStokIdx.CCP] = paryStock[i - 1][this.aryStokIdx.CCP] + 1
                        paryStock[i][this.aryStokIdx.CCM] = 0
                    }
                    if (paryStock[i - 1][this.aryStokIdx.CCM] > 0) {
                        paryStock[i][this.aryStokIdx.CCP] = 0
                        paryStock[i][this.aryStokIdx.CCM] = paryStock[i - 1][this.aryStokIdx.CCM] + 1
                    }
                } else {
                    //オセロ状態の見直し(昨日分)
                    if (paryStock[i][this.aryStokIdx.DMP] > 0 &&
                        paryStock[i - 1][this.aryStokIdx.DMM] > 0 &&
                        paryStock[i - 2][this.aryStokIdx.DMP] > 0) {
                        paryStock[i - 1][this.aryStokIdx.CCP] = paryStock[i - 2][this.aryStokIdx.CCP] + 1
                        paryStock[i - 1][this.aryStokIdx.CCM] = 0
                    }
                    if (paryStock[i][this.aryStokIdx.DMM] > 0 &&
                        paryStock[i - 1][this.aryStokIdx.DMP] > 0 &&
                        paryStock[i - 2][this.aryStokIdx.DMM] > 0) {
                        paryStock[i - 1][this.aryStokIdx.CCM] = paryStock[i - 2][this.aryStokIdx.CCM] + 1
                        paryStock[i - 1][this.aryStokIdx.CCP] = 0
                    }

                    //当日分
                    if (paryStock[i][this.aryStokIdx.DMP] > 0) {
                        paryStock[i][this.aryStokIdx.CCP] = paryStock[i - 1][this.aryStokIdx.CCP] + 1
                        paryStock[i][this.aryStokIdx.CCM] = 0
                    }
                    if (paryStock[i][this.aryStokIdx.DMM] > 0) {
                        paryStock[i][this.aryStokIdx.CCP] = 0
                        paryStock[i][this.aryStokIdx.CCM] = paryStock[i - 1][this.aryStokIdx.CCM] + 1
                    }
                }
            }

            // ﾜｲﾙﾀﾞｰのｼｬﾝﾃﾞﾘｱｼｽﾃﾑ改の買い
            paryStock[i][this.aryStokIdx.SarBuyFlg] = 0
            paryStock[i][this.aryStokIdx.SarBuyReleaseFlg] = 0
            if (i > 40) {
                // 買いﾎﾟｼﾞではないとき
                if (!this.isBuying(paryStock, i, this.aryStokIdx.SarBuyFlg, this.aryStokIdx.SarBuyReleaseFlg)) {
                    //SAR 買いﾄﾚﾝﾄﾞ
                    if (paryStock[i][this.aryStokIdx.SAR_Trend] > 0) {
                        if (paryStock[i][this.aryStokIdx.EMACycle] == "ST1" ||
                            paryStock[i][this.aryStokIdx.EMACycle] == "ST6") {
                            if (paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST2" ||
                                paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST4" ||
                                paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST5" ||
                                paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST6") {
                                //今回のﾄﾚﾝﾄﾞでまだﾎﾟｼﾞｼｮﾝをとっていない
                                if (this.isNoPosiThisTrend(paryStock, i, this.aryStokIdx.SAR_Trend, this.aryStokIdx.SarBuyFlg, paryStock[i][this.aryStokIdx.SAR_Trend])) {
                                    paryStock[i][this.aryStokIdx.SarBuyFlg] = 1
                                } else {
                                    paryStock[i][this.aryStokIdx.SarBuyFlg] = 0.5
                                }
                            }
                            // if (paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST1" &&
                            //     paryStock[i][this.aryStokIdx.StdBolaTrend] > 0) {
                            //     paryStock[i][this.aryStokIdx.SarBuyFlg] = 0.5
                            // }
                        }
                    }
                } else {
                    // 買いﾎﾟｼﾞの時
                    // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ 売りﾌﾗｸﾞ
                    if (paryStock[i][this.aryStokIdx.StdBolaBuyReleaseFlg] == 1 ||
                        paryStock[i][this.aryStokIdx.SAR_Trend] < 0) {
                        paryStock[i][this.aryStokIdx.SarBuyReleaseFlg] = 1
                    }
                }
            }

            // ﾜｲﾙﾀﾞｰのｼｬﾝﾃﾞﾘｱｼｽﾃﾑ改の売り
            paryStock[i][this.aryStokIdx.SarSellFlg] = 0
            paryStock[i][this.aryStokIdx.SarSellReleaseFlg] = 0
            if (i > 40) {
                // 買いﾎﾟｼﾞではないとき
                if (!this.isBuying(paryStock, i, this.aryStokIdx.SarSellFlg, this.aryStokIdx.SarSellReleaseFlg)) {
                    //SAR 買いﾄﾚﾝﾄﾞ
                    if (paryStock[i][this.aryStokIdx.SAR_Trend] < 0) {
                        if (paryStock[i][this.aryStokIdx.EMACycle] == "ST3" ||
                            paryStock[i][this.aryStokIdx.EMACycle] == "ST4") {
                            if (paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST1" ||
                                paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST2" ||
                                paryStock[i - 1][this.aryStokIdx.EMACycle] == "ST3") {
                                paryStock[i][this.aryStokIdx.SarSellFlg] = 1
                            }
                        }
                    }
                } else {
                    // 買いﾎﾟｼﾞの時
                    // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ 売りﾌﾗｸﾞ
                    if (paryStock[i][this.aryStokIdx.StdBolaSellReleaseFlg] == 1 ||
                        paryStock[i][this.aryStokIdx.SAR_Trend] > 0) {
                        paryStock[i][this.aryStokIdx.SarSellReleaseFlg] = 1
                    }
                }
            }

            //末尾処理
            paryStock[i][this.aryStokIdx.BT_SellNextProfTtl] = 0




            // if (i > 60) {
            //     // AibBuyFlg
            //     paryStock[i][this.aryStokIdx.AibBuyFlg] = 0
            //     //     Close > SMA5
            //     //     陽線
            //     if (paryStock[i][this.aryStokIdx.Close] > paryStock[i][this.aryStokIdx.SMA5] ) {
            //         // PPP 5-20-60
            //         if (paryStock[i][this.aryStokIdx.SMA5] > paryStock[i][this.aryStokIdx.SMA20] &&
            //             paryStock[i][this.aryStokIdx.SMA20] > paryStock[i][this.aryStokIdx.SMA60] &&
            //             paryStock[i][this.aryStokIdx.CCP] <= 5) {
            //             paryStock[i][this.aryStokIdx.AibBuyFlg] = 1
            //         }
            //     }

            //     // AibSellFlg
            //     paryStock[i][this.aryStokIdx.AibSellFlg] = 0
            //     //   SMA5 > Close & 昨日陰線
            //     if (paryStock[i][this.aryStokIdx.SMA5] > paryStock[i][this.aryStokIdx.Close] &&
            //         paryStock[i - 1][this.aryStokIdx.Open] > paryStock[i - 1][this.aryStokIdx.Close]) {
            //         paryStock[i][this.aryStokIdx.AibSellFlg] = 1
            //     }
            //     //   陰線2連続
            //     if (paryStock[i][this.aryStokIdx.Open] > paryStock[i][this.aryStokIdx.Close] &&
            //         paryStock[i - 1][this.aryStokIdx.Open] > paryStock[i - 1][this.aryStokIdx.Close]) {
            //         paryStock[i][this.aryStokIdx.AibSellFlg] = 2
            //     }
            //     //   6本目以降の陰線
            //     if (paryStock[i][this.aryStokIdx.Open] > paryStock[i][this.aryStokIdx.Close] &&
            //         paryStock[i][this.aryStokIdx.CCP] >= 6) {
            //         paryStock[i][this.aryStokIdx.AibSellFlg] = 3
            //     }
            //     //   6本目以降のDirectionMoveMinus
            //     if (paryStock[i][this.aryStokIdx.DMM] > 0 &&
            //         paryStock[i][this.aryStokIdx.CCP] >= 6) {
            //         paryStock[i][this.aryStokIdx.AibSellFlg] = 4
            //     }
            // }




            // // TR
            // this.setTR(paryStock, i)
            // // ATR(7日MMA)
            // this.setMMA(paryStock, 7, i, this.aryStokIdx.TR, this.aryStokIdx.ATR)
            // // SIP(Max)
            // this.setMMax(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.SIP_Max)
            // // SIP(Min)
            // this.setMMin(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.SIP_Min)
            // // Stop And Reverce Max
            // paryStock[i][this.aryStokIdx.SAR_BuyLow] = paryStock[i][this.aryStokIdx.SIP_Max] - paryStock[i][this.aryStokIdx.ATR] * SARK
            // // Stop And Reverce Mim
            // paryStock[i][this.aryStokIdx.SAR_SellHi] = paryStock[i][this.aryStokIdx.SIP_Min] + paryStock[i][this.aryStokIdx.ATR] * SARK

            // // Stop And Reverce
            // if (i == 0) {
            //     paryStock[i][this.aryStokIdx.SAR_Trend] = Trend.None
            // } else if (paryStock[i - 1][this.aryStokIdx.SAR_Trend] !== Trend.WVI_Sell &&
            //     paryStock[i - 1][this.aryStokIdx.SAR_BuyLow] < paryStock[i - 1][this.aryStokIdx.Close] &&
            //     paryStock[i][this.aryStokIdx.SAR_BuyLow] >= paryStock[i][this.aryStokIdx.Close]) {
            //     // SAR_SellHiがCloseとGC
            //     paryStock[i][this.aryStokIdx.SAR_Trend] = Trend.WVI_Sell
            //     paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_SellHi]
            // } else if (paryStock[i - 1][this.aryStokIdx.SAR_Trend] !== Trend.WVI_Buy &&
            //     paryStock[i - 1][this.aryStokIdx.SAR_SellHi] > paryStock[i - 1][this.aryStokIdx.Close] &&
            //     paryStock[i][this.aryStokIdx.SAR_SellHi] <= paryStock[i][this.aryStokIdx.Close]) {
            //     paryStock[i][this.aryStokIdx.SAR_Trend] = Trend.WVI_Buy
            //     paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_BuyLow]
            // } else {
            //     paryStock[i][this.aryStokIdx.SAR_Trend] = paryStock[i - 1][this.aryStokIdx.SAR_Trend]
            //     if (paryStock[i][this.aryStokIdx.SAR_Trend] == Trend.WVI_Buy) {
            //         paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_BuyLow]
            //     } else if (paryStock[i][this.aryStokIdx.SAR_Trend] == Trend.WVI_Sell) {
            //         paryStock[i][this.aryStokIdx.SAR] = paryStock[i][this.aryStokIdx.SAR_SellHi]
            //     }
            // }

            // // EMA12
            // this.setEMA(paryStock, 12, i, this.aryStokIdx.Close, this.aryStokIdx.EMA12)
            // // EMA26
            // this.setEMA(paryStock, 26, i, this.aryStokIdx.Close, this.aryStokIdx.EMA26)
            // // MACD
            // paryStock[i][this.aryStokIdx.MACD] = paryStock[i][this.aryStokIdx.EMA12] - paryStock[i][this.aryStokIdx.EMA26]
            // // MACD ｼｸﾞﾅﾙ
            // this.setEMA(paryStock, 9, i, this.aryStokIdx.MACD, this.aryStokIdx.MACDSig)
            // // MACD ﾋｽﾄｸﾞﾗﾑ
            // paryStock[i][this.aryStokIdx.MACDHst] = paryStock[i][this.aryStokIdx.MACD] - paryStock[i][this.aryStokIdx.MACDSig]
            // // MACD ﾄﾚﾝﾄﾞ
            // if (paryStock[i][this.aryStokIdx.MACD] > paryStock[i][this.aryStokIdx.MACDSig]) {
            //     paryStock[i][this.aryStokIdx.MACD_TrendLw] = Trend.MACD_BuyLw
            // } else {
            //     paryStock[i][this.aryStokIdx.MACD_TrendLw] = Trend.MACD_SellLw
            // }
            // // MACD Trend High
            // paryStock[i][this.aryStokIdx.MACD_TrendHi] = Trend.None
            // if (paryStock[i][this.aryStokIdx.MACD] > 0 &&
            //     paryStock[i][this.aryStokIdx.MACDSig] > 0 &&
            //     paryStock[i][this.aryStokIdx.MACDHst] > 0) {
            //     paryStock[i][this.aryStokIdx.MACD_TrendHi] = Trend.MACD_BuyHi
            // }
            // if (paryStock[i][this.aryStokIdx.MACD] < 0 &&
            //     paryStock[i][this.aryStokIdx.MACDSig] < 0 &&
            //     paryStock[i][this.aryStokIdx.MACDHst] < 0) {
            //     paryStock[i][this.aryStokIdx.MACD_TrendHi] = Trend.MACD_SellHi
            // }

            // // DMP
            // // DMM
            // paryStock[i][this.aryStokIdx.DMP] = 0
            // paryStock[i][this.aryStokIdx.DMM] = 0
            // if (i >= 1) {
            //     paryStock[i][this.aryStokIdx.DMP] = paryStock[i][this.aryStokIdx.High] - paryStock[i - 1][this.aryStokIdx.High]
            //     paryStock[i][this.aryStokIdx.DMM] = paryStock[i - 1][this.aryStokIdx.Low] - paryStock[i][this.aryStokIdx.Low]
            //     if (paryStock[i][this.aryStokIdx.DMP] < 0 &&
            //         paryStock[i][this.aryStokIdx.DMM] < 0) {
            //         paryStock[i][this.aryStokIdx.DMP] = 0
            //         paryStock[i][this.aryStokIdx.DMM] = 0
            //     } else {
            //         if (paryStock[i][this.aryStokIdx.DMP] > paryStock[i][this.aryStokIdx.DMM]) {
            //             paryStock[i][this.aryStokIdx.DMM] = 0
            //         }
            //         if (paryStock[i][this.aryStokIdx.DMP] < paryStock[i][this.aryStokIdx.DMM]) {
            //             paryStock[i][this.aryStokIdx.DMP] = 0
            //         }
            //     }
            // }
            // // DIP DIM
            // this.setMMA(paryStock, 14, i, this.aryStokIdx.DMP, this.aryStokIdx.DMP_MMA)
            // this.setMMA(paryStock, 14, i, this.aryStokIdx.DMM, this.aryStokIdx.DMM_MMA)
            // this.setMMA(paryStock, 14, i, this.aryStokIdx.TR, this.aryStokIdx.ATR_MMA)
            // //DI+
            // paryStock[i][this.aryStokIdx.DIP] = paryStock[i][this.aryStokIdx.DMP_MMA] / paryStock[i][this.aryStokIdx.ATR_MMA] * 100
            // //DI-
            // paryStock[i][this.aryStokIdx.DIM] = paryStock[i][this.aryStokIdx.DMM_MMA] / paryStock[i][this.aryStokIdx.ATR_MMA] * 100
            // //DX
            // paryStock[i][this.aryStokIdx.DX] = Math.abs((paryStock[i][this.aryStokIdx.DIP] - paryStock[i][this.aryStokIdx.DIM])) / (paryStock[i][this.aryStokIdx.DIP] + paryStock[i][this.aryStokIdx.DIM]) * 100
            // //ADX
            // this.setMMA(paryStock, 14, i, this.aryStokIdx.DX, this.aryStokIdx.ADX)
            // // 標準偏差
            // this.setStdDev(paryStock, 26, i, this.aryStokIdx.Close, this.aryStokIdx.StdDev)
            // // 20日移動平均線(ﾎﾞﾘﾝｼﾞｬｰﾊﾞﾝﾄﾞ基準線)
            // this.setSMA(paryStock, 20, i, this.aryStokIdx.Close, this.aryStokIdx.SMA20)
            // // ﾎﾞﾘﾝｼﾞｬｰﾊﾞﾝﾄﾞ +0.6σ
            // paryStock[i][this.aryStokIdx.BBP06Sig] = paryStock[i][this.aryStokIdx.SMA20] + paryStock[i][this.aryStokIdx.StdDev] * 0.6
            // // ﾎﾞﾘﾝｼﾞｬｰﾊﾞﾝﾄﾞ -0.6σ
            // paryStock[i][this.aryStokIdx.BBM06Sig] = paryStock[i][this.aryStokIdx.SMA20] - paryStock[i][this.aryStokIdx.StdDev] * 0.6
            // // 利食いﾗｲﾝ
            // paryStock[i][this.aryStokIdx.ProfLine] = paryStock[i][this.aryStokIdx.SIP_Max] - paryStock[i][this.aryStokIdx.ATR] * 1.5
            // // 標準ﾎﾞﾗﾃｨﾘﾃｨﾄﾚｰﾄﾞﾓﾃﾞﾙ
            // paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.None
            // if (i > 0) {
            //     if (paryStock[i][this.aryStokIdx.StdDev] >= paryStock[i - 1][this.aryStokIdx.StdDev] &&
            //         paryStock[i][this.aryStokIdx.ADX] >= paryStock[i - 1][this.aryStokIdx.ADX] &&
            //         paryStock[i][this.aryStokIdx.Close] >= (paryStock[i][this.aryStokIdx.SMA20] + paryStock[i][this.aryStokIdx.StdDev] * K_STDBOL)) {
            //         paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Buy
            //     } else if (paryStock[i][this.aryStokIdx.StdDev] >= paryStock[i - 1][this.aryStokIdx.StdDev] &&
            //         paryStock[i][this.aryStokIdx.ADX] >= paryStock[i - 1][this.aryStokIdx.ADX] &&
            //         paryStock[i][this.aryStokIdx.Close] <= (paryStock[i][this.aryStokIdx.SMA20] - paryStock[i][this.aryStokIdx.StdDev] * K_STDBOL)) {
            //         paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Sell
            //     } else if (paryStock[i - 1][this.aryStokIdx.StdBolaTrend] == Trend.StdVola_Buy &&
            //         paryStock[i][this.aryStokIdx.Close] >= (paryStock[i][this.aryStokIdx.SMA20] + paryStock[i][this.aryStokIdx.StdDev] * K_STDBOL)) {
            //         paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Buy
            //     } else if (paryStock[i - 1][this.aryStokIdx.StdBolaTrend] == Trend.StdVola_Sell &&
            //         paryStock[i][this.aryStokIdx.Close] <= (paryStock[i][this.aryStokIdx.SMA20] - paryStock[i][this.aryStokIdx.StdDev] * K_STDBOL)) {
            //         paryStock[i][this.aryStokIdx.StdBolaTrend] = Trend.StdVola_Sell
            //     }
            // }
            // // ｽﾄｷｬｽ K値用 直近N日間の安値
            // this.setMMin(paryStock, 5, i, this.aryStokIdx.Low, this.aryStokIdx.StcKLw)
            // // ｽﾄｷｬｽ K値用 直近N日間の高値
            // this.setMMax(paryStock, 5, i, this.aryStokIdx.High, this.aryStokIdx.StcKHi)
            // // ｽﾄｷｬｽ K値 (当日終値 - 直近N日間の安値)
            // paryStock[i][this.aryStokIdx.StcKLwDiff] = paryStock[i][this.aryStokIdx.Close] - paryStock[i][this.aryStokIdx.StcKLw]
            // // ｽﾄｷｬｽ K値 (直近N日間の高値 - 直近N日間の安値)
            // paryStock[i][this.aryStokIdx.StcKHiDiff] = paryStock[i][this.aryStokIdx.StcKHi] - paryStock[i][this.aryStokIdx.StcKLw]
            // // ｽﾄｷｬｽ K値
            // paryStock[i][this.aryStokIdx.StcK] = paryStock[i][this.aryStokIdx.StcKLwDiff] / paryStock[i][this.aryStokIdx.StcKHiDiff] * 100
            // // ｽﾄｷｬｽ D値 (当日終値 - 直近N日間の安値)の単純移動平均
            // this.setSMA(paryStock, 3, i, this.aryStokIdx.StcKLwDiff, this.aryStokIdx.StcKLwDiffSMA)
            // // ｽﾄｷｬｽ D値 (直近N日間の高値 - 直近N日間の安値)の単純移動平均
            // this.setSMA(paryStock, 3, i, this.aryStokIdx.StcKHiDiff, this.aryStokIdx.StcKHiDiffSMA)
            // // ｽﾄｷｬｽ D値
            // paryStock[i][this.aryStokIdx.StcD] = paryStock[i][this.aryStokIdx.StcKLwDiffSMA] / paryStock[i][this.aryStokIdx.StcKHiDiffSMA] * 100
            // // EMA200
            // this.setEMA(paryStock, 120, i, this.aryStokIdx.Close, this.aryStokIdx.EMA200)
            // // ｽﾄｷｬｽ反転ｻｲﾝ
            // paryStock[i][this.aryStokIdx.StcasSignal] = ""
            // if (i >= 120) {
            //     if (paryStock[i - 1][this.aryStokIdx.StcK] >= 80 &&
            //         paryStock[i - 1][this.aryStokIdx.StcD] >= 80 &&
            //         paryStock[i - 1][this.aryStokIdx.StcK] > paryStock[i - 1][this.aryStokIdx.StcD] &&
            //         paryStock[i][this.aryStokIdx.StcK] <= paryStock[i][this.aryStokIdx.StcD] &&
            //         paryStock[i][this.aryStokIdx.Close] < paryStock[i][this.aryStokIdx.EMA200]) {
            //         paryStock[i][this.aryStokIdx.StcasSignal] = Trend.Stcas_Sell
            //     } else if (paryStock[i - 1][this.aryStokIdx.StcK] <= 20 &&
            //         paryStock[i - 1][this.aryStokIdx.StcD] <= 20 &&
            //         paryStock[i - 1][this.aryStokIdx.StcK] < paryStock[i - 1][this.aryStokIdx.StcD] &&
            //         paryStock[i][this.aryStokIdx.StcK] >= paryStock[i][this.aryStokIdx.StcD] &&
            //         paryStock[i][this.aryStokIdx.Close] > paryStock[i][this.aryStokIdx.EMA200]) {
            //         paryStock[i][this.aryStokIdx.StcasSignal] = Trend.Stcas_Buy
            //     }
            // }
        }
    }
    //*************************************************/
    //   単純移動平均
    //*************************************************/
    , setSMA: function (pAry, pSpent, idx, pTgtIdx, pCalcedIdx) {
        let tmpSum = 0
        if (idx < pSpent - 1) {
            pAry[idx][pCalcedIdx] = -1
        } else {
            for (j = idx - pSpent + 1; j <= idx; j++) {
                tmpSum += pAry[j][pTgtIdx]
            }
            pAry[idx][pCalcedIdx] = tmpSum / pSpent
        }
    }
    //*************************************************/
    //   修正移動平均 ModifiedMovingAverage
    //*************************************************/
    , setMMA: function (pAry, pSpent, idx, pTgtIdx, pCalcedIdx) {
        let tmpSum = 0
        if (idx < pSpent - 2) {
            pAry[idx][pCalcedIdx] = -1
        } else if (idx == pSpent - 2) {
            this.setSMA(pAry, pSpent - 1, idx, pTgtIdx, pCalcedIdx)
        } else {
            tmpSum = (pSpent - 1) * pAry[idx - 1][pCalcedIdx] + pAry[idx][pTgtIdx]
            pAry[i][pCalcedIdx] = tmpSum / pSpent
        }
    }
    //*************************************************/
    //   指数平滑移動平均 Exponential Moving Average
    //*************************************************/
    , setEMA: function (pAry, pSpent, idx, pTgtIdx, pCalcedIdx) {
        let tmpSum = 0
        let tmpK = 0
        if (idx < pSpent - 2) {
            pAry[idx][pCalcedIdx] = -1
        } else if (idx == pSpent - 2) {
            this.setSMA(pAry, pSpent - 1, idx, pTgtIdx, pCalcedIdx)
        } else {
            tmpK = 2 / (pSpent + 1)
            tmpSum = pAry[idx - 1][pCalcedIdx] + tmpK * (pAry[idx][pTgtIdx] - pAry[idx - 1][pCalcedIdx])
            pAry[i][pCalcedIdx] = tmpSum
        }
    }
    //*************************************************/
    //   TrueRange
    //*************************************************/
    , setTR: function (pAry, idx) {
        // 今日の高値 - 今日の安値
        // 今日の高値 - 昨日の終値
        // 昨日の終値 - 今日の安値　の最大値
        let tmpTR = -1
        let tmpTR1 = -1
        let tmpTR2 = -1
        let tmpTR3 = -1
        if (idx >= 1) {
            tmpTR1 = pAry[idx][this.aryStokIdx.High] - pAry[idx][this.aryStokIdx.Low]
            tmpTR2 = pAry[idx][this.aryStokIdx.High] - pAry[idx - 1][this.aryStokIdx.Close]
            tmpTR3 = pAry[idx - 1][this.aryStokIdx.Close] - pAry[idx][this.aryStokIdx.Low]
            tmpTR = Math.max.apply(null, [tmpTR1, tmpTR2, tmpTR3]);
        } else {
            tmpTR = -1
        }
        pAry[idx][this.aryStokIdx.TR] = tmpTR
    }
    //*************************************************/
    //   移動最大(Moving Max)
    //*************************************************/
    , setMMax: function (pAry, pSpent, idx, pTgtIdx, pCalcedIdx) {
        let tmpStart = 0
        let tmpSIP_Max = -1
        //Math.max.apply(null, [tmpTR1,tmpTR2,tmpTR3]);
        if (idx > pSpent - 1) {
            tmpStart = idx - pSpent + 1
        }
        for (var i = tmpStart; i <= idx; i++) {
            if (pAry[i][pTgtIdx] > tmpSIP_Max) {
                tmpSIP_Max = pAry[i][pTgtIdx]
            }
        }
        pAry[idx][pCalcedIdx] = tmpSIP_Max
    }
    //*************************************************/
    //   移動最小(Moving Min)
    //*************************************************/
    , setMMin: function (pAry, pSpent, idx, pTgtIdx, pCalcedIdx) {
        let tmpStart = 0
        let tmpSIP_Max = Number.MAX_VALUE
        //Math.max.apply(null, [tmpTR1,tmpTR2,tmpTR3]);
        if (idx > pSpent - 1) {
            tmpStart = idx - pSpent + 1
        }
        for (var i = tmpStart; i <= idx; i++) {
            if (pAry[i][pTgtIdx] < tmpSIP_Max) {
                tmpSIP_Max = pAry[i][pTgtIdx]
            }
        }
        pAry[idx][pCalcedIdx] = tmpSIP_Max
    }
    //*************************************************/
    //   標準偏差(Standard Devition)
    //*************************************************/
    , setStdDev: function (pAry, pSpent, idx, pTgtIdx, pCalcedIdx) {
        let tmpSma = 0 //単純平均
        let tmpBunsan = 0 //分散(偏差の2乗の合計をﾃﾞｰﾀ数で割ったもの)
        if (idx < pSpent - 1) {
            pAry[idx][pCalcedIdx] = -1
        } else {
            for (j = idx - pSpent + 1; j <= idx; j++) {
                tmpSma += pAry[j][pTgtIdx]
            }
            tmpSma = tmpSma / pSpent
            for (j = idx - pSpent + 1; j <= idx; j++) {
                tmpBunsan += Math.pow(pAry[j][pTgtIdx] - tmpSma, 2)
            }
            tmpBunsan = tmpBunsan / pSpent
            pAry[idx][pCalcedIdx] = Math.sqrt(tmpBunsan)
        }
    }
    //*************************************************/
    //   買いポジ
    //*************************************************/
    , isBuying: function (pAry, pIdx, pBuyIdx, pSellIdx) {
        let bolRet = false
        for (j = pIdx - 1; j > 0; j--) {
            if (pAry[j][pSellIdx] > 0) {
                bolRet = false
                break
            } else {
                if (pAry[j][pBuyIdx] > 0) {
                    bolRet = true
                    break
                }
            }
        }
        return bolRet
    }
    //*************************************************/
    //   当該トレンドでボジを取ったか否か
    //*************************************************/
    , isNoPosiThisTrend: function (pAry, pIdx, pBuyIdx, pPosiIdx, pTrend) {
        let bolRet = true
        for (j = pIdx - 1; j > 0; j--) {
            if (pAry[j][pBuyIdx] == pTrend) {
                //同じﾄﾚﾝﾄﾞ
                if (pAry[j][pPosiIdx] > 0) {
                    // ﾎﾟｼﾞｱﾘ
                    bolRet = false
                    break
                }
            } else {
                break
            }
        }
        return bolRet
    }
    //*************************************************/
    //   バックテスト
    // ----------------------------------------
    //*************************************************/
    , BackTest: function (paryStock, pintBuyFlgIdx, pintSellFlgIdx) {
        //累計初期化
        paryStock[1][this.aryStokIdx.BT_SellProfTtl] = 0
        paryStock[1][this.aryStokIdx.BT_SellNextProfTtl] = 0

        //全行ループ
        let bolHit = false
        for (i = 1; i < paryStock.length; i++) {
            if (paryStock[i][pintBuyFlgIdx] > 0) {
                bolHit = false
                for (j = i + 1; j < paryStock.length; j++) {
                    if (paryStock[j][pintSellFlgIdx] > 0) {
                        // console.log(i + ":" + j)
                        bolHit = true
                        paryStock[i][this.aryStokIdx.BT_SellYmd] = paryStock[j][this.aryStokIdx.YMD]
                        paryStock[i][this.aryStokIdx.BT_SellClose] = paryStock[j][this.aryStokIdx.Close]
                        paryStock[i][this.aryStokIdx.BT_SellProf] = paryStock[j][this.aryStokIdx.Close] - paryStock[i][this.aryStokIdx.Close]
                        if (j < paryStock.length - 1) {
                            paryStock[i][this.aryStokIdx.BT_SellNextYmd] = paryStock[j + 1][this.aryStokIdx.YMD]
                            paryStock[i][this.aryStokIdx.BT_SellNextOpen] = paryStock[j + 1][this.aryStokIdx.Open]
                            paryStock[i][this.aryStokIdx.BT_SellNextProf] = paryStock[j + 1][this.aryStokIdx.Open] - paryStock[i][this.aryStokIdx.Close]
                        }
                        break
                    }
                }
                if (!bolHit) {
                    paryStock[i][this.aryStokIdx.BT_SellYmd] = paryStock[paryStock.length - 1][this.aryStokIdx.YMD]
                    paryStock[i][this.aryStokIdx.BT_SellClose] = paryStock[paryStock.length - 1][this.aryStokIdx.Close]
                    paryStock[i][this.aryStokIdx.BT_SellProf] = paryStock[paryStock.length - 1][this.aryStokIdx.Close] - paryStock[i][this.aryStokIdx.Close]
                    paryStock[i][this.aryStokIdx.BT_SellNextYmd] = paryStock[paryStock.length - 1][this.aryStokIdx.YMD]
                    paryStock[i][this.aryStokIdx.BT_SellNextOpen] = paryStock[paryStock.length - 1][this.aryStokIdx.Close]
                    paryStock[i][this.aryStokIdx.BT_SellNextProf] = paryStock[paryStock.length - 1][this.aryStokIdx.Close] - paryStock[i][this.aryStokIdx.Close]
                }
            }

            //累計
            if (i > 1) {
                // 一つ前の行の値をコピー
                paryStock[i][this.aryStokIdx.BT_SellProfTtl] = paryStock[i - 1][this.aryStokIdx.BT_SellProfTtl]
                paryStock[i][this.aryStokIdx.BT_SellNextProfTtl] = paryStock[i - 1][this.aryStokIdx.BT_SellNextProfTtl]
                if (paryStock[i][pintBuyFlgIdx] > 0) {
                    paryStock[i][this.aryStokIdx.BT_SellProfTtl] = paryStock[i][this.aryStokIdx.BT_SellProfTtl] + paryStock[i][this.aryStokIdx.BT_SellProf]
                    paryStock[i][this.aryStokIdx.BT_SellNextProfTtl] = paryStock[i][this.aryStokIdx.BT_SellNextProfTtl] + paryStock[i][this.aryStokIdx.BT_SellNextProf]
                }
            }
        }
    }
    //*************************************************/
    //   ダミーデータ
    // ----------------------------------------
    //*************************************************/
    , getStrockAryDummy: function () {
        return '{"chart":{"result":[{"meta":{"currency":"JPY","symbol":"^N225","exchangeName":"OSA","instrumentType":"INDEX","firstTradeDate":-157420800,"regularMarketTime":1611022260,"gmtoffset":32400,"timezone":"JST","exchangeTimezoneName":"Asia/Tokyo","regularMarketPrice":28601.95,"chartPreviousClose":22191.18,"priceHint":2,"currentTradingPeriod":{"pre":{"timezone":"JST","start":1611014400,"end":1611014400,"gmtoffset":32400},"regular":{"timezone":"JST","start":1611014400,"end":1611036000,"gmtoffset":32400},"post":{"timezone":"JST","start":1611036000,"end":1611036000,"gmtoffset":32400}},"dataGranularity":"1d","range":"","validRanges":["1d","5d","1mo","3mo","6mo","1y","2y","5y","10y","ytd","max"]},"timestamp":[1524182400,1524441600,1524528000,1524614400,1524700800,1524787200,1525046400,1525132800,1525219200,1525305600,1525392000,1525651200,1525737600,1525824000,1525910400,1525996800,1526256000,1526342400,1526428800,1526515200,1526601600,1526860800,1526947200,1527033600,1527120000,1527206400,1527465600,1527552000,1527638400,1527724800,1527811200,1528070400,1528156800,1528243200,1528329600,1528416000,1528675200,1528761600,1528848000,1528934400,1529020800,1529280000,1529366400,1529452800,1529539200,1529625600,1529884800,1529971200,1530057600,1530144000,1530230400,1530489600,1530576000,1530662400,1530748800,1530835200,1531094400,1531180800,1531267200,1531353600,1531440000,1531699200,1531785600,1531872000,1531958400,1532044800,1532304000,1532390400,1532476800,1532563200,1532649600,1532908800,1532995200,1533081600,1533168000,1533254400,1533513600,1533600000,1533686400,1533772800,1533859200,1534118400,1534204800,1534291200,1534377600,1534464000,1534723200,1534809600,1534896000,1534982400,1535068800,1535328000,1535414400,1535500800,1535587200,1535673600,1535932800,1536019200,1536105600,1536192000,1536278400,1536537600,1536624000,1536710400,1536796800,1536883200,1537142400,1537228800,1537315200,1537401600,1537488000,1537747200,1537833600,1537920000,1538006400,1538092800,1538352000,1538438400,1538524800,1538611200,1538697600,1538956800,1539043200,1539129600,1539216000,1539302400,1539561600,1539648000,1539734400,1539820800,1539907200,1540166400,1540252800,1540339200,1540425600,1540512000,1540771200,1540857600,1540944000,1541030400,1541116800,1541376000,1541462400,1541548800,1541635200,1541721600,1541980800,1542067200,1542153600,1542240000,1542326400,1542585600,1542672000,1542758400,1542844800,1542931200,1543190400,1543276800,1543363200,1543449600,1543536000,1543795200,1543881600,1543968000,1544054400,1544140800,1544400000,1544486400,1544572800,1544659200,1544745600,1545004800,1545091200,1545177600,1545264000,1545350400,1545609600,1545696000,1545782400,1545868800,1545955200,1546214400,1546560000,1546819200,1546905600,1546992000,1547078400,1547164800,1547510400,1547596800,1547683200,1547769600,1548028800,1548115200,1548201600,1548288000,1548374400,1548633600,1548720000,1548806400,1548892800,1548979200,1549238400,1549324800,1549411200,1549497600,1549584000,1549929600,1550016000,1550102400,1550188800,1550448000,1550534400,1550620800,1550707200,1550793600,1551052800,1551139200,1551225600,1551312000,1551398400,1551657600,1551744000,1551830400,1551916800,1552003200,1552262400,1552348800,1552435200,1552521600,1552608000,1552867200,1552953600,1553040000,1553212800,1553472000,1553558400,1553644800,1553731200,1553817600,1554076800,1554163200,1554249600,1554336000,1554422400,1554681600,1554768000,1554854400,1554940800,1555027200,1555286400,1555372800,1555459200,1555545600,1555632000,1555891200,1555977600,1556064000,1556150400,1556236800,1557187200,1557273600,1557360000,1557446400,1557705600,1557792000,1557878400,1557964800,1558051200,1558310400,1558396800,1558483200,1558569600,1558656000,1558915200,1559001600,1559088000,1559174400,1559260800,1559520000,1559606400,1559692800,1559779200,1559865600,1560124800,1560211200,1560297600,1560384000,1560470400,1560729600,1560816000,1560902400,1560988800,1561075200,1561334400,1561420800,1561507200,1561593600,1561680000,1561939200,1562025600,1562112000,1562198400,1562284800,1562544000,1562630400,1562716800,1562803200,1562889600,1563235200,1563321600,1563408000,1563494400,1563753600,1563840000,1563926400,1564012800,1564099200,1564358400,1564444800,1564531200,1564617600,1564704000,1564963200,1565049600,1565136000,1565222400,1565308800,1565654400,1565740800,1565827200,1565913600,1566172800,1566259200,1566345600,1566432000,1566518400,1566777600,1566864000,1566950400,1567036800,1567123200,1567382400,1567468800,1567555200,1567641600,1567728000,1567987200,1568073600,1568160000,1568246400,1568332800,1568678400,1568764800,1568851200,1568937600,1569283200,1569369600,1569456000,1569542400,1569801600,1569888000,1569974400,1570060800,1570147200,1570406400,1570492800,1570579200,1570665600,1570752000,1571097600,1571184000,1571270400,1571356800,1571616000,1571788800,1571875200,1571961600,1572220800,1572307200,1572393600,1572480000,1572566400,1572912000,1572998400,1573084800,1573171200,1573430400,1573516800,1573603200,1573689600,1573776000,1574035200,1574121600,1574208000,1574294400,1574380800,1574640000,1574726400,1574812800,1574899200,1574985600,1575244800,1575331200,1575417600,1575504000,1575590400,1575849600,1575936000,1576022400,1576108800,1576195200,1576454400,1576540800,1576627200,1576713600,1576800000,1577059200,1577145600,1577232000,1577318400,1577404800,1577664000,1578268800,1578355200,1578441600,1578528000,1578614400,1578960000,1579046400,1579132800,1579219200,1579478400,1579564800,1579651200,1579737600,1579824000,1580083200,1580169600,1580256000,1580342400,1580428800,1580688000,1580774400,1580860800,1580947200,1581033600,1581292800,1581465600,1581552000,1581638400,1581897600,1581984000,1582070400,1582156800,1582243200,1582588800,1582675200,1582761600,1582848000,1583107200,1583193600,1583280000,1583366400,1583452800,1583712000,1583798400,1583884800,1583971200,1584057600,1584316800,1584403200,1584489600,1584576000,1584921600,1585008000,1585094400,1585180800,1585267200,1585526400,1585612800,1585699200,1585785600,1585872000,1586131200,1586217600,1586304000,1586390400,1586476800,1586736000,1586822400,1586908800,1586995200,1587081600,1587340800,1587427200,1587513600,1587600000,1587686400,1587945600,1588032000,1588204800,1588291200,1588809600,1588896000,1589155200,1589241600,1589328000,1589414400,1589500800,1589760000,1589846400,1589932800,1590019200,1590105600,1590364800,1590451200,1590537600,1590624000,1590710400,1590969600,1591056000,1591142400,1591228800,1591315200,1591574400,1591660800,1591747200,1591833600,1591920000,1592179200,1592265600,1592352000,1592438400,1592524800,1592784000,1592870400,1592956800,1593043200,1593129600,1593388800,1593475200,1593561600,1593648000,1593734400,1593993600,1594080000,1594166400,1594252800,1594339200,1594598400,1594684800,1594771200,1594857600,1594944000,1595203200,1595289600,1595376000,1595808000,1595894400,1595980800,1596067200,1596153600,1596412800,1596499200,1596585600,1596672000,1596758400,1597104000,1597190400,1597276800,1597363200,1597622400,1597708800,1597795200,1597881600,1597968000,1598227200,1598313600,1598400000,1598486400,1598572800,1598832000,1598918400,1599004800,1599091200,1599177600,1599436800,1599523200,1599609600,1599696000,1599782400,1600041600,1600128000,1600214400,1600300800,1600387200,1600819200,1600905600,1600992000,1601251200,1601337600,1601424000,1601596800,1601856000,1601942400,1602028800,1602115200,1602201600,1602460800,1602547200,1602633600,1602720000,1602806400,1603065600,1603152000,1603238400,1603324800,1603411200,1603670400,1603756800,1603843200,1603929600,1604016000,1604275200,1604448000,1604534400,1604620800,1604880000,1604966400,1605052800,1605139200,1605225600,1605484800,1605571200,1605657600,1605744000,1605830400,1606176000,1606262400,1606348800,1606435200,1606694400,1606780800,1606867200,1606953600,1607040000,1607299200,1607385600,1607472000,1607558400,1607644800,1607904000,1607990400,1608076800,1608163200,1608249600,1608508800,1608595200,1608681600,1608768000,1608854400,1609113600,1609200000,1609286400,1609718400,1609804800,1609891200,1609977600,1610064000,1610409600,1610496000,1610582400],"indicators":{"quote":[{"high":[22261.349609375,22204.859375,22304.689453125,22228.779296875,22381.66015625,22495.560546875,null,22519.44921875,22568.189453125,null,null,22513.48046875,22566.6796875,22478.640625,22530.640625,22769.16015625,22894.759765625,22912.060546875,22796.140625,22887.029296875,22954.189453125,23050.390625,23031.669921875,22949.73046875,22644.689453125,22509.359375,22547.669921875,22439.099609375,22079.23046875,22254.419921875,22316.91015625,22515.720703125,22602.130859375,22662.8203125,22856.369140625,22879.0,22856.080078125,23011.5703125,22993.259765625,22898.390625,22885.83984375,22806.890625,22618.51953125,22581.400390625,22782.009765625,22535.650390625,22556.55078125,22368.779296875,22356.5390625,22299.390625,22332.8203125,22312.25,21927.810546875,21784.0,21751.5,21866.16015625,22105.94921875,22321.599609375,22044.619140625,22233.51953125,22692.859375,22692.859375,22832.220703125,22949.3203125,22926.470703125,22869.98046875,22507.169921875,22555.05078125,22645.66015625,22717.150390625,22712.75,22631.3203125,22678.060546875,22775.470703125,22754.73046875,22613.5,22635.6796875,22666.6796875,22800.609375,22648.880859375,22608.859375,22124.599609375,22356.080078125,22380.279296875,22240.419921875,22340.94921875,22288.310546875,22306.830078125,22390.19921875,22463.029296875,22602.240234375,22838.060546875,23006.76953125,22968.1796875,23032.169921875,22890.609375,22820.48046875,22753.1796875,22692.25,22535.33984375,22372.890625,22396.880859375,22667.849609375,22709.369140625,22858.41015625,23105.279296875,null,23481.529296875,23842.05078125,23781.75,23971.41015625,null,23950.98046875,24033.7890625,24089.3203125,24286.099609375,24306.5390625,24448.0703125,24260.630859375,24247.8203125,23928.619140625,null,23587.05078125,23589.380859375,23051.189453125,22711.130859375,22520.58984375,22549.240234375,22959.41015625,22873.130859375,22551.669921875,22672.25,22410.150390625,22207.08984375,21703.2109375,21476.66015625,21465.990234375,21568.400390625,21920.4609375,21906.41015625,22308.419921875,22051.650390625,22160.830078125,22444.650390625,22583.4296875,22494.580078125,22324.009765625,21892.2890625,21990.41015625,21818.73046875,21873.740234375,21852.919921875,21687.119140625,21555.609375,21684.640625,null,21838.099609375,22006.830078125,22216.98046875,22437.94921875,22362.19921875,22698.7890625,22576.619140625,21979.1796875,21805.01953125,21734.939453125,21365.779296875,21279.01953125,21631.470703125,21871.33984375,21751.310546875,21563.26953125,21330.359375,21168.619140625,20841.33984375,20334.73046875,null,19785.4296875,19530.349609375,20211.5703125,20084.380859375,null,19692.580078125,20266.220703125,20347.919921875,20494.349609375,20345.919921875,20389.890625,20571.279296875,20580.25,20571.75,20682.119140625,20892.6796875,20805.9296875,20686.2890625,20620.720703125,20844.310546875,20759.48046875,20673.66015625,20706.26953125,20869.419921875,20929.630859375,20922.580078125,20981.23046875,20971.66015625,20844.76953125,20562.390625,20885.880859375,21213.740234375,21235.619140625,21051.509765625,21306.359375,21344.169921875,21494.849609375,21553.349609375,21451.23046875,21590.029296875,21610.880859375,21578.810546875,21536.55078125,21641.580078125,21860.390625,21798.380859375,21684.599609375,21472.16015625,21359.3203125,21145.939453125,21568.48046875,21474.169921875,21522.75,21521.6796875,21612.669921875,21585.55078125,21614.169921875,21713.259765625,21275.4296875,21460.990234375,21388.58984375,21191.3203125,21267.25,21682.939453125,21744.640625,21722.720703125,21787.599609375,21839.1796875,21900.55078125,21811.880859375,21687.5703125,21721.419921875,21878.779296875,22211.029296875,22261.330078125,22345.189453125,22305.630859375,22250.369140625,22280.189453125,22268.369140625,22362.919921875,22334.689453125,22270.2890625,22190.490234375,21639.119140625,21559.759765625,21584.08984375,21277.66015625,21077.48046875,21191.529296875,21153.19921875,21398.849609375,21430.060546875,21318.80078125,21404.5390625,21209.560546875,21117.220703125,21232.380859375,21297.69921875,21071.73046875,20942.529296875,20823.099609375,20438.029296875,20464.5703125,20800.640625,20842.279296875,20907.76953125,21166.119140625,21227.1796875,21259.69921875,21111.23046875,21119.73046875,21185.25,21153.650390625,21358.720703125,21491.390625,21497.8203125,21317.859375,21313.76953125,21129.640625,21338.169921875,21324.9296875,21758.33984375,21784.220703125,21708.720703125,21755.630859375,21746.380859375,21672.650390625,21687.2890625,21601.859375,21649.9296875,21720.140625,21655.51953125,21488.26953125,21347.83984375,21474.30078125,21445.029296875,21686.529296875,21744.880859375,21823.0703125,21709.740234375,21652.94921875,21792.98046875,21589.109375,21556.689453125,21211.060546875,20941.830078125,20607.830078125,20570.189453125,20682.240234375,20782.060546875,20503.380859375,20697.419921875,20419.880859375,20465.7109375,20633.900390625,20684.060546875,20626.05078125,20731.189453125,20719.310546875,20329.009765625,20529.939453125,20511.2109375,20520.6796875,20748.349609375,20667.560546875,20662.23046875,20694.349609375,21164.609375,21241.2890625,21333.509765625,21438.349609375,21619.2109375,21825.919921875,22019.66015625,22041.080078125,22027.859375,22255.560546875,22204.75,22168.740234375,22036.48046875,22184.91015625,21955.7890625,21811.98046875,21938.76953125,21795.009765625,21437.740234375,21410.19921875,21475.279296875,21629.240234375,21467.76953125,21601.4609375,21820.76953125,22219.630859375,22615.470703125,22522.390625,22649.849609375,22581.279296875,22648.810546875,22780.990234375,22819.919921875,22896.220703125,23008.4296875,22961.23046875,22988.80078125,22852.720703125,23328.51953125,23352.560546875,23336.0,23591.08984375,23471.8203125,23545.69921875,23452.630859375,23360.060546875,23340.76953125,23420.619140625,23389.529296875,23303.169921875,23108.080078125,23219.509765625,23347.1796875,23608.060546875,23507.8203125,23482.3203125,23498.76953125,23562.05078125,23388.1796875,23203.76953125,23363.439453125,23412.48046875,23544.310546875,23449.470703125,23438.4296875,23468.150390625,24050.0390625,24036.30078125,24091.119140625,24046.08984375,23945.529296875,23908.76953125,23923.08984375,23853.560546875,23824.849609375,23931.509765625,23967.1796875,23782.490234375,23365.359375,23577.439453125,23303.2109375,23767.08984375,23903.2890625,24059.859375,23997.390625,23975.380859375,24115.94921875,24108.109375,24081.75,24040.869140625,23910.009765625,23869.380859375,23463.890625,23243.359375,23392.609375,23318.5703125,23421.58984375,23023.73046875,23118.130859375,23414.689453125,23995.369140625,23943.44921875,23788.25,23869.73046875,23908.849609375,23738.419921875,23561.98046875,23402.009765625,23468.560546875,23806.560546875,23588.55078125,22950.23046875,22456.55078125,22272.259765625,21528.130859375,21593.109375,21719.779296875,21245.9296875,21399.869140625,21061.19921875,20347.189453125,19970.349609375,19974.830078125,19142.1796875,18184.4609375,17785.759765625,17557.0390625,17396.83984375,17160.970703125,17049.029296875,18100.390625,19564.380859375,19240.2890625,19389.4296875,19084.970703125,19336.189453125,18784.25,18132.0390625,18059.150390625,18672.259765625,19162.51953125,19454.33984375,19406.9609375,19500.0703125,19355.0390625,19705.990234375,19660.6796875,19362.169921875,19922.0703125,19784.380859375,19529.060546875,19137.94921875,19429.439453125,19352.240234375,19819.060546875,19841.779296875,20365.890625,20000.25,19720.869140625,20179.08984375,20534.880859375,20457.369140625,20329.890625,20185.0,20198.25,20197.58984375,20659.4609375,20684.4609375,20734.91015625,20615.119140625,20741.650390625,21328.33984375,21475.6796875,21926.2890625,21955.439453125,22161.390625,22401.7890625,22818.869140625,22907.919921875,22865.880859375,23178.099609375,23185.849609375,23175.8203125,22939.390625,22350.30078125,22251.830078125,22624.140625,22536.380859375,22432.25,22523.66015625,22575.740234375,22693.890625,22663.2890625,22423.41015625,22589.140625,22281.380859375,22448.30078125,22360.310546875,22267.509765625,22312.439453125,22734.109375,22742.279296875,22667.94921875,22679.080078125,22563.6796875,22784.740234375,22677.01953125,22965.560546875,22925.900390625,22857.8203125,22788.529296875,22925.580078125,22855.310546875,22741.130859375,22842.189453125,22584.869140625,22506.599609375,22295.05078125,22214.58984375,22603.8203125,22554.19921875,22587.75,22436.16015625,22760.869140625,22874.369140625,23316.689453125,23338.7890625,23248.75,23128.1796875,23149.849609375,23078.359375,23135.4296875,23012.7109375,23431.0390625,23348.80078125,23323.0703125,23376.130859375,23342.3203125,23206.66015625,23287.400390625,23580.509765625,23257.689453125,23218.220703125,23277.66015625,23059.01953125,23250.310546875,23412.9296875,23582.2109375,23477.859375,23506.44921875,23446.390625,23398.4609375,23370.130859375,23234.720703125,23272.669921875,23516.0390625,23622.740234375,23522.380859375,23365.580078125,23377.4296875,23441.16015625,23432.73046875,23701.76953125,23725.580078125,23597.91015625,23667.900390625,23656.69921875,23581.16015625,23538.740234375,23707.16015625,23674.869140625,23702.30078125,23555.779296875,23587.900390625,23572.599609375,23485.80078125,23451.029296875,23374.099609375,23320.7109375,23370.91015625,23801.880859375,24112.419921875,24389.0,24962.80078125,25279.939453125,25401.30078125,25587.9609375,25456.1796875,25928.1796875,26057.30078125,25882.140625,25650.859375,25555.369140625,26261.779296875,26706.419921875,26560.029296875,26672.400390625,26834.19921875,26852.16015625,26889.900390625,26868.08984375,26799.830078125,26894.25,26523.30078125,26826.779296875,26852.76953125,26819.41015625,26870.470703125,26736.83984375,26874.98046875,26843.05078125,26824.2890625,26905.669921875,26639.990234375,26585.2109375,26764.529296875,26716.609375,26854.029296875,27602.51953125,27572.5703125,27602.109375,27279.779296875,27196.400390625,27624.73046875,28139.029296875,28287.369140625,28503.4296875,28979.529296875],"open":[22148.220703125,22157.880859375,22228.8203125,22118.619140625,22278.76953125,22466.66015625,null,22453.419921875,22568.189453125,null,null,22513.220703125,22440.650390625,22463.009765625,22482.509765625,22573.94921875,22705.30078125,22889.470703125,22730.119140625,22820.619140625,22907.19921875,22937.580078125,23025.94921875,22868.7890625,22621.2890625,22380.220703125,22488.94921875,22431.94921875,22051.970703125,22163.400390625,22126.25,22365.08984375,22552.169921875,22520.310546875,22748.720703125,22799.380859375,22686.94921875,22977.220703125,22896.169921875,22842.9609375,22883.240234375,22806.5703125,22565.919921875,22338.529296875,22523.279296875,22456.44921875,22543.560546875,22160.330078125,22320.880859375,22195.189453125,22314.470703125,22233.80078125,21889.060546875,21679.0,21697.439453125,21647.66015625,21838.529296875,22215.33984375,22002.140625,22036.869140625,22397.619140625,22397.619140625,22605.73046875,22917.51953125,22871.619140625,22734.560546875,22480.330078125,22555.05078125,22594.279296875,22711.58984375,22646.48046875,22613.30078125,22472.119140625,22642.1796875,22676.73046875,22585.5390625,22536.05078125,22514.310546875,22666.560546875,22591.5390625,22606.91015625,22117.5703125,22053.0703125,22368.119140625,21980.8203125,22313.189453125,22267.0703125,22110.5390625,22270.0390625,22420.669921875,22484.009765625,22693.689453125,22967.740234375,22820.859375,23020.1796875,22733.25,22819.169921875,22740.05078125,22663.80078125,22458.970703125,22351.83984375,22253.650390625,22469.779296875,22702.7109375,22657.94921875,23035.779296875,null,23042.189453125,23754.9609375,23752.7890625,23848.630859375,null,23881.849609375,23846.599609375,23946.4296875,24080.009765625,24173.369140625,24376.169921875,24219.189453125,24242.060546875,23781.759765625,null,23550.470703125,23538.919921875,23043.369140625,22323.4296875,22501.330078125,22298.19921875,22806.58984375,22871.279296875,22342.0,22374.2109375,22404.140625,22167.759765625,21676.830078125,21440.83984375,21323.609375,21049.51953125,21569.560546875,21906.41015625,21761.580078125,22002.470703125,22018.869140625,22189.740234375,22446.009765625,22471.310546875,22121.69921875,21885.240234375,21851.130859375,21670.349609375,21804.900390625,21679.029296875,21582.689453125,21286.810546875,21582.470703125,null,21647.689453125,21967.98046875,22036.720703125,22360.98046875,22274.970703125,22629.390625,22533.970703125,21755.169921875,21766.5,21643.75,21319.470703125,21273.0390625,21348.400390625,21755.130859375,21638.9609375,21391.73046875,21275.509765625,21107.169921875,20779.9296875,20310.5,null,19785.4296875,19302.58984375,19706.189453125,19957.880859375,null,19655.130859375,19944.609375,20224.669921875,20366.30078125,20270.880859375,20296.44921875,20264.8203125,20575.720703125,20544.23046875,20472.810546875,20848.380859375,20770.060546875,20453.439453125,20506.240234375,20598.640625,20746.2890625,20555.439453125,20701.619140625,20832.91015625,20797.029296875,20831.900390625,20960.470703125,20928.869140625,20812.220703125,20510.5,20442.55078125,21029.9296875,21147.890625,21051.509765625,21217.3203125,21256.580078125,21346.0390625,21422.310546875,21376.359375,21567.66015625,21556.01953125,21504.609375,21536.55078125,21490.01953125,21812.810546875,21712.80078125,21659.029296875,21456.880859375,21339.169921875,21062.75,21361.609375,21425.76953125,21474.580078125,21376.73046875,21576.359375,21558.4296875,21548.650390625,21713.259765625,21267.41015625,21174.33984375,21353.609375,21191.3203125,21228.509765625,21500.890625,21744.640625,21563.640625,21724.689453125,21743.140625,21900.55078125,21750.2890625,21579.6796875,21662.650390625,21782.349609375,22122.970703125,22108.150390625,22236.41015625,22274.130859375,22238.0703125,22188.619140625,22241.740234375,22356.830078125,22183.3203125,22167.48046875,22184.400390625,21628.0390625,21492.91015625,21431.810546875,21180.740234375,20870.76953125,21112.849609375,21153.19921875,21246.859375,21305.970703125,21211.259765625,21373.51953125,21180.240234375,20980.7890625,21148.4609375,21187.169921875,21055.419921875,20881.5,20785.2109375,20327.869140625,20435.859375,20667.890625,20745.83984375,20859.779296875,21095.400390625,21099.5390625,21130.390625,21040.91015625,21049.41015625,21094.9609375,21111.76953125,21223.169921875,21417.740234375,21487.669921875,21223.560546875,21238.0703125,21067.6796875,21156.880859375,21282.220703125,21566.26953125,21699.4296875,21684.0703125,21740.9296875,21703.609375,21665.7890625,21598.150390625,21499.4609375,21547.189453125,21720.140625,21644.380859375,21474.630859375,21336.80078125,21146.5,21394.75,21425.439453125,21726.98046875,21715.94921875,21700.19921875,21627.55078125,21681.8203125,21526.380859375,21361.580078125,21211.060546875,20909.98046875,20325.51953125,20548.0703125,20529.2890625,20758.150390625,20432.6796875,20669.990234375,20324.25,20323.970703125,20590.470703125,20605.349609375,20489.970703125,20706.0703125,20579.98046875,20325.439453125,20467.220703125,20474.310546875,20500.5,20641.490234375,20625.75,20581.580078125,20578.669921875,20800.2890625,21201.830078125,21214.560546875,21363.5703125,21466.66015625,21761.08984375,21907.830078125,21947.58984375,22014.650390625,22064.4609375,22130.740234375,22095.349609375,21961.8203125,22160.51953125,21934.9296875,21793.830078125,21831.439453125,21744.619140625,21422.220703125,21316.1796875,21445.73046875,21494.48046875,21359.83984375,21456.26953125,21749.9296875,22063.7109375,22479.5703125,22451.150390625,22528.560546875,22541.220703125,22619.76953125,22725.439453125,22753.240234375,22854.439453125,22950.7890625,22953.169921875,22910.099609375,22730.490234375,23118.7890625,23343.509765625,23283.140625,23550.0390625,23422.130859375,23336.369140625,23439.25,23325.5,23160.529296875,23304.25,23366.359375,23176.490234375,23071.490234375,23030.330078125,23292.849609375,23451.400390625,23452.849609375,23458.880859375,23497.439453125,23388.630859375,23231.140625,23186.740234375,23292.69921875,23347.669921875,23544.310546875,23372.390625,23421.140625,23449.279296875,23810.560546875,23955.19921875,24091.119140625,24023.26953125,23911.4609375,23893.44921875,23921.2890625,23839.1796875,23813.58984375,23787.69921875,23953.75,23770.9296875,23319.759765625,23320.119140625,23217.490234375,23530.2890625,23813.279296875,23969.0390625,23923.48046875,23960.19921875,24103.44921875,24080.6796875,24072.810546875,23835.490234375,23843.509765625,23850.119140625,23427.900390625,23126.9296875,23309.3203125,23284.580078125,23148.919921875,22874.26953125,22881.130859375,23351.470703125,23641.099609375,23899.009765625,23631.7890625,23741.2109375,23849.759765625,23714.51953125,23489.779296875,23398.5703125,23329.330078125,23666.580078125,23427.76953125,22949.369140625,22374.140625,22255.830078125,21518.009765625,20849.7890625,21651.990234375,20897.19921875,21399.869140625,21009.80078125,20343.310546875,19474.890625,19758.259765625,19064.509765625,18183.470703125,17586.080078125,16726.94921875,17154.080078125,16995.76953125,16570.5703125,17206.880859375,18446.80078125,19234.76953125,19021.970703125,18884.0703125,19181.900390625,18686.119140625,17934.419921875,17951.439453125,17857.990234375,18878.859375,19047.759765625,19376.0,19500.0703125,19312.0390625,19150.30078125,19589.25,19311.30078125,19575.849609375,19689.849609375,19479.830078125,19109.1796875,19313.0390625,19331.859375,19410.83984375,19776.1796875,20105.6796875,19991.970703125,19468.51953125,19972.08984375,20333.73046875,20413.23046875,20140.919921875,20140.490234375,20149.7890625,20097.619140625,20469.51953125,20454.490234375,20692.58984375,20583.94921875,20653.41015625,20927.9609375,21249.310546875,21612.900390625,21807.630859375,21910.890625,22175.51953125,22649.009765625,22885.140625,22613.080078125,23121.98046875,23135.7890625,22939.0,22848.01953125,22082.119140625,22135.26953125,21912.2890625,22517.140625,22363.880859375,22515.75,22353.689453125,22636.060546875,22541.009765625,22287.869140625,22424.369140625,22255.05078125,22335.099609375,22338.30078125,22182.6796875,22266.91015625,22341.26953125,22649.900390625,22481.609375,22442.30078125,22534.970703125,22591.810546875,22631.869140625,22817.91015625,22907.9609375,22807.5703125,22772.0703125,22789.380859375,22791.75,22495.94921875,22735.01953125,22543.890625,22489.240234375,22267.58984375,21947.580078125,22379.740234375,22479.720703125,22471.7109375,22433.779296875,22505.509765625,22747.439453125,23123.359375,23323.919921875,23189.48046875,23097.80078125,22997.9296875,23003.580078125,23022.759765625,22913.19921875,23242.740234375,23257.05078125,23311.0390625,23232.30078125,23147.140625,23089.630859375,23261.08984375,23524.490234375,23130.3203125,23145.470703125,23188.7890625,22966.890625,23193.470703125,23114.630859375,23431.16015625,23438.830078125,23425.23046875,23416.619140625,23321.189453125,23245.890625,23215.0,23217.330078125,23391.9609375,23410.5,23478.849609375,23294.80078125,23254.279296875,23420.0703125,23272.44921875,23506.33984375,23713.859375,23588.740234375,23667.900390625,23545.66015625,23548.44921875,23478.400390625,23543.689453125,23587.869140625,23615.51953125,23525.58984375,23558.7109375,23520.779296875,23376.9609375,23372.609375,23170.759765625,23320.7109375,23110.740234375,23619.580078125,23776.19921875,24076.220703125,24568.83984375,25087.30078125,25145.66015625,25439.349609375,25405.640625,25652.689453125,26043.44921875,25860.55078125,25628.73046875,25486.830078125,25901.44921875,26468.51953125,26255.470703125,26530.279296875,26830.099609375,26624.19921875,26884.990234375,26740.30078125,26697.259765625,26894.25,26380.3203125,26526.33984375,26688.5,26732.849609375,26659.529296875,26683.109375,26835.58984375,26744.5,26775.529296875,26834.099609375,26559.330078125,26580.4296875,26635.109375,26708.099609375,26691.2890625,26936.380859375,27559.099609375,27575.5703125,27151.380859375,27102.849609375,27340.4609375,27720.140625,28004.369140625,28140.099609375,28442.73046875],"close":[22162.240234375,22088.0390625,22278.119140625,22215.3203125,22319.609375,22467.869140625,null,22508.029296875,22472.779296875,null,null,22467.16015625,22508.689453125,22408.880859375,22497.1796875,22758.48046875,22865.859375,22818.01953125,22717.23046875,22838.369140625,22930.359375,23002.369140625,22960.33984375,22689.740234375,22437.009765625,22450.7890625,22481.08984375,22358.4296875,22018.51953125,22201.8203125,22171.349609375,22475.939453125,22539.5390625,22625.73046875,22823.259765625,22694.5,22804.0390625,22878.349609375,22966.380859375,22738.609375,22851.75,22680.330078125,22278.48046875,22555.4296875,22693.0390625,22516.830078125,22338.150390625,22342.0,22271.76953125,22270.390625,22304.509765625,21811.9296875,21785.5390625,21717.0390625,21546.990234375,21788.140625,22052.1796875,22196.890625,21932.2109375,22187.9609375,22597.349609375,22597.349609375,22697.359375,22794.189453125,22764.6796875,22697.880859375,22396.990234375,22510.48046875,22614.25,22586.869140625,22712.75,22544.83984375,22553.720703125,22746.69921875,22512.529296875,22525.1796875,22507.3203125,22662.740234375,22644.310546875,22598.390625,22298.080078125,21857.4296875,22356.080078125,22204.220703125,22192.0390625,22270.380859375,22199.0,22219.73046875,22362.55078125,22410.8203125,22601.76953125,22799.640625,22813.470703125,22848.220703125,22869.5,22865.150390625,22707.380859375,22696.900390625,22580.830078125,22487.939453125,22307.060546875,22373.08984375,22664.689453125,22604.609375,22821.3203125,23094.669921875,null,23420.5390625,23672.51953125,23674.9296875,23869.9296875,null,23940.259765625,24033.7890625,23796.740234375,24120.0390625,24245.759765625,24270.619140625,24110.9609375,23975.619140625,23783.720703125,null,23469.390625,23506.0390625,22590.859375,22694.66015625,22271.30078125,22549.240234375,22841.119140625,22658.16015625,22532.080078125,22614.8203125,22010.779296875,22091.1796875,21268.73046875,21184.599609375,21149.80078125,21457.2890625,21920.4609375,21687.650390625,22243.66015625,21898.990234375,22147.75,22085.80078125,22486.919921875,22250.25,22269.880859375,21810.51953125,21846.48046875,21803.619140625,21680.33984375,21821.16015625,21583.119140625,21507.5390625,21646.55078125,null,21812.0,21952.400390625,22177.01953125,22262.599609375,22351.060546875,22574.759765625,22036.05078125,21919.330078125,21501.619140625,21678.6796875,21219.5,21148.01953125,21602.75,21816.189453125,21374.830078125,21506.880859375,21115.44921875,20987.919921875,20392.580078125,20166.189453125,null,19155.740234375,19327.060546875,20077.619140625,20014.76953125,null,19561.9609375,20038.970703125,20204.0390625,20427.060546875,20163.80078125,20359.69921875,20555.2890625,20442.75,20402.26953125,20666.0703125,20719.330078125,20622.91015625,20593.720703125,20574.630859375,20773.560546875,20649.0,20664.640625,20556.5390625,20773.490234375,20788.390625,20883.76953125,20844.44921875,20874.060546875,20751.279296875,20333.169921875,20864.2109375,21144.48046875,21139.7109375,20900.630859375,21281.849609375,21302.650390625,21431.490234375,21464.23046875,21425.509765625,21528.23046875,21449.390625,21556.509765625,21385.16015625,21602.689453125,21822.0390625,21726.279296875,21596.810546875,21456.009765625,21025.560546875,21125.08984375,21503.689453125,21290.240234375,21287.01953125,21450.849609375,21584.5,21566.849609375,21608.919921875,21627.33984375,20977.109375,21428.390625,21378.73046875,21033.759765625,21205.810546875,21509.029296875,21505.310546875,21713.2109375,21724.94921875,21807.5,21761.650390625,21802.58984375,21687.5703125,21711.380859375,21870.560546875,22169.109375,22221.66015625,22277.970703125,22090.119140625,22200.560546875,22217.900390625,22259.740234375,22200.0,22307.580078125,22258.73046875,21923.720703125,21602.58984375,21402.130859375,21344.919921875,21191.279296875,21067.23046875,21188.560546875,21062.98046875,21250.08984375,21301.73046875,21272.44921875,21283.369140625,21151.140625,21117.220703125,21182.580078125,21260.140625,21003.369140625,20942.529296875,20601.189453125,20410.880859375,20408.5390625,20776.099609375,20774.0390625,20884.7109375,21134.419921875,21204.279296875,21129.720703125,21032.0,21116.890625,21124.0,20972.7109375,21333.869140625,21462.859375,21258.640625,21285.990234375,21193.810546875,21086.58984375,21338.169921875,21275.919921875,21729.970703125,21754.26953125,21638.16015625,21702.44921875,21746.380859375,21534.349609375,21565.150390625,21533.48046875,21643.529296875,21685.900390625,21535.25,21469.1796875,21046.240234375,21466.990234375,21416.7890625,21620.880859375,21709.5703125,21756.55078125,21658.150390625,21616.80078125,21709.310546875,21521.529296875,21540.990234375,21087.16015625,20720.2890625,20585.310546875,20516.560546875,20593.349609375,20684.8203125,20455.439453125,20655.130859375,20405.650390625,20418.810546875,20563.16015625,20677.220703125,20618.5703125,20628.009765625,20710.91015625,20261.0390625,20456.080078125,20479.419921875,20460.9296875,20704.369140625,20620.189453125,20625.16015625,20649.140625,21085.939453125,21199.5703125,21318.419921875,21392.099609375,21597.759765625,21759.609375,21988.2890625,22001.3203125,21960.7109375,22044.44921875,22079.08984375,22098.83984375,22020.150390625,22048.240234375,21878.900390625,21755.83984375,21885.240234375,21778.609375,21341.740234375,21410.19921875,21375.25,21587.779296875,21456.380859375,21551.98046875,21798.869140625,22207.2109375,22472.919921875,22451.859375,22492.6796875,22548.900390625,22625.380859375,22750.599609375,22799.810546875,22867.26953125,22974.130859375,22843.119140625,22927.0390625,22850.76953125,23251.990234375,23303.8203125,23330.3203125,23391.869140625,23331.83984375,23520.009765625,23319.869140625,23141.55078125,23303.3203125,23416.759765625,23292.650390625,23148.5703125,23038.580078125,23112.880859375,23292.810546875,23373.3203125,23437.76953125,23409.140625,23293.91015625,23529.5,23379.810546875,23135.23046875,23300.08984375,23354.400390625,23430.69921875,23410.189453125,23391.859375,23424.810546875,24023.099609375,23952.349609375,24066.119140625,23934.4296875,23864.849609375,23816.630859375,23821.109375,23830.580078125,23782.869140625,23924.919921875,23837.720703125,23656.619140625,23204.859375,23575.720703125,23204.759765625,23739.869140625,23850.5703125,24025.169921875,23916.580078125,23933.130859375,24041.259765625,24083.509765625,23864.560546875,24031.349609375,23795.439453125,23827.1796875,23343.509765625,23215.7109375,23379.400390625,22977.75,23205.1796875,22971.939453125,23084.58984375,23319.560546875,23873.58984375,23827.98046875,23685.98046875,23861.2109375,23827.73046875,23687.58984375,23523.240234375,23193.80078125,23400.69921875,23479.150390625,23386.740234375,22605.41015625,22426.189453125,21948.23046875,21142.9609375,21344.080078125,21082.73046875,21100.060546875,21329.119140625,20749.75,19698.759765625,19867.119140625,19416.060546875,18559.630859375,17431.05078125,17002.0390625,17011.529296875,16726.55078125,16552.830078125,16887.779296875,18092.349609375,19546.630859375,18664.599609375,19389.4296875,19084.970703125,18917.009765625,18065.41015625,17818.720703125,17820.189453125,18576.30078125,18950.1796875,19353.240234375,19345.76953125,19498.5,19043.400390625,19638.810546875,19550.08984375,19290.19921875,19897.259765625,19669.119140625,19280.779296875,19137.94921875,19429.439453125,19262.0,19783.220703125,19771.189453125,20193.689453125,19619.349609375,19674.76953125,20179.08984375,20390.66015625,20366.48046875,20267.05078125,19914.779296875,20037.470703125,20133.73046875,20433.44921875,20595.150390625,20552.310546875,20388.16015625,20741.650390625,21271.169921875,21419.23046875,21916.310546875,21877.890625,22062.390625,22325.609375,22613.759765625,22695.740234375,22863.73046875,23178.099609375,23091.029296875,23124.94921875,22472.91015625,22305.48046875,21530.94921875,22582.2109375,22455.759765625,22355.4609375,22478.7890625,22437.26953125,22549.05078125,22534.3203125,22259.7890625,22512.080078125,21995.0390625,22288.140625,22121.73046875,22145.9609375,22306.48046875,22714.439453125,22614.689453125,22438.650390625,22529.2890625,22290.810546875,22784.740234375,22587.009765625,22945.5,22770.359375,22696.419921875,22717.48046875,22884.220703125,22751.609375,22715.849609375,22657.380859375,22397.109375,22339.23046875,21710.0,22195.380859375,22573.66015625,22514.849609375,22418.150390625,22329.939453125,22750.240234375,22843.9609375,23249.609375,23289.359375,23096.75,23051.080078125,23110.609375,22880.619140625,22920.30078125,22985.509765625,23296.76953125,23290.859375,23208.859375,22882.650390625,23139.759765625,23138.0703125,23247.150390625,23465.529296875,23205.4296875,23089.94921875,23274.130859375,23032.5390625,23235.470703125,23406.490234375,23559.30078125,23454.890625,23475.529296875,23319.369140625,23360.30078125,23346.490234375,23087.8203125,23204.619140625,23511.619140625,23539.099609375,23185.119140625,23029.900390625,23312.140625,23433.73046875,23422.8203125,23647.0703125,23619.689453125,23558.689453125,23601.779296875,23626.73046875,23507.23046875,23410.630859375,23671.130859375,23567.0390625,23639.4609375,23474.26953125,23516.58984375,23494.33984375,23485.80078125,23418.509765625,23331.939453125,22977.130859375,23295.48046875,23695.23046875,24105.279296875,24325.23046875,24839.83984375,24905.58984375,25349.599609375,25520.880859375,25385.869140625,25906.9296875,26014.619140625,25728.140625,25634.33984375,25527.369140625,26165.58984375,26296.859375,26537.310546875,26644.7109375,26433.619140625,26787.5390625,26800.98046875,26809.369140625,26751.240234375,26547.439453125,26467.080078125,26817.939453125,26756.240234375,26652.51953125,26732.439453125,26687.83984375,26757.400390625,26806.669921875,26763.390625,26714.419921875,26436.390625,26524.7890625,26668.349609375,26656.609375,26854.029296875,27568.150390625,27444.169921875,27258.380859375,27158.630859375,27055.939453125,27490.130859375,28139.029296875,28164.33984375,28456.58984375,28698.259765625],"volume":[69600,64000,76500,73300,72800,89100,null,89900,70700,null,null,69000,77000,86000,73300,80200,68900,86400,80200,75600,65300,59100,59400,75000,85600,70400,52900,59800,90500,132400,82500,71900,65800,67900,72200,85200,55700,63900,57000,72100,88500,65000,79400,88900,76000,85900,60600,71300,65800,70000,67900,67100,76500,62200,66700,71600,61200,90700,74900,64400,72600,0,75800,56500,62400,69700,88000,70400,58700,69600,73200,76200,115400,100800,94500,71700,67000,69400,72800,61800,73900,77800,59700,61200,77900,56100,46800,54500,57100,50100,50400,50200,60700,58800,73900,68100,49900,52300,65400,62200,69800,55700,76500,79800,75000,102700,null,90600,93600,101600,120600,null,100800,84200,76200,90700,65000,80500,71300,89400,84600,null,86500,70600,115300,99500,79900,70100,72100,64300,67400,63000,80200,83900,93600,92900,70800,116900,105000,101900,101900,78700,0,96300,81900,78100,59300,85700,75200,0,74900,72100,82500,77300,65900,null,78000,74000,77600,69300,104100,70500,89600,83700,87600,78100,79000,87500,89600,79200,102800,63400,80500,81300,96300,116600,null,0,79900,93000,70600,null,91600,81500,86400,72800,73700,77700,78300,69500,63600,64700,61200,57100,0,61400,68400,56800,63100,72100,75700,82200,66600,65500,68900,70600,86200,84100,78600,64500,65600,61800,53600,59700,68400,52400,51800,56400,67700,71500,62600,59100,59200,57100,75200,99800,55600,67800,66200,64100,83200,55200,59900,65300,78900,77700,101300,76000,71100,61600,77400,71000,68500,57900,58500,54600,54300,58700,61200,61600,66100,57300,75400,67300,0,42900,52000,67900,63300,71900,90700,85700,96900,98500,74500,90200,84100,82500,75800,65100,70100,64500,63900,67700,41600,98500,70000,58700,79100,67400,69200,72300,59600,50700,58200,52100,56500,65700,60400,49100,54600,64100,55700,89000,43200,53900,50300,61300,62100,66900,54700,55000,37800,44800,51900,53900,58900,49600,45400,49800,53300,70200,57900,46900,48100,51100,46900,47600,47000,54500,76500,75700,91500,85800,89700,73600,64800,63700,72900,60900,68200,58400,50600,50100,53000,54600,50700,69900,60800,51500,55100,72000,42400,0,51500,83000,71100,57800,92400,110100,96000,116300,81500,69400,78200,85000,68400,61600,81600,76400,69900,62300,63300,67700,57700,47400,60800,55400,59900,67400,74500,78700,57800,59200,48400,68000,61300,57200,48100,72900,101600,78300,65400,102100,77400,70900,94600,61500,63000,63400,79900,72200,57300,64200,65700,69800,55600,50300,94300,52200,44800,52100,47700,58800,58100,61400,54400,55800,52800,61300,56300,115500,53300,64000,66300,55600,70300,45200,37900,31600,40300,44800,41600,72800,64300,79400,62200,55900,64200,57200,55400,59400,38300,44600,49000,55500,48700,62400,64400,54900,69600,75400,72500,67900,70300,95100,65400,56500,74600,64500,69100,54000,59500,61600,63300,62100,105800,99300,106200,148500,123700,105300,94600,85700,111700,170300,164700,129200,164600,233400,158100,198800,177200,198900,170300,147300,147700,128100,148900,121000,122200,105800,107300,96000,105700,108200,105900,82300,87500,65600,81900,94100,81400,87800,65000,79400,76400,72600,84700,77600,68600,103400,86600,82900,82200,76200,67700,79500,76900,75200,71900,93000,71800,62900,71100,55100,87200,112000,134000,153200,72200,77900,94100,92000,85600,108500,91500,75600,105900,120500,78500,100100,72500,65200,97000,54600,0,67000,80800,66600,73700,74200,67400,73600,51700,58000,62700,64900,65200,78800,71200,61000,72600,89400,55900,50000,68600,65400,71800,67800,74300,77800,106600,84000,89100,74000,62600,66700,99300,90800,84800,59800,43600,55600,50100,50200,51200,40600,75300,47800,52700,98100,81000,59600,52600,57500,59300,57300,62100,84400,67600,76900,65400,61800,63000,61100,82600,77000,70500,72200,82000,61300,88200,86300,59500,57700,52100,56300,56100,44900,47200,54000,48300,48100,46300,48700,53300,44900,49200,41700,52700,67100,57500,76700,69700,81600,78600,73200,67000,128200,102500,80500,77600,84900,84800,69200,82000,63400,81700,92500,63500,86200,147700,73200,80200,69500,61600,61600,55100,61800,69200,74900,60000,59300,61300,61500,73800,60700,58600,56000,47900,33400,50700,59400,50600,51500,55000,72700,98900,84900,78800,70900,81900],"low":[22076.630859375,22065.51953125,22149.58984375,22080.759765625,22265.19921875,22357.529296875,null,22411.4296875,22426.55078125,null,null,22350.91015625,22423.23046875,22364.75,22418.75,22545.470703125,22683.640625,22805.720703125,22695.83984375,22799.16015625,22867.30078125,22935.310546875,22952.869140625,22649.849609375,22366.599609375,22318.150390625,22410.91015625,22240.390625,21931.650390625,22098.0,22098.0390625,22355.830078125,22470.0390625,22498.58984375,22732.1796875,22694.5,22667.30078125,22797.73046875,22895.310546875,22738.609375,22770.380859375,22601.130859375,22278.48046875,22167.16015625,22491.080078125,22414.1796875,22312.7890625,22104.119140625,22205.33984375,22038.400390625,22145.48046875,21784.48046875,21574.560546875,21604.1796875,21462.94921875,21642.9609375,21825.759765625,22196.890625,21744.25,22019.189453125,22316.51953125,22316.51953125,22575.419921875,22794.189453125,22761.869140625,22541.349609375,22341.869140625,22416.23046875,22547.140625,22549.76953125,22593.19921875,22518.939453125,22352.2109375,22615.98046875,22464.810546875,22490.5703125,22486.740234375,22499.05078125,22610.2890625,22497.990234375,22272.689453125,21851.3203125,22047.189453125,22110.2890625,21871.69921875,22244.099609375,22150.75,22053.140625,22162.810546875,22377.880859375,22452.419921875,22682.390625,22813.470703125,22819.970703125,22832.830078125,22678.029296875,22684.4296875,22612.150390625,22570.51953125,22416.630859375,22172.900390625,22249.609375,22457.099609375,22522.169921875,22643.880859375,22965.48046875,null,23039.259765625,23672.51953125,23582.150390625,23764.05078125,null,23808.94921875,23833.919921875,23778.0390625,24021.26953125,24123.5,24217.259765625,24030.58984375,23923.259765625,23730.189453125,null,23442.4609375,23373.5390625,22459.01953125,22323.4296875,22261.919921875,22269.529296875,22765.580078125,22637.2890625,22212.5703125,22271.58984375,21993.0703125,21911.419921875,21204.400390625,20971.9296875,21109.970703125,21035.880859375,21530.390625,21628.44921875,21751.330078125,21865.98046875,21994.279296875,21996.939453125,22421.0,22226.009765625,22046.2890625,21484.650390625,21764.880859375,21613.529296875,21663.990234375,21665.2890625,21526.94921875,21243.380859375,21484.98046875,null,21622.599609375,21816.05078125,22032.720703125,22241.169921875,22231.9609375,22550.2890625,22033.41015625,21708.8203125,21307.720703125,21506.44921875,21169.9609375,21062.310546875,21320.720703125,21675.66015625,21353.939453125,21363.669921875,21101.439453125,20880.73046875,20282.9296875,20006.669921875,null,19117.9609375,18948.580078125,19701.759765625,19900.0390625,null,19241.369140625,19920.80078125,20106.359375,20331.19921875,20101.9296875,20294.740234375,20204.4296875,20323.3203125,20342.4609375,20454.130859375,20678.259765625,20558.30078125,20438.220703125,20467.58984375,20598.640625,20624.55078125,20406.220703125,20527.529296875,20682.91015625,20741.98046875,20823.6796875,20823.1796875,20860.990234375,20665.509765625,20315.310546875,20428.5703125,20992.880859375,21102.16015625,20853.330078125,21189.970703125,21217.16015625,21315.390625,21318.740234375,21348.669921875,21505.0703125,21405.83984375,21492.650390625,21364.08984375,21490.01953125,21740.919921875,21659.0390625,21550.44921875,21402.119140625,20993.0703125,20938.0,21348.810546875,21198.990234375,21287.01953125,21374.849609375,21500.3203125,21425.7890625,21499.16015625,21542.029296875,20911.5703125,21174.33984375,21242.51953125,20974.189453125,21149.419921875,21471.119140625,21490.560546875,21489.94921875,21662.900390625,21731.33984375,21740.529296875,21698.419921875,21571.669921875,21627.869140625,21698.7109375,22102.9296875,22095.3203125,22185.869140625,22058.390625,22162.23046875,22099.380859375,22119.939453125,22125.48046875,22155.23046875,22073.099609375,21875.109375,21514.849609375,21315.0703125,21175.330078125,21127.9296875,20751.44921875,20968.080078125,20951.669921875,21199.98046875,21282.650390625,21160.4296875,21266.98046875,21072.720703125,20922.0,21113.759765625,21177.26953125,20884.609375,20809.2890625,20581.580078125,20305.740234375,20289.640625,20646.150390625,20745.83984375,20816.580078125,21077.94921875,21066.619140625,21118.75,20932.130859375,20971.1796875,21044.619140625,20924.189453125,21213.4296875,21377.26953125,21221.69921875,21185.669921875,21114.470703125,21035.83984375,21123.970703125,21199.849609375,21559.169921875,21697.310546875,21566.650390625,21672.5,21647.73046875,21499.5703125,21508.220703125,21488.220703125,21532.5703125,21589.830078125,21514.890625,21380.55078125,20993.439453125,21121.900390625,21317.849609375,21411.9296875,21677.7109375,21715.689453125,21590.66015625,21518.69921875,21665.859375,21476.0703125,21288.900390625,20960.08984375,20514.189453125,20110.759765625,20406.51953125,20462.98046875,20676.919921875,20369.26953125,20581.169921875,20184.849609375,20300.349609375,20502.66015625,20582.009765625,20482.619140625,20584.2890625,20579.98046875,20173.759765625,20439.919921875,20433.310546875,20361.119140625,20633.30078125,20614.2890625,20578.01953125,20554.16015625,20787.9296875,21145.810546875,21182.259765625,21350.349609375,21437.8203125,21743.9609375,21820.939453125,21878.630859375,21942.029296875,22003.30078125,22047.900390625,22077.939453125,21906.0,21986.240234375,21733.689453125,21666.599609375,21811.98046875,21725.23046875,21277.359375,21276.009765625,21328.259765625,21483.1796875,21359.83984375,21308.880859375,21658.26953125,22049.7109375,22434.349609375,22424.919921875,22466.259765625,22515.73046875,22457.890625,22704.330078125,22715.130859375,22830.5703125,22935.349609375,22827.9296875,22875.5,22705.599609375,23090.939453125,23246.5703125,23253.3203125,23313.41015625,23323.01953125,23312.25,23270.9296875,23062.16015625,23121.58984375,23271.2890625,23244.9296875,23086.119140625,22726.7109375,23030.330078125,23255.390625,23350.099609375,23418.23046875,23367.330078125,23273.369140625,23378.400390625,23186.83984375,23044.779296875,23259.8203125,23338.400390625,23360.009765625,23336.9296875,23333.630859375,23360.4296875,23775.73046875,23950.05078125,23996.509765625,23919.359375,23835.2890625,23746.630859375,23810.8203125,23796.349609375,23782.869140625,23775.400390625,23837.720703125,23656.619140625,23148.529296875,23299.919921875,22951.1796875,23506.150390625,23761.080078125,23951.66015625,23875.8203125,23905.380859375,24013.75,24061.669921875,23843.48046875,23831.099609375,23779.23046875,23755.3203125,23317.3203125,23115.150390625,23214.279296875,22892.94921875,23139.98046875,22775.919921875,22854.44921875,23241.640625,23625.130859375,23759.419921875,23621.720703125,23693.720703125,23784.310546875,23603.48046875,23335.990234375,23133.599609375,23234.9609375,23426.419921875,23378.330078125,22335.2109375,22127.419921875,21844.2890625,20916.400390625,20834.2890625,21082.73046875,20862.05078125,21220.759765625,20613.91015625,19472.259765625,18891.76953125,19392.25,18339.26953125,16690.599609375,16914.44921875,16378.9404296875,16698.4609375,16358.1904296875,16480.94921875,17197.140625,18446.80078125,18512.810546875,18832.2109375,18578.19921875,18834.16015625,17871.619140625,17707.66015625,17646.5,17802.619140625,18553.140625,18730.80078125,19158.55078125,19235.9609375,19014.3203125,19093.119140625,19465.94921875,19154.41015625,19554.69921875,19611.7890625,19193.220703125,18858.25,19221.5390625,19175.380859375,19410.1796875,19638.48046875,20084.830078125,19551.73046875,19448.9296875,19894.580078125,20285.0390625,20293.970703125,20056.4609375,19902.9296875,19832.880859375,19999.099609375,20433.44921875,20454.029296875,20503.869140625,20334.990234375,20584.060546875,20918.109375,21142.720703125,21580.5,21710.80078125,21898.990234375,22118.400390625,22462.6796875,22501.810546875,22563.560546875,23028.619140625,22933.140625,22900.30078125,22466.5390625,21786.9296875,21529.830078125,21899.48046875,22318.0703125,22125.349609375,22352.16015625,22311.939453125,22257.140625,22479.859375,22165.140625,22408.26953125,21969.58984375,22273.380859375,22039.560546875,22072.109375,22154.970703125,22325.75,22540.439453125,22438.650390625,22434.380859375,22285.0703125,22561.470703125,22538.779296875,22800.109375,22739.419921875,22643.51953125,22580.189453125,22780.220703125,22732.919921875,22429.5703125,22646.220703125,22366.33984375,22334.7109375,21710.0,21919.830078125,22379.740234375,22356.25,22362.890625,22204.609375,22497.0703125,22670.740234375,23111.5,23222.849609375,23068.529296875,22948.890625,22953.599609375,22851.830078125,22920.30078125,22862.5390625,23225.390625,23203.0,23177.849609375,22594.7890625,23102.609375,23047.76953125,23170.8203125,23426.109375,23098.76953125,23086.890625,23129.66015625,22878.7109375,23134.01953125,23114.630859375,23429.419921875,23351.349609375,23397.4296875,23272.23046875,23290.189453125,23154.44921875,23039.48046875,23154.66015625,23303.029296875,23347.640625,23170.890625,22951.41015625,23252.689453125,23331.400390625,23272.44921875,23477.73046875,23552.73046875,23501.259765625,23490.94921875,23518.810546875,23458.4296875,23382.669921875,23543.689453125,23518.2890625,23611.330078125,23436.169921875,23469.130859375,23475.51953125,23232.310546875,23334.23046875,23170.759765625,22948.470703125,23096.7890625,23505.779296875,23756.779296875,24039.16015625,24541.279296875,24833.1796875,25145.66015625,25316.599609375,25215.310546875,25640.2890625,25851.5390625,25656.69921875,25474.939453125,25425.58984375,25901.44921875,26258.349609375,26255.470703125,26419.05078125,26405.830078125,26618.390625,26695.279296875,26719.23046875,26646.080078125,26500.3203125,26327.080078125,26520.599609375,26639.98046875,26553.009765625,26648.689453125,26605.5390625,26717.029296875,26676.279296875,26707.30078125,26533.630859375,26361.66015625,26414.740234375,26605.259765625,26638.279296875,26664.599609375,26921.140625,27338.560546875,27042.3203125,27073.4609375,27002.1796875,27340.4609375,27667.75,27899.44921875,28133.58984375,28411.580078125]}],"adjclose":[{"adjclose":[22162.240234375,22088.0390625,22278.119140625,22215.3203125,22319.609375,22467.869140625,null,22508.029296875,22472.779296875,null,null,22467.16015625,22508.689453125,22408.880859375,22497.1796875,22758.48046875,22865.859375,22818.01953125,22717.23046875,22838.369140625,22930.359375,23002.369140625,22960.33984375,22689.740234375,22437.009765625,22450.7890625,22481.08984375,22358.4296875,22018.51953125,22201.8203125,22171.349609375,22475.939453125,22539.5390625,22625.73046875,22823.259765625,22694.5,22804.0390625,22878.349609375,22966.380859375,22738.609375,22851.75,22680.330078125,22278.48046875,22555.4296875,22693.0390625,22516.830078125,22338.150390625,22342.0,22271.76953125,22270.390625,22304.509765625,21811.9296875,21785.5390625,21717.0390625,21546.990234375,21788.140625,22052.1796875,22196.890625,21932.2109375,22187.9609375,22597.349609375,22597.349609375,22697.359375,22794.189453125,22764.6796875,22697.880859375,22396.990234375,22510.48046875,22614.25,22586.869140625,22712.75,22544.83984375,22553.720703125,22746.69921875,22512.529296875,22525.1796875,22507.3203125,22662.740234375,22644.310546875,22598.390625,22298.080078125,21857.4296875,22356.080078125,22204.220703125,22192.0390625,22270.380859375,22199.0,22219.73046875,22362.55078125,22410.8203125,22601.76953125,22799.640625,22813.470703125,22848.220703125,22869.5,22865.150390625,22707.380859375,22696.900390625,22580.830078125,22487.939453125,22307.060546875,22373.08984375,22664.689453125,22604.609375,22821.3203125,23094.669921875,null,23420.5390625,23672.51953125,23674.9296875,23869.9296875,null,23940.259765625,24033.7890625,23796.740234375,24120.0390625,24245.759765625,24270.619140625,24110.9609375,23975.619140625,23783.720703125,null,23469.390625,23506.0390625,22590.859375,22694.66015625,22271.30078125,22549.240234375,22841.119140625,22658.16015625,22532.080078125,22614.8203125,22010.779296875,22091.1796875,21268.73046875,21184.599609375,21149.80078125,21457.2890625,21920.4609375,21687.650390625,22243.66015625,21898.990234375,22147.75,22085.80078125,22486.919921875,22250.25,22269.880859375,21810.51953125,21846.48046875,21803.619140625,21680.33984375,21821.16015625,21583.119140625,21507.5390625,21646.55078125,null,21812.0,21952.400390625,22177.01953125,22262.599609375,22351.060546875,22574.759765625,22036.05078125,21919.330078125,21501.619140625,21678.6796875,21219.5,21148.01953125,21602.75,21816.189453125,21374.830078125,21506.880859375,21115.44921875,20987.919921875,20392.580078125,20166.189453125,null,19155.740234375,19327.060546875,20077.619140625,20014.76953125,null,19561.9609375,20038.970703125,20204.0390625,20427.060546875,20163.80078125,20359.69921875,20555.2890625,20442.75,20402.26953125,20666.0703125,20719.330078125,20622.91015625,20593.720703125,20574.630859375,20773.560546875,20649.0,20664.640625,20556.5390625,20773.490234375,20788.390625,20883.76953125,20844.44921875,20874.060546875,20751.279296875,20333.169921875,20864.2109375,21144.48046875,21139.7109375,20900.630859375,21281.849609375,21302.650390625,21431.490234375,21464.23046875,21425.509765625,21528.23046875,21449.390625,21556.509765625,21385.16015625,21602.689453125,21822.0390625,21726.279296875,21596.810546875,21456.009765625,21025.560546875,21125.08984375,21503.689453125,21290.240234375,21287.01953125,21450.849609375,21584.5,21566.849609375,21608.919921875,21627.33984375,20977.109375,21428.390625,21378.73046875,21033.759765625,21205.810546875,21509.029296875,21505.310546875,21713.2109375,21724.94921875,21807.5,21761.650390625,21802.58984375,21687.5703125,21711.380859375,21870.560546875,22169.109375,22221.66015625,22277.970703125,22090.119140625,22200.560546875,22217.900390625,22259.740234375,22200.0,22307.580078125,22258.73046875,21923.720703125,21602.58984375,21402.130859375,21344.919921875,21191.279296875,21067.23046875,21188.560546875,21062.98046875,21250.08984375,21301.73046875,21272.44921875,21283.369140625,21151.140625,21117.220703125,21182.580078125,21260.140625,21003.369140625,20942.529296875,20601.189453125,20410.880859375,20408.5390625,20776.099609375,20774.0390625,20884.7109375,21134.419921875,21204.279296875,21129.720703125,21032.0,21116.890625,21124.0,20972.7109375,21333.869140625,21462.859375,21258.640625,21285.990234375,21193.810546875,21086.58984375,21338.169921875,21275.919921875,21729.970703125,21754.26953125,21638.16015625,21702.44921875,21746.380859375,21534.349609375,21565.150390625,21533.48046875,21643.529296875,21685.900390625,21535.25,21469.1796875,21046.240234375,21466.990234375,21416.7890625,21620.880859375,21709.5703125,21756.55078125,21658.150390625,21616.80078125,21709.310546875,21521.529296875,21540.990234375,21087.16015625,20720.2890625,20585.310546875,20516.560546875,20593.349609375,20684.8203125,20455.439453125,20655.130859375,20405.650390625,20418.810546875,20563.16015625,20677.220703125,20618.5703125,20628.009765625,20710.91015625,20261.0390625,20456.080078125,20479.419921875,20460.9296875,20704.369140625,20620.189453125,20625.16015625,20649.140625,21085.939453125,21199.5703125,21318.419921875,21392.099609375,21597.759765625,21759.609375,21988.2890625,22001.3203125,21960.7109375,22044.44921875,22079.08984375,22098.83984375,22020.150390625,22048.240234375,21878.900390625,21755.83984375,21885.240234375,21778.609375,21341.740234375,21410.19921875,21375.25,21587.779296875,21456.380859375,21551.98046875,21798.869140625,22207.2109375,22472.919921875,22451.859375,22492.6796875,22548.900390625,22625.380859375,22750.599609375,22799.810546875,22867.26953125,22974.130859375,22843.119140625,22927.0390625,22850.76953125,23251.990234375,23303.8203125,23330.3203125,23391.869140625,23331.83984375,23520.009765625,23319.869140625,23141.55078125,23303.3203125,23416.759765625,23292.650390625,23148.5703125,23038.580078125,23112.880859375,23292.810546875,23373.3203125,23437.76953125,23409.140625,23293.91015625,23529.5,23379.810546875,23135.23046875,23300.08984375,23354.400390625,23430.69921875,23410.189453125,23391.859375,23424.810546875,24023.099609375,23952.349609375,24066.119140625,23934.4296875,23864.849609375,23816.630859375,23821.109375,23830.580078125,23782.869140625,23924.919921875,23837.720703125,23656.619140625,23204.859375,23575.720703125,23204.759765625,23739.869140625,23850.5703125,24025.169921875,23916.580078125,23933.130859375,24041.259765625,24083.509765625,23864.560546875,24031.349609375,23795.439453125,23827.1796875,23343.509765625,23215.7109375,23379.400390625,22977.75,23205.1796875,22971.939453125,23084.58984375,23319.560546875,23873.58984375,23827.98046875,23685.98046875,23861.2109375,23827.73046875,23687.58984375,23523.240234375,23193.80078125,23400.69921875,23479.150390625,23386.740234375,22605.41015625,22426.189453125,21948.23046875,21142.9609375,21344.080078125,21082.73046875,21100.060546875,21329.119140625,20749.75,19698.759765625,19867.119140625,19416.060546875,18559.630859375,17431.05078125,17002.0390625,17011.529296875,16726.55078125,16552.830078125,16887.779296875,18092.349609375,19546.630859375,18664.599609375,19389.4296875,19084.970703125,18917.009765625,18065.41015625,17818.720703125,17820.189453125,18576.30078125,18950.1796875,19353.240234375,19345.76953125,19498.5,19043.400390625,19638.810546875,19550.08984375,19290.19921875,19897.259765625,19669.119140625,19280.779296875,19137.94921875,19429.439453125,19262.0,19783.220703125,19771.189453125,20193.689453125,19619.349609375,19674.76953125,20179.08984375,20390.66015625,20366.48046875,20267.05078125,19914.779296875,20037.470703125,20133.73046875,20433.44921875,20595.150390625,20552.310546875,20388.16015625,20741.650390625,21271.169921875,21419.23046875,21916.310546875,21877.890625,22062.390625,22325.609375,22613.759765625,22695.740234375,22863.73046875,23178.099609375,23091.029296875,23124.94921875,22472.91015625,22305.48046875,21530.94921875,22582.2109375,22455.759765625,22355.4609375,22478.7890625,22437.26953125,22549.05078125,22534.3203125,22259.7890625,22512.080078125,21995.0390625,22288.140625,22121.73046875,22145.9609375,22306.48046875,22714.439453125,22614.689453125,22438.650390625,22529.2890625,22290.810546875,22784.740234375,22587.009765625,22945.5,22770.359375,22696.419921875,22717.48046875,22884.220703125,22751.609375,22715.849609375,22657.380859375,22397.109375,22339.23046875,21710.0,22195.380859375,22573.66015625,22514.849609375,22418.150390625,22329.939453125,22750.240234375,22843.9609375,23249.609375,23289.359375,23096.75,23051.080078125,23110.609375,22880.619140625,22920.30078125,22985.509765625,23296.76953125,23290.859375,23208.859375,22882.650390625,23139.759765625,23138.0703125,23247.150390625,23465.529296875,23205.4296875,23089.94921875,23274.130859375,23032.5390625,23235.470703125,23406.490234375,23559.30078125,23454.890625,23475.529296875,23319.369140625,23360.30078125,23346.490234375,23087.8203125,23204.619140625,23511.619140625,23539.099609375,23185.119140625,23029.900390625,23312.140625,23433.73046875,23422.8203125,23647.0703125,23619.689453125,23558.689453125,23601.779296875,23626.73046875,23507.23046875,23410.630859375,23671.130859375,23567.0390625,23639.4609375,23474.26953125,23516.58984375,23494.33984375,23485.80078125,23418.509765625,23331.939453125,22977.130859375,23295.48046875,23695.23046875,24105.279296875,24325.23046875,24839.83984375,24905.58984375,25349.599609375,25520.880859375,25385.869140625,25906.9296875,26014.619140625,25728.140625,25634.33984375,25527.369140625,26165.58984375,26296.859375,26537.310546875,26644.7109375,26433.619140625,26787.5390625,26800.98046875,26809.369140625,26751.240234375,26547.439453125,26467.080078125,26817.939453125,26756.240234375,26652.51953125,26732.439453125,26687.83984375,26757.400390625,26806.669921875,26763.390625,26714.419921875,26436.390625,26524.7890625,26668.349609375,26656.609375,26854.029296875,27568.150390625,27444.169921875,27258.380859375,27158.630859375,27055.939453125,27490.130859375,28139.029296875,28164.33984375,28456.58984375,28698.259765625]}]}}],"error":null}}'
    }
}
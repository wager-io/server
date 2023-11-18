const CrashGame = require("../model/crashgame")
const DiceGame = require("../model/dice_game")

const GlobalStat = (async(req, res)=>{
    const {user_id} = req.body
    console.log(user_id)
    let global_statistics = []
    try{
        let response = await CrashGame.find({user_id})
        response.forEach(element => {
            global_statistics.push(element)
        })
    
        let dice_res = await DiceGame.find({user_id})
        dice_res.forEach(element => {
            global_statistics.push(element)
        })

        let WGF = []
        let WGF_lose = []
        let WGF_win = []
        let WGF_img = ''
        let WGF_wagered = 0

        let ETH = []
        let ETH_lose = []
        let ETH_win = []
        let ETH_img = ''
        let ETH_wagered = 0

        let BTC = []
        let BTC_lose = []
        let BTC_win = []
        let BTC_img = ''
        let BTC_wagered = 0


    global_statistics.forEach(element => {
        if(element.token === "BTC"){
            BTC.push(element)
            BTC_img = element.token_img
            BTC_wagered += (parseInt(element.bet_amount))
            if(element.has_won){
                BTC_win.push(element)
            }else{
                BTC_lose.push(element) 
            }
        }
        else if(element.token === "WGF"){
            WGF.push(element)
            WGF_img = element.token_img
            WGF_wagered += (parseInt(element.bet_amount))
            if(element.has_won){
              WGF_win.push(element)
            }else{
                WGF_lose.push(element) 
            }
        }
        else if(element.token === "ETH"){
            ETH.push(element)
            ETH_img = element.token_img
            ETH_wagered += (parseInt(element.bet_amount))
            if(element.has_won){
              ETH_win.push(element)
            }else{
                ETH_lose.push(element) 
            }
        }
})

        let total_wagered = BTC_wagered + ETH_wagered
        let total_lose = WGF_lose.length + BTC_lose.length + ETH_wagered
        let total_win = WGF_win.length + BTC_win.length + ETH_wagered
        let total_bet = global_statistics.length
        let wgf = {WGF_bets:WGF.length, WGF_win: WGF_win.length, WGF_lose: WGF_lose.length, WGF_wagered:WGF_wagered, WGF_img:WGF_img }
        let btc = {BTC_bets:BTC.length, BTC_win: BTC_win.length, BTC_lose: BTC_lose.length, BTC_wagered:BTC_wagered, BTC_img:BTC_img }
        let eth = {ETH_bets:ETH.length, ETH_win: ETH_win.length, ETH_lose: ETH_lose.length, ETH_wagered:ETH_wagered, ETH_img:ETH_img }

        res.status(200).json({total_wagered, total_bet,total_lose,total_win, wgf, btc, eth})
    }
    catch(error){
        res.status(500).json({error})
    }
})


const crashStat = (async(req, res)=>{
    const {user_id} = req.body
    let global_statistics = []
    try{
        let response = await CrashGame.find({user_id})
        response.forEach(element => {
            global_statistics.push(element)
        })

        let WGF = []
        let WGF_lose = []
        let WGF_win = []
        let WGF_img = ''
        let WGF_wagered = 0

        let PPD = []
        let PPD_lose = []
        let PPD_win = []
        let PPD_img = ''
        let PPD_wagered = 0

        let PPE = []
        let PPE_lose = []
        let PPE_win = []
        let PPE_img = ''
        let PPE_wagered = 0

        let PPL = []
        let PPL_lose = []
        let PPL_win = []
        let PPL_img = ''
        let PPL_wagered = 0

        let BTC = []
        let BTC_lose = []
        let BTC_win = []
        let BTC_img = ''
        let BTC_wagered = 0

        setTimeout(()=>{
            for (let index = 0; index < global_statistics.length; index++) {
                const element = global_statistics[index];
                if(element.token === "BTC"){
                    BTC.push(element)
                    BTC_img = element.token_img
                    BTC_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        BTC_lose.push(element)
                    }else{
                        BTC_win.push(element) 
                    }
                }
                else if(element.token === "WGF"){
                    WGF.push(element)
                    WGF_img = element.token_img
                    WGF_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        WGF_lose.push(element)
                    }else{
                        WGF_win.push(element) 
                    }
                }
                else if(element.token === "PPD"){
                    PPD.push(element)
                    PPD_img = element.token_img
                    PPD_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPD_lose.push(element)
                    }else{
                        PPD_win.push(element) 
                    }
                }
                else if(element.token === "PPE"){
                    PPE.push(element)
                    PPE_img = element.token_img
                    PPE_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPE_lose.push(element)
                    }else{
                        PPE_win.push(element) 
                    }
                }
                else if(element.token === "PPL"){
                    PPL.push(element)
                    PPL_img = element.token_img
                    PPL_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPL_lose.push(element)
                    }else{
                        PPL_win.push(element) 
                    }
                }
            }

            let total_wagered = BTC_wagered + PPD_wagered
            let total_lose = WGF_lose.length + PPD_lose.length + PPE_lose.length + PPL_lose.length + BTC_lose.length 
            let total_win = WGF_win.length + PPD_win.length + PPE_win.length + PPL_win.length + BTC_win.length 
            let total_bet = global_statistics.length
            let WGF = {WGF_bets:WGF.length, WGF_win: WGF_win.length, WGF_lose: WGF_lose.length, WGF_wagered:WGF_wagered, WGF_img:WGF_img }
            let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
            let ppe = {ppe_bets:PPE.length, ppe_win: PPE_win.length, ppe_lose: PPE_lose.length, ppe_wagered:PPE_wagered, ppe_img:PPE_img }
            let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
            let BTC = {BTC_bets:BTC.length, BTC_win: BTC_win.length, BTC_lose: BTC_lose.length, BTC_wagered:BTC_wagered, BTC_img:BTC_img }

            res.status(200).json({total_wagered, total_bet,total_lose,total_win, WGF, ppd, ppe, ppl, BTC})
        },500)
    }
    catch(error){
        res.status(500).json({error})
    }
})

const diceStat = (async(req, res)=>{
    const {user_id} = req.body
    let global_statistics = []
    try{
        let dice_res = await DiceGame.find({user_id})
        dice_res.forEach(element => {
            global_statistics.push(element)
        })

        let WGF = []
        let WGF_lose = []
        let WGF_win = []
        let WGF_img = ''
        let WGF_wagered = 0

        let PPD = []
        let PPD_lose = []
        let PPD_win = []
        let PPD_img = ''
        let PPD_wagered = 0

        let PPE = []
        let PPE_lose = []
        let PPE_win = []
        let PPE_img = ''
        let PPE_wagered = 0

        let PPL = []
        let PPL_lose = []
        let PPL_win = []
        let PPL_img = ''
        let PPL_wagered = 0

        let BTC = []
        let BTC_lose = []
        let BTC_win = []
        let BTC_img = ''
        let BTC_wagered = 0

        setTimeout(()=>{
            global_statistics.forEach(element => {
                if(element.token === "BTC"){
                    BTC.push(element)
                    BTC_img = element.token_img
                    BTC_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        BTC_lose.push(element)
                    }else{
                        BTC_win.push(element) 
                    }
                }
                else if(element.token === "WGF"){
                    WGF.push(element)
                    WGF_img = element.token_img
                    WGF_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        WGF_lose.push(element)
                    }else{
                        WGF_win.push(element) 
                    }
                }
                else if(element.token === "PPD"){
                    PPD.push(element)
                    PPD_img = element.token_img
                    PPD_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPD_lose.push(element)
                    }else{
                        PPD_win.push(element) 
                    }
                }
                else if(element.token === "PPE"){
                    PPE.push(element)
                    PPE_img = element.token_img
                    PPE_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPE_lose.push(element)
                    }else{
                        PPE_win.push(element) 
                    }
                }
                else if(element.token === "PPL"){
                    PPL.push(element)
                    PPL_img = element.token_img
                    PPL_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPL_lose.push(element)
                    }else{
                        PPL_win.push(element) 
                    }
                }
          

            let total_wagered = BTC_wagered + PPD_wagered
            let total_lose = WGF_lose.length + PPD_lose.length + PPE_lose.length + PPL_lose.length + BTC_lose.length 
            let total_win = WGF_win.length + PPD_win.length + PPE_win.length + PPL_win.length + BTC_win.length 
            let total_bet = global_statistics.length
            let WGF = {WGF_bets:WGF.length, WGF_win: WGF_win.length, WGF_lose: WGF_lose.length, WGF_wagered:WGF_wagered, WGF_img:WGF_img }
            let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
            let ppe = {ppe_bets:PPE.length, ppe_win: PPE_win.length, ppe_lose: PPE_lose.length, ppe_wagered:PPE_wagered, ppe_img:PPE_img }
            let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
            let BTC = {BTC_bets:BTC.length, BTC_win: BTC_win.length, BTC_lose: BTC_lose.length, BTC_wagered:BTC_wagered, BTC_img:BTC_img }
            res.status(200).json({total_wagered, total_bet,total_lose,total_win, WGF, ppd, ppe, ppl, BTC})
            });
        },500)
    }
    catch(error){
        res.status(500).json({error})
    }
})

module.exports = { GlobalStat, crashStat , diceStat}
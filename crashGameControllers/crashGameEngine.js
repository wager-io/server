const { Server } = require("socket.io")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const {crashPointFromHash} = require("./hashseed")
const { handleCrashHistory, handleGameCrash , handleMoonTrendballEl} = require("./crashStore.js")
const { connection } = require("../database/index")
const { handleProfileTransactions } = require("../profile_mangement/index")
const {Helper} = require('../utils/helperFunction')
const { handleRechargeimplement } = require("../profile_mangement/cashbacks")
const { handleMonthlyCashbackImplementation } = require("../profile_mangement/monthlycashback")
const { handleWeeklyCashbackImplementation, Nextmonday } = require("../profile_mangement/week_cashback")
const helper = new Helper()
const crypto = require("crypto");


async function createsocket(httpServer){
const fetchHashseed = (async()=>{
    let yu = []
    const consumed = await helper.updateCrashConsume()  || 1
    let query = `SELECT * FROM crash_hash`;
    connection.query(query, async(error, data)=>{
    yu.push(data[data.length - consumed])
    let f = setTimeout(()=>{
        let r = crashPointFromHash(yu[0])
        handleCrashPoint(r)
    },500)
})
})


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});

let details = ''
const handleCrashPoint = ((e)=>{
    details = (e)
})

// ==================== fetch single active users bets ==================================
const fetchUsersBets = (()=>{
    let query = `SELECT * FROM  crash_game`;
    connection.query(query, async function(error, data){
        io.emit("my-bet", data)
    })
})

const fetch_activePlayers = ((game_id)=>{
    let query = `SELECT * FROM  crash_game  WHERE game_id = "${game_id}"`;
    connection.query(query, async function(error, data){
        io.emit("active_players", data)
        io.emit("crash-game-redtrend", data)
    })
})

const fetchPreviousCrashHistory = (()=>{
    let query = `SELECT * FROM  crash_game_history`;
    connection.query(query, async function(error, data){
        io.emit("crash-game-history", data)
    })
})

const autobetWallet = ((event)=>{
    let query = `SELECT * FROM  wallet WHERE user_id="${event.user_id}"`;
    connection.query(query, async function(error, res){
        let old_bal = parseFloat(res[0].balance)
        let win_amount = parseFloat(event.bet_amount) * 1.98
        let update_bal = parseFloat(old_bal + win_amount).toFixed(4)

     let sql2 = `UPDATE wallet SET balance="${update_bal}" WHERE user_id="${event.user_id}" `;
         connection.query(sql2, function (err, result) {
           if (err) throw err;
    })

        let receiverWallet = ''
        if(event.token === "USDT"){
        receiverWallet = `usdt_wallet` 
        }
        else if(event.token === "PPD"){
        receiverWallet = `ppd_wallet` 
        }
        else if(event.token === "PPF"){
            receiverWallet = `ppf_wallet` 
        }

         let sql3 = `UPDATE ${receiverWallet} SET balance="${update_bal}"  WHERE user_id="${event.user_id}"`;
         connection.query(sql3, function (err, result) {
           if (err) throw err;
           (result)
         })

         setTimeout(()=>{
            let trx_rec = {
                user_id: event.user_id,
                transaction_type: "Crash-Win", 
                sender_img: "---", 
                sender_name: "DPP_wallet", 
                sender_balance: 0,
                trx_amount: win_amount,
                receiver_balance: update_bal,
                datetime: currentTime, 
                receiver_name: event.token,
                receiver_img: event.token_img,
                status: 'successful',
                transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
                is_sending: 0
              }
            
              handleProfileTransactions(trx_rec)
         },400)

        io.emit("redball_update_wallet", {update_bal, ...event})
    })

    let sql2 = `UPDATE crash_game SET game_status="${0}", user_status="${0}", cashout="${parseFloat(event.auto_cashout) - 0.01}", profit="${(parseFloat(event.bet_amount) * parseFloat(event.auto_cashout)) - parseFloat(event.bet_amount) - 0.01}", has_won="${1}"  WHERE user_id="${event.user_id}" AND game_id="${event.game_id}" AND game_type="Classic" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
        io.emit("crash-autobet-users", "is-crash")
    });
})

let auto = []
const handleAuto_cashout = ((event, point)=>{
    let query = `SELECT * FROM  crash_game WHERE game_id="${point}" AND game_type="${'Classic'}" `;
    connection.query(query, async function(error, data){
        for(let i = 0; i < data.length; i++){
            if( event > data[i].auto_cashout){
                if(data[i].user_status){
                    if(!auto.includes(data[i].user_id)){
                        auto.push(data[i].user_id)
                        autobetWallet(data[i])
                    }
                }
            }
        }
    })
})

//  ============================================ Red trendball section ==================================================

// Get player's wallet
const GetRedtrendWallet = ((event, game_id)=>{
    let query = `SELECT * FROM  wallet WHERE user_id="${event.user_id}"`;
    connection.query(query, async function(error, res){
        let old_bal = res[0].balance
        let win_amount = parseFloat(event.bet_amount * 1.98)
         let update_bal = parseFloat(old_bal) + win_amount

     let sql2 = `UPDATE wallet SET balance="${update_bal}" WHERE user_id="${event.user_id}" `;
         connection.query(sql2, function (err, result) {
           if (err) throw err;
           (result)
    });
         let receiverWallet = ''
         if(event.token === "USDT"){
           receiverWallet = `usdt_wallet` 
         }
         else if(event.token === "PPD"){
           receiverWallet = `ppd_wallet` 
         }
           else if(event.token === "PPF"){
             receiverWallet = `ppf_wallet` 
         }
         let sql3 = `UPDATE ${receiverWallet} SET balance="${update_bal}"  WHERE user_id="${event.user_id}"`;
         connection.query(sql3, function (err, result) {
           if (err) throw err;
           (result)
         })

         setTimeout(()=>{
            let trx_rec = {
                user_id: event.user_id,
                transaction_type: "Crash-Win", 
                sender_img: "---", 
                sender_name: "DPP_wallet", 
                sender_balance: 0,
                trx_amount: win_amount,
                receiver_balance: update_bal,
                datetime: currentTime, 
                receiver_name: event.token,
                receiver_img: event.token_img,
                status: 'successful',
                transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
                is_sending: 0
              }
              handleProfileTransactions(trx_rec)
         },400)

        io.emit("redball_update_wallet", {update_bal, ...event})
    })

    let sql2 = `UPDATE crash_game SET game_status="${0}", user_status="${0}", cashout="${1.98}", profit="${parseFloat(event.bet_amount) * 1.98}", payout="${1.98}", has_won="${1}"  WHERE user_id="${event.user_id}" AND game_id="${game_id}" AND game_type="Red" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
        io.emit("crash-all-redball-users", "is-crash")
    });
})


// Notify winning update
const handleRedtrendballCashout = ((game_id)=>{
    let query = `SELECT * FROM  crash_game  WHERE game_id="${game_id}" AND game_type="Red"`;
    connection.query(query, async function(error, data){
       for(let i = 0; i < data.length; i++){
        GetRedtrendWallet(data[i], game_id)
        io.emit("crash-all-redball-users", "has_win")
       }
    })
})

//================== update payout and crash hash ===========================
const handleRedTrendballEl = ((game)=>{
    let sql2 = `UPDATE crash_game SET payout="${game.crashpoint}",  game_hash="${game.hash}", game_status="${0}" WHERE game_id="${game.game_id}" AND game_type="Red" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
    });
})

//  ====== red trend ball lost ============
const handleRedTrendball = ((game)=>{
    let sql2 = `UPDATE crash_game SET user_status="${0}", cashout="${0}", profit="${0}", has_won="${0}" WHERE game_id="${game.game_id}" AND game_type="Red" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
        io.emit("crash-all-redball-users", "is-crash")
    });
})

// ==================================================== Green Trendball section =============================================================== 
// Get player's wallet
const GetGreentrendWallet = ((event, game_id)=>{
    let query = `SELECT balance FROM  wallet  WHERE user_id="${event.user_id}"`;
    connection.query(query, async function(error, res){
        let old_bal =  parseFloat(res[0].balance)
        let win_amount = parseFloat(event.bet_amount * 2)
        let update_bal = parseFloat(old_bal + win_amount)
        let sql2 = `UPDATE wallet SET balance="${update_bal}" WHERE user_id="${event.user_id}" `;
        connection.query(sql2, function (err, result) {
          if (err) throw err;
          (result)
        });
        let receiverWallet = ''
        if(event.token === "USDT"){
          receiverWallet = `usdt_wallet` 
        }
        else if(event.token === "PPD"){
          receiverWallet = `ppd_wallet` 
        }
          else if(event.token === "PPF"){
            receiverWallet = `ppf_wallet` 
        }
        let sql3 = `UPDATE ${receiverWallet} SET balance="${update_bal}"  WHERE user_id="${event.user_id}"`;
        connection.query(sql3, function (err, result) {
          if (err) throw err;
          (result)
        })

        setTimeout(()=>{
            let trx_rec = {
                user_id: event.user_id,
                transaction_type: "Crash-Win", 
                sender_img: "---", 
                sender_name: "DPP_wallet", 
                sender_balance: 0,
                trx_amount: win_amount,
                receiver_balance: update_bal,
                datetime: currentTime, 
                receiver_name: event.token,
                receiver_img: event.token_img,
                status: 'successful',
                transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
                is_sending: 0
              }
              handleProfileTransactions(trx_rec)
         },400)


        io.emit("redball_update_wallet", {update_bal, ...event})
})

let sql2 = `UPDATE crash_game SET game_status="${0}", user_status="${0}", cashout="${1.98}", profit="${parseFloat(event.bet_amount) * 1.98}", payout="${1.98}", has_won="${1}"  WHERE user_id="${event.user_id}" AND game_id="${game_id}" AND game_type="Green" `;
connection.query(sql2, function (err, result) {
  if (err) throw err;
  (result)
    io.emit("crash-all-redball-users", "is-crash")
});
})


//================== update payout and crash hash ===========================
const handleGreenTrendballEl = ((game)=>{
    let sql2 = `UPDATE crash_game SET payout="${game.crashpoint}",  game_hash="${game.hash}", game_status="${0}" WHERE game_id="${game.game_id}" AND user_status="${0}" AND game_type="Green" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
    });
})


//  ====== Green trend ball lost ============
const handleGreenTrendball = ((game)=>{
    let sql2 = `UPDATE crash_game SET user_status="${0}", cashout="${0}", profit="${0}", has_won="${0}" WHERE game_id="${game.game_id}" AND game_type="Green" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
        io.emit("crash-all-greenball-users", "is-crash")
    });
})

// Notify winning update
const handleGreentrendballCashout = ((game_id)=>{
    let query = `SELECT * FROM  crash_game  WHERE game_id="${game_id}" AND game_type="Green"`;
    connection.query(query, async function(error, data){
       for(let i = 0; i < data.length; i++){
        GetGreentrendWallet(data[i], game_id)
        io.emit("crash-all-greenball-users", "has_win")
       }
    })
})

// ==================================================== Moon Trendball section =============================================================== 

// Get player's wallet
const GetMoontrendWallet = ((event, game_id)=>{
    let query = `SELECT balance FROM  wallet  WHERE user_id="${event.user_id}"`;
    connection.query(query, async function(error, res){
        let old_bal = parseFloat(res[0].balance)
        let win_amount = parseFloat(event.bet_amount) * 10
        let update_bal = parseInt(old_bal + win_amount)

        let sql2 = `UPDATE wallet SET balance="${update_bal}" WHERE user_id="${event.user_id}" `;
        connection.query(sql2, function (err, result) {
          if (err) throw err;
          (result)
        });

        let receiverWallet = ''
        if(event.token === "USDT"){
          receiverWallet = `usdt_wallet` 
        }
        else if(event.token === "PPD"){
          receiverWallet = `ppd_wallet` 
        }
          else if(event.token === "PPF"){
            receiverWallet = `ppf_wallet` 
        }
        let sql3 = `UPDATE ${receiverWallet} SET balance="${update_bal}"  WHERE user_id="${event.user_id}"`;
        connection.query(sql3, function (err, result) {
          if (err) throw err;
          (result)
        })

        setTimeout(()=>{
            let trx_rec = {
                user_id: event.user_id,
                transaction_type: "Crash-Win", 
                sender_img: "---", 
                sender_name: "DPP_wallet", 
                sender_balance: 0,
                trx_amount: win_amount,
                receiver_balance: update_bal,
                datetime: currentTime, 
                receiver_name: event.token,
                receiver_img: event.token_img,
                status: 'successful',
                transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
                is_sending: 0
              }
              handleProfileTransactions(trx_rec)
         },400)

        io.emit("redball_update_wallet", {update_bal, ...event})
    })


let sql2 = `UPDATE crash_game SET game_status="${0}", user_status="${0}", cashout="${2}", profit="${event.bet_amount * 2}", payout="${2}", has_won="${1}"  WHERE user_id="${event.user_id}" AND game_id="${game_id}" AND game_type="Moon" `;
connection.query(sql2, function (err, result) {
  if (err) throw err;
  (result)
    io.emit("crash-all-moonball-users", "is-crash")
});

})

// Notify winning update
const handleMoontrendballCashout = ((game_id)=>{
    let query = `SELECT * FROM  crash_game  WHERE game_id="${game_id}" AND game_type="Moon"`;
    connection.query(query, async function(error, data){
       for(let i = 0; i < data.length; i++){
        GetMoontrendWallet(data[i], game_id)
        io.emit("crash-all-moonball-users", "has_win")
       }
    })
})



//  ====== Moon trend ball lost ============
const handleMoonTrendball = ((game)=>{
    let sql2 = `UPDATE crash_game SET user_status="${0}", cashout="${0}", profit="${0}", has_won="${0}" WHERE game_id="${game.game_id}" AND game_type="Moon" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
        io.emit("crash-all-moonball-users", "is-crash")
    });
})

let cur
const HandlecrashCurve = ((event)=>{
let count = 0
    cur = setInterval(()=>{
        if(count < 590){
            count += 0.7
        }else{
            count = 588.6
        }
    io.emit("nuppp-curve", count.toFixed(2))
    }, 3)
}) 

let v_two = 0
const handle_V_two = ((speed, action)=>{
    v_two += speed
    if(action){
        io.emit("v_two", v_two)
    }else{
        io.emit("v_two", action)
        v_two = 0
    }
    io.emit("v_default", false)
})

let v_three = 0
const handle_V_three = ((speed, action)=>{
    v_three += speed
    if(action){
        io.emit("v_three", v_three)
    }else{
        io.emit("v_three", action)
        v_three = 0
    }
})


let v_five = 0
const handle_V_Five = ((speed, action)=>{
    v_five += speed
    if(action){
        io.emit("v_five", v_five)
    }else{
        v_five = 0
        io.emit("v_five", action)
    }
})


let v_seven = 0
const handle_V_Seven = ((speed, action)=>{
    v_seven += speed
    if(action){
        io.emit("v_seven", v_seven)
    }else{
        v_seven = 0
        io.emit("v_seven", action)
    }
})

let v_nine = 0
const handle_V_Nine = ((speed, action)=>{
    v_nine += speed
    if(action){
        io.emit("v_nine", v_nine)
    }else{
        v_nine = 0
        io.emit("v_nine", action)
    }
})


let v_ten = 0
const handle_V_Ten = ((speed, action)=>{
    v_ten += speed
    if(action){
        io.emit("v_ten", v_ten)
    }else{
        v_ten = 0
        io.emit("v_ten", action)
    }
})

let v_twenty = 0
const handle_V_Twenty = ((speed, action)=>{
    v_twenty += speed
    if(action){
        io.emit("v_twenty", v_twenty)
    }else{
        v_twenty = 0
        io.emit("v_twenty", action)
    }
})

let v_fivety = 0
const handle_V_Fivety = ((speed, action)=>{
    v_fivety += speed
    if(action){
        io.emit("v_fivety", v_fivety)
    }else{
        v_fivety = 0
        io.emit("v_fivety", action)
    }
})

let v_hundred = 0
const handle_V_Hundred = ((speed, action)=>{
    v_hundred += speed
    if(action){
        io.emit("v_hundred", v_hundred)
    }else{
        v_hundred = 0
        io.emit("v_hundred", action)
    }
})


let v_Twohundred = 0
const handle_V_TwoHundred = ((speed, action)=>{
    v_Twohundred += speed
    if(action){
        io.emit("v_Twohundred", v_Twohundred)
    }else{
        v_Twohundred = 0
        io.emit("v_Twohundred", action)
    }
})


let v_FiveHundred = 0
const handle_V_FiveHundred = ((speed, action)=>{
    v_FiveHundred += speed
    if(action){
        io.emit("v_FiveHundred", v_FiveHundred)
    }else{
        v_FiveHundred = 0
        io.emit("v_FiveHundred", action)
    }
})

let v_thousand = 0
const handle_V_Thousand = ((speed, action)=>{
    v_thousand += speed
    if(action){
        io.emit("v_thousand", v_thousand)
    }else{
        v_thousand = 0
        io.emit("v_thousand", action)
    }
})



let h_two = 18
const handle_H_Two = ((speed, action)=>{
    h_two -= speed
    if(action){
        io.emit("h_two", h_two)
    }else{
        h_two = 18
        io.emit("h_two", action)
    }
})

let h_four = 38
const handle_H_Four = ((speed, action)=>{
    h_four -= speed
    if(action){
        io.emit("h_four", h_four)
    }else{
        h_four = 38
        io.emit("h_four", action)
    }
})


let h_six = 58
const handle_H_Six = ((speed, action)=>{
    h_six -= speed
    if(action){
        io.emit("h_six", h_six)
    }else{
        h_six = 58
        io.emit("h_six", action)
    }
})

let h_eight = 78
const handle_H_Eight = ((speed, action)=>{
    h_eight -= speed
    if(action){
        io.emit("h_eight", h_eight)
    }else{
        h_eight = 78
        io.emit("h_eight", action)
    }
})

let h_ten = 100
const handle_H_Ten = ((speed, action)=>{
    h_ten -= speed
    if(action){
        io.emit("h_ten", h_ten)
    }else{
        h_ten = 100
        io.emit("h_ten", action)
    }
})

let h_twelve = 100
const handle_H_Twelve = ((speed, action)=>{
    h_twelve -= speed
    if(action){
        io.emit("h_twelve", h_twelve)
    }else{
        h_twelve = 100
        io.emit("h_twelve", action)
    }
})

let h_fourteen = 100
const handle_h_fourteen = ((speed, action)=>{
    h_fourteen -= speed
    if(action){
        io.emit("h_fourteen", h_fourteen)
    }else{
        h_fourteen = 100
        io.emit("h_fourteen", action)
    }
})

let h_sixteen = 100
const handle_h_sixteen = ((speed, action)=>{
    h_sixteen -= speed
    if(action){
        io.emit("h_sixteen", h_sixteen)
    }else{
        h_sixteen = 100
        io.emit("h_sixteen", action)
    }
})

let h_eighteen = 100
const handle_h_eighteen = ((speed, action)=>{
    h_eighteen -= speed
    if(action){
        io.emit("h_eighteen", h_eighteen)
    }else{
        h_eighteen = 100
        io.emit("h_eighteen", action)
    }
})

let h_twenty = 100
const handle_h_twenty = ((speed, action)=>{
    h_twenty -= speed
    if(action){
        io.emit("h_twenty", h_twenty)
    }else{
        h_twenty = 100
        io.emit("h_twenty", action)
    }
})

let h_thirthy = 100
const handle_h_thirthy = ((speed, action)=>{
    h_thirthy -= speed
    if(action){
        io.emit("h_thirthy", h_thirthy)
    }else{
        h_thirthy = 100
        io.emit("h_thirthy", action)
    }
})

let h_fourty = 100
const handle_h_fourty = ((speed, action)=>{
    h_fourty -= speed
    if(action){
        io.emit("h_fourty", h_fourty)
    }else{
        h_fourty = 100
        io.emit("h_fourty", action)
    }
})



let h_sixty = 100
const handle_h_sixty = ((speed, action)=>{
    h_sixty -= speed
    if(action){
        io.emit("h_sixty", h_sixty)
    }else{
        h_sixty = 100
        io.emit("h_sixty", action)
    }
})

let h_eighty = 100
const handle_h_eighty = ((speed, action)=>{
    h_eighty -= speed
    if(action){
        io.emit("h_eighty", h_eighty)
    }else{
        io.emit("h_eighty", action)
    }
})


let h_hundred = 100
const handle_h_hundred = ((speed, action)=>{
    h_hundred -= speed
    if(action){
        io.emit("h_hundred", h_hundred)
    }else{
        io.emit("h_hundred", action)
    }
})

// ========================================= Initial loading run ------===========================================================

let load_animate = 100
const HandleCountDown = ( async (e)=>{
    fetchHashseed()
    fetchPreviousCrashHistory()
    fetchUsersBets(details)
    let timeSec = e
    let timeLoop = setInterval(() => {
    if (timeSec.toFixed(2) <= 0.1) {
        clearInterval(timeLoop);
        handleMultiplier(details)
    }else{
        fetch_activePlayers(details.game_id)
        timeSec -= 0.01;
        load_animate -= 0.2

        io.emit("v_five", 0)
        io.emit("v_default", true)
        io.emit("v_two", 0)
        io.emit("v_seven", 0)
        io.emit("v_three", 0)
        io.emit("v_nine", 0)
        io.emit("v_twenty", 0)
        io.emit("crash-state", "load-crash")
        io.emit("countdown", timeSec)
        io.emit("load-animation", load_animate)
        io.emit("game_id", details.game_id)
        io.emit("v_ten", 0)
        io.emit("v_hundred", 0)
        io.emit("v_FiveHundred", 0)
        io.emit("v_thousand", 0)
        io.emit("v_fivety", 0)
        io.emit("v_Twohundred", 0)
        
        io.emit("h_hundred", 0)
        io.emit("h_eighty", 0)
        io.emit("h_sixty", 0)
        io.emit("h_thirthy", 0)
        io.emit("h_fourty", 0)
        io.emit("h_twenty", 0)
        io.emit("h_eighteen", 0)
        io.emit("h_sixteen", 0)
        io.emit("h_fourteen", 0)
        io.emit("h_ten", 0)
        io.emit("h_twelve", 0)
        io.emit("h_eight", 78)
        io.emit("h_six", 58)
        io.emit("h_two", 18)
        io.emit("h_four", 38)
    }
    }, 15);
})


//  =================================== All game crash handler ===================================

const handleCrashed = ((crash_point)=>{
    let data = { game_id: crash_point.game_id, game_hash: crash_point.hash }
    io.emit("crash-state", "hasCrashed")
    io.emit("crash-point", crash_point.crashpoint)
    io.emit("crash-details", data)
    handleCrashHistory(crash_point)
    handleGameCrash(crash_point)
    handleRedTrendballEl(crash_point)
    handleGreenTrendballEl(crash_point)
    handleMoonTrendballEl(crash_point)
    auto = []
    v_five = 0
    v_default = 0
    v_two = 0
    v_three = 0
    v_seven = 0
    v_nine = 0
    v_twenty = 0
    v_ten = 0
    v_hundred = 0
    v_FiveHundred = 0
    v_thousand = 0
    v_fivety = 0
    v_Twohundred = 0

    h_hundred = 100
    h_eighty = 100
    h_sixty = 100 
    h_thirthy = 100
    h_fourty = 100
    h_twenty = 100
    h_eighteen = 100
    h_sixteen = 100
    h_fourteen = 100
    h_ten = 100
    h_twelve = 100
    h_eight = 78
    h_four = 38
    h_six = 58
    h_two = 18

})

// ====================== initialize the game countdown ============================
HandleCountDown(5)

// ================================================ Game logic =======================================

const handleMultiplier = ((point)=>{
    let crash_point = point
    let multiplierEL = 1
    let speed = 0.01
    let trigger = 1
    let triggerEk = 1
    HandlecrashCurve(34)
    let multiplier = setInterval( async() => {
if (multiplierEL >= crash_point.crashpoint) {
        clearInterval(multiplier);
           if(multiplierEL.toFixed(2) < 2 ){
                handleRedtrendballCashout(crash_point.game_id)
                handleGreenTrendball(crash_point)
            }else if(multiplierEL.toFixed(2) < 10){
                handleMoonTrendball(crash_point)
            }
            handleCrashed(crash_point)
            speed = 0.01
            clearInterval(cur)
          setTimeout(() => {
            HandleCountDown(5)
            load_animate = 100
        }, 3000);
      } 
    else {
        fetch_activePlayers(crash_point.game_id)
        handleAuto_cashout( multiplierEL.toFixed(2), crash_point.game_id)
        if( multiplierEL.toFixed(2) > 1.98 &&  multiplierEL.toFixed(2) < 2.99  ){
            speed = 0.02
            handle_V_two(0.8, 1)
            handleRedTrendball(crash_point)
            const called = (()=>{
                if(trigger){
                    handleGreentrendballCashout(crash_point.game_id)
                    trigger = 0
                }
            })
            called()
            if(multiplierEL.toFixed(2) > 2.36 && multiplierEL.toFixed(2) < 2.76){
                handle_H_Twelve(1.2, 1)
                handle_H_Four(0.36, 1)
                handle_H_Ten(0.9, 1)
                handle_H_Two(0.167, 1)
                handle_H_Six(0.6, 1)
                handle_H_Eight(0.8, 1)
            }
            else if(multiplierEL.toFixed(2) > 2.76){
                handle_H_Four(0.24, 1)
                handle_H_Six(0.4, 1)
                handle_H_Twelve(0.9, 1)
                handle_h_fourteen(1.4, 1)
                handle_H_Ten(0.77, 1)
                handle_H_Two(0.188, 1)
                handle_H_Eight(0.6, 1)
            }else{
                handle_H_Two(0.2, 1)
                handle_H_Four(0.5, 1)
                handle_H_Six(0.7, 1)
                handle_H_Eight(0.84, 1)
                handle_H_Ten(1.109, 1)
            }
        }

        else if ( multiplierEL.toFixed(2) > 2.99 &&  multiplierEL.toFixed(2) < 4.99 ){
            speed = 0.0276
            if(multiplierEL.toFixed(2) > 4.5){
                handle_V_two(0.6, 0)
                handle_H_Two(0.02, 1)
                handle_H_Four(0.02, 1)
                handle_H_Six(0.01, 1)
                handle_H_Eight(0.02, 1)
                handle_H_Ten(0.013, 1)
                handle_H_Twelve(0.02, 1)
                handle_h_fourteen(0.02, 1)
                handle_h_sixteen(0.040, 1)
                handle_h_eighteen(0.06, 1)
            }
            else{
                if(multiplierEL.toFixed(2) > 3.5){
                    handle_h_fourteen(0.1, 1)
                    handle_H_Two(0.02, 1)
                    handle_H_Four(0.02, 1)
                    handle_H_Six(0.02, 1)
                    handle_H_Eight(0.02, 1)
                    handle_H_Ten(0.1, 1)
                    handle_H_Twelve(0.08804, 1)
                    handle_h_sixteen(0.15, 1)
                    handle_h_eighteen(0.27, 1)
                }else{
                    handle_H_Two(0.05, 1)
                    handle_H_Four(0.03, 1)
                    handle_H_Six(0.01, 1)
                    handle_H_Eight(0.02, 1)
                    handle_H_Ten(0.1, 1)
                    handle_H_Twelve(0.22, 1)
                    handle_h_fourteen(0.56, 1)
                    handle_h_sixteen(0.80, 1)
                }
            handle_V_two(0.7, 1)
            }
            handle_V_three(0.7, 1)
        }

        else if ( multiplierEL.toFixed(2) > 4.99 &&  multiplierEL.toFixed(2) < 6.99 ){
            speed = 0.0356
            handle_V_three(0.4, 1)
            handle_V_Five(0.73, 1)
            if(multiplierEL.toFixed(2) > 6.2 && multiplierEL.toFixed(2) < 5.5 ){
                handle_h_twenty(0.3, 1)
                handle_H_Ten(0.2, 1)
            }
            else if(multiplierEL.toFixed(2) > 5.5 ){
                handle_h_twenty(0.3, 1)
                handle_H_Ten(0.2, 1)
            }else{
                handle_H_Two(0.00, 0)
                handle_H_Four(0.01, 0)
                handle_H_Six(0.08, 0)
                handle_H_Eight(0.02, 0)
                handle_H_Ten(0.2, 1)
                handle_H_Twelve(0.02431860, 0)
                handle_h_fourteen(0.02, 0)
                handle_h_sixteen(0.04, 0)
                handle_h_eighteen(0.046, 0)
                handle_h_twenty(0.3, 1)
            }
        }
        else if ( multiplierEL.toFixed(2) > 6.99 &&  multiplierEL.toFixed(2) < 9.99 ){
            speed = 0.0596
            if(multiplierEL.toFixed(2) > 9){
                handle_V_Nine(0.6, 1)
            }
            handle_V_three(0.16, 1)
            handle_V_Five(0.3, 1)
            handle_V_Seven(0.7, 1)
            handle_h_twenty(0.3, 1)
            handle_H_Ten(0.3, 1)
        }
        else if ( multiplierEL.toFixed(2) > 9.99 &&  multiplierEL.toFixed(2) < 14.99 ){
            speed = 0.0806
            handle_V_three(0.16, 0)
            handle_V_Five(0.3, 0)
            handle_V_Seven(0.7, 0)
            handle_V_Ten(0.6, 1)
            handle_V_Nine(0.6, 0)
            const called = (()=>{
                if(triggerEk){
                    handleMoontrendballCashout(crash_point.game_id)
                    triggerEk = 0
                }
            })
            called()

            handle_H_Ten(0.3, 0)
            handle_h_twenty(0.3, 1)
        }
        else if ( multiplierEL.toFixed(2) > 14.99 &&  multiplierEL.toFixed(2) < 19.99 ){
            speed = 0.0967
            handle_V_Ten(0.6, 1)
            handle_h_thirthy(0.3, 1)
            handle_h_twenty(0.3, 1)
        }
        else if ( multiplierEL.toFixed(2) > 19.99 &&  multiplierEL.toFixed(2) < 50.99 ){
            speed = 0.1256
            if( multiplierEL.toFixed(2) > 30.99 ){
                handle_V_Twenty(0.3, 1)
                handle_V_Ten(0.2, 0)
                handle_h_thirthy(0.3, 1)
                handle_h_twenty(0.3, 0)
            }else{
                handle_V_Twenty(0.5, 1)
                handle_V_Ten(0.2, 1)

                handle_h_thirthy(0.3, 1)
                handle_h_twenty(0.3, 0)
            }

       
        }
        else if ( multiplierEL.toFixed(2) > 50.99 &&  multiplierEL.toFixed(2) < 100.99 ){
            speed = 0.1556
            if( multiplierEL.toFixed(2) > 70.99 ){
                handle_V_Fivety(0.2, 1)
                handle_h_fourty(0.3, 1)
                handle_h_thirthy(0.3, 0)
            }else{
                handle_V_Fivety(0.4, 1)
                handle_V_Twenty(0.4, 0)
                handle_V_Ten(0.2, 0)
                handle_h_thirthy(0.3, 0)
                handle_h_fourty(0.3, 1)
                handle_h_twenty(0.3, 0)
            }
        }
        else if ( multiplierEL.toFixed(2) > 100.99 && multiplierEL.toFixed(2) < 200){
            speed = 0.256
            if( multiplierEL.toFixed(2) > 150.99 ){
                handle_V_Hundred(0.16, 1)
            }else{
                handle_V_Fivety(0.6, 0)
                handle_V_Hundred(0.3, 1)
                handle_h_fourty(0.3, 1)
                handle_h_thirthy(0.3, 0)
            }
          
        }
        if(multiplierEL.toFixed(2) > 200 && multiplierEL.toFixed(2) < 500){
            handle_V_Hundred(0.1, 0)
            speed = 0.306
            if( multiplierEL.toFixed(2) > 250.99 ){
                handle_h_fourty(0.01, 0)
                handle_V_TwoHundred(0.07, 1)
            }else{
                handle_h_fourty(0.01, 0.04)
                handle_V_TwoHundred(0.13, 1)
            }
        }
        if(multiplierEL.toFixed(2) > 500 && multiplierEL.toFixed(2) < 1000){
            speed = 0.406

            handle_h_sixty(0.06, 1)
            handle_V_TwoHundred(0.17, 0)
            handle_V_FiveHundred(0.07 , 1)
        }
         if(multiplierEL.toFixed(2) > 1000 ){
             speed = 0.506
             handle_V_FiveHundred(0.05 , 0)
             handle_V_Thousand(0.05, 1)
         } 
            io.emit("crash-state", "crash-isRunning")
            io.emit("running-crash", multiplierEL.toFixed(2))
     }
     multiplierEL  += speed;
    }, 100);
})

const fetchActivePlayers = (()=>{
    let query1 = `SELECT * FROM  dice_game`;
    connection.query(query1, async function(error, data){
        io.emit("dice-gamePLayers", data)
    })
})


setInterval(()=>{
    fetchActivePlayers()
}, 2000)

//================ weeklyCASHBACK ================
const weeklyCashback = async () => {
    let query = `SELECT * FROM app_timer`;
    connection.query(query, async(error, data)=>{
        let alldate = (data[data.length - 1].next_monday)
            let countDownDate = alldate.getTime();
            let now = new Date().getTime();
            let distance = countDownDate - now;
            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (days === 0  && hours === 0 && minutes === 0 && seconds < 3) {
                handleWeeklyCashbackImplementation();
                Nextmonday()
                handleRechargeimplement()
            }else{
                io.emit("weekly-count-down", `${ days !== 0 ? days + "d" : ""} ${hours}h ${minutes}m ${seconds}s`)
            }
    })
}
setInterval(() => weeklyCashback(), 1000);

//================ weeklyCASHBACK ================
const monthlyCashback = async () => {
    let query = `SELECT * FROM app_timer`;
    connection.query(query, async(error, data)=>{
        let alldate = (data[data.length - 1].next_firstofthemonth)
            let countDownDate = alldate.getTime();
            let now = new Date().getTime();
            let distance = countDownDate - now;
            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (new Date().getDate() === 1) {
                Nextmonday()
                handleMonthlyCashbackImplementation()
            }else{
                io.emit("monthly-count-down", `${ days !== 0 ? days + "d" : ""} ${hours}h ${minutes}m ${seconds}s`)
            }
    })
}

setInterval(() => monthlyCashback(), 1000);
const previousChats = (()=>{
    let query = `SELECT * FROM public_chat`;
    connection.query(query, async function(error, response){
        io.emit("public-chat", response)
    })
})
setInterval(() => previousChats(), 400);
}

module.exports = {
    createsocket
}
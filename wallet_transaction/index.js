const { connection } = require("../database/index")

// ================ store USDt wallet details ===================
const createUsdt = (async(user_id,wallet="null")=>{
    let balance =  wallet !== "null"? wallet : 0.0000
    let coin_image = "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
    let coin_name = "USDT"
    let coin_fname = "Tether"
    let is_active = 1
    let data = {user_id, balance, coin_image, coin_fname, coin_name, is_active}
    let sql = `INSERT INTO usdt_wallet SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            console.log(err)
        }else{
            (result)
        }
    })
})

 // ================ store PPD wallet  details===================
 const createPPD = ((user_id)=>{
    let balance =  0.0000
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828435/dpp_logo_sd2z9d.png"
   let coin_fname = "PLay PLay Dollar"
    let coin_name = "PPD"
    let is_active = 1
    let data = {user_id, balance, coin_image, coin_name,coin_fname, is_active}
    let sql = `INSERT INTO ppd_wallet SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            console.log(err)
        }else{
           (result)
        }
    })
})

// ================ store PPE wallet  details===================
const createPPE = ((user_id)=>{
    let balance = 1000
    let coin_image = "https://www.linkpicture.com/q/ppe_logo.png"
   let coin_fname = "PLAY PLAY EARN"
    let coin_name = "PPE"
    let data = {user_id, balance, coin_image,coin_fname, coin_name,}
    let sql = `INSERT INTO ppe_wallet SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            console.log(err)
        }else{
            (result)
        }
    })
})

// ================ store PPL wallet  details===================
const createPPL = ((user_id)=>{
    let balance = 0.0000
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697827828/ppl_logo_mxiaot.png"
    let coin_fname = "PLAY PLAY LOTTERY"
    let coin_name = "PPL"
    let is_active = 1 
    let data = {user_id, balance, coin_image, coin_fname , coin_name, is_active}
    let sql = `INSERT INTO ppl_wallet SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            console.log(err)
        }else{
            (result)
        }
    })
})

// ================ store PPF wallet  details===================
const createPPF = ((user_id)=>{
    let now = new Date()
    let balance = 0
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828376/ppf_logo_ntrqwg.png"
    let coin_fname = "PLAY PLAY FUN"
    let coin_name = "PPF"
    let date = now.getDate() - 1 
    let is_active = 1
    let data = {user_id, balance, coin_image, coin_fname, coin_name, date, is_active}
    let sql = `INSERT INTO ppf_wallet SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            console.log(err)
        }else{
            (result)
        }
    })
})

module.exports = {createPPF, createPPL, createPPE, createPPD, createUsdt }
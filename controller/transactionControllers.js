const { connection } = require("../database/index")
const { ethers } = require("ethers");
const crypto = require("crypto")
const uuid1 = crypto.randomUUID()
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');


const handleWithrawal = (async(req, res)=>{
    const user_id = req.user_id
    const data = req.body

    const db_data = {user_id}

    // ================== check balance, if it's greater than one, it means the wallet is funded =================
    const balance = await provider.getBalance(address)
        if(balance !== 0){
            let sql = `INSERT INTO usdt_wallet SET WHERE user_id=${user_id}`;
            connection.query(sql, balance, (err, data)=>{
            if(err){
                console.log(err)
        }else{
            console.log(data)
            }
        })
    }
})


const handleSwap = (async (req,res)=>{
    const user_id = req.id
    const data = req.body
    let event_timedate =currentTime
    let wallet = ''
    let sender_img = ''
    // Sender Wallet
    if(data.senderCoin === "USDT"){
        wallet = `usdt_wallet` 
        sender_img = "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
    }
    else if(data.senderCoin === "PPD"){
        wallet = `ppd_wallet` 
        sender_img = "https://www.linkpicture.com/q/dpp_logo.png"
    }
    else if(data.senderCoin === "PPE"){
        wallet = `ppe_wallet` 
        sender_img = "https://www.linkpicture.com/q/ppe_logo.png"
    }
    else if(data.senderCoin === "PPL"){
        wallet = `ppl_wallet` 
        sender_img = "https://www.linkpicture.com/q/ppl_logo.png"
    }

    // Receiver wallet
    let receiverWallet = ''
    if(data.receivedCoin === "USDT"){
        receiverWallet = `usdt_wallet` 
    }
    else if(data.receivedCoin === "PPD"){
        receiverWallet = `ppd_wallet` 
    }
    else if(data.receivedCoin === "PPE"){
        receiverWallet = `ppe_wallet` 
    }
    else if(data.receivedCoin === "PPL"){
        receiverWallet = `ppl_wallet` 
    }

    // sender DB
    let query = `SELECT balance FROM ${wallet}  WHERE user_id = "${user_id}"`;
    connection.query(query, async (error, data)=>{
        let olderSenderBalance = data[0].balance
        handleOlderSenderBal(olderSenderBalance)
    })

    // Receiver DB
    let query1 = `SELECT balance FROM ${receiverWallet}  WHERE user_id = "${user_id}"`;
    connection.query(query1, async (error, data)=>{
        let olderSenderBalance = data[0].balance
        handleOlderReceiveBal(olderSenderBalance)
    })

    const handleOlderSenderBal = ((e)=>{
        let result =  parseInt(e) - parseInt(data.sentAmount)
        let sql = `UPDATE ${wallet} SET balance="${result}"  WHERE user_id = "${user_id}"`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log(result)
        });

           // update default wallet
        let sql3 = `UPDATE wallet SET  balance="${result}", coin_name="${data.senderCoin}", 
        coin_image="${sender_img}"  WHERE user_id = "${user_id}"`;
        connection.query(sql3, function (err, result) {
        if (err) throw err;
        result
        });
    })

    const handleOlderReceiveBal = ((e)=>{
        let result = parseInt(e) + parseInt(data.receivedAmount)
        let sql = `UPDATE ${receiverWallet} SET balance="${result}"  WHERE user_id = "${user_id}"`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
          res.status(200).json(result)
        });
    })

    // Storing history in the transaction DB
    let fullData = {user_id, datetime: event_timedate, type_of_transation:"Swap Token", status:"Successful", trx_from:data.senderCoin, 
    trx_to: data.receivedCoin, transaction_id:uuid1, trx_sent_amount : data.sentAmount, trx_received_amount :  data.receivedAmount }

    let sql = `INSERT INTO transactions SET ?`;
    connection.query(sql, fullData, (err, result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
})

module.exports = { handleSwap }

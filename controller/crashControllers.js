const { connection } = require("../database/index")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const crypto = require('crypto')
const updateUserWallet = ((data)=>{
  let sql = `UPDATE wallet SET balance="${data.current_amount}" WHERE user_id = "${data.user_id}"`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    (result)
  });

  let receiverWallet = ''
  if(data.bet_token_name === "USDT"){
      receiverWallet = `usdt_wallet` 
  }
  else if(data.bet_token_name === "PPD"){
      receiverWallet = `ppd_wallet` 
  }
  else if(data.bet_token_name === "PPL"){
      receiverWallet = `ppl_wallet` 
  }
  else if(data.bet_token_name === "PPF"){
    receiverWallet = `ppf_wallet` 
}

let sql2 = `UPDATE ${receiverWallet} SET balance="${data.current_amount}"  WHERE user_id = "${data.user_id}"`;
  connection.query(sql2, function (err, result) {
    if (err) throw err;
    (result)
  });
})

const CraeatBetGame = (async(data)=>{
  let bet = {
    user_id: data.user_id,
    username: data.username,
    profile_img: data.user_img,
    bet_amount: data.bet_amount,
    token: data.bet_token_name,
    token_img:data.bet_token_img,
    bet_id: Math.floor(Math.random()*10000000)+ 72000000,
    game_id: data.game_id,
    cashout: 0,
    auto_cashout: data.auto_cashout,
    profit: 0,
    game_hash: "",
    hidden_from_public: data.hidden,
    game_type: data.game_type,
    user_status: 1,
    game_status: 1,
    time: currentTime,
    payout: 0.0000,
    has_won : 0 ,
    chance: data.chance
  }


  let trx_rec = {
    user_id: data.user_id,
    transaction_type: "Crash-Betting", 
    sender_img: data.bet_token_img, 
    sender_name: data.bet_token_name, 
    sender_balance: data.current_amount,
    trx_amount:  data.bet_amount,
    receiver_balance: 0,
    datetime: currentTime, 
    receiver_name: 'DPP_wallet',
    receiver_img: "---",
    status: 'successful',
    transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
    is_sending: 1
  }
  handleProfileTransactions(trx_rec)

  let sql = `INSERT INTO crash_game SET ?`;

try {
  const result = await new Promise((resolve, reject) => {
    connection.query(sql, bet, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
} catch (err) {
  console.error(err);
}
})


let hidden;
const handleCrashBet = (async(req, res)=>{
  const user_id = req.id
  const {data} = req.body
  let sent_data = data
  let game_type = "Classic"
  try {

    if(sent_data.bet_token_name !== "PPF"){
      handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
    }

    let query = `SELECT * FROM  wallet  WHERE user_id = "${user_id}"`;
    connection.query(query, async function(error, respo){
    if(respo[0].hidden_from_public){
      hidden = 1
    }else{
      hidden = 0
    }

    let previous_bal = respo[0].balance
    let bet_amount = sent_data.bet_amount
    let current_amount = previous_bal - bet_amount
      CraeatBetGame({...sent_data, hidden, user_id, game_type, current_amount})
      updateUserWallet({current_amount, ...sent_data, user_id})
      res.status(200).json({...sent_data,current_amount, bet_amount})
    })
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const UpdateCashout = ((io)=>{
  let sql = `UPDATE wallet SET balance="${io.cash}" WHERE user_id = "${io.user_id}"`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    (result)
  });

  let receiverWallet = ''
  if(io.bet_token_name === "USDT"){
    receiverWallet = `usdt_wallet` 
  }
  else if(io.bet_token_name === "PPD"){
    receiverWallet = `ppd_wallet` 
  }
  else if(io.bet_token_name === "PPE"){
      receiverWallet = `ppe_wallet` 
  }
    else if(io.bet_token_name === "PPL"){
        receiverWallet = `ppl_wallet` 
    }
    else if(io.bet_token_name === "PPF"){
      receiverWallet = `ppf_wallet` 
  }

  let sql2 = `UPDATE ${receiverWallet} SET balance="${io.cash}"  WHERE user_id = "${io.user_id}"`;
  connection.query(sql2, function (err, result) {
    if (err) throw err;
    (result)
  });
})

const handleUpdateCrashState = (event)=>{
  let sql2 = `UPDATE crash_game SET cashout="${event.crash}", has_won="${1}", profit="${event.profit}",  user_status="${0}"
  WHERE user_id="${event.user_id}" AND game_id=${event.game_id} `;
  connection.query(sql2, function (err, result) {
    if (err) throw err;
    (result)
  });


  let trx_rec = {
    user_id: event.user_id,
    transaction_type: "Crash-Win", 
    sender_img: "---", 
    sender_name: "DPP_wallet", 
    sender_balance: 0,
    trx_amount: event.stopped_amount,
    receiver_balance: event.current_amount,
    datetime: currentTime, 
    receiver_name: event.bet_token_name,
    receiver_img: event.bet_token_img,
    status: 'successful',
    transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
    is_sending: 0
  }
  handleProfileTransactions(trx_rec)

}

const handleCashout = ((req, res)=>{
  const user_id = req.id
  const {data} = req.body
  let sent_data = data
  try {
    let query = `SELECT * FROM  wallet WHERE user_id = "${user_id}"`;
    connection.query(query, async function(error, data){
    let previous_bal = parseFloat(data[0].balance)
    let stopped_amount = parseFloat(sent_data.cashout_at)
    let cash = parseFloat(previous_bal + stopped_amount).toFixed(4)
    handleUpdateCrashState({...sent_data, user_id, current_amount:cash, stopped_amount })
    UpdateCashout({cash, ...sent_data, user_id})
      res.status(200).json({...sent_data, cash})
    })
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const handleRedTrendball = (async(req, res)=>{
  const user_id = req.id
  const {data} = req.body
  let sent_data = data

  if(sent_data.bet_token_name !== "PPF"){
    handleWagerIncrease(user_id, sent_data.bet_amount)
  }

  try {
    let query = `SELECT * FROM  wallet  WHERE user_id = "${user_id}"`;
    connection.query(query, async function(error, data){
    let previous_bal = parseFloat(data[0].balance)
    let bet_amount = parseFloat(sent_data.bet_amount)
    let current_amount = parseFloat(previous_bal - bet_amount).toFixed(4)
      if(data[0].hidden_from_public){
        hidden = 1
      }else{
        hidden = 0
      }
      CraeatBetGame({...sent_data,hidden, user_id, current_amount})
      updateUserWallet({current_amount, ...sent_data, user_id})
      res.status(200).json({...sent_data,current_amount, bet_amount})
    })
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

module.exports = { handleCrashBet, handleCashout , handleRedTrendball}
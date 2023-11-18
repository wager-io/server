const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const crash_game = require("../model/crashgame")
const BTC_wallet = require("../model/btc-wallet")
const WGFWallet = require("../model/WGF-wallet")
const ETHwallet = require("../model/ETH-wallet")

const updateUserWallet = (async(data)=>{
  if(data.bet_token_name === "WGF"){
    await WGFWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  }
 if(data.bet_token_name === "BTC"){
    await BTC_wallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  }
  if(data.bet_token_name === "ETH"){
    await ETHwallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  }
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
    game_hash: "-",
    hidden_from_public: data.hidden,
    game_type: data.game_type,
    user_status: 1,
    game_status: 1,
    time: data.time,
    payout: 0.0000,
    has_won : 0 ,
    chance: data.chance
  }
try {
  await crash_game.create(bet)
} catch (err) {
  console.error(err);
}
})

let hidden = false
const handleCrashBet = (async(req, res)=>{
  try {
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data
  let game_type = "Classic"
  if(sent_data.bet_token_name !== "WGF"){
    handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
  }
  let current_amount; 
  if(sent_data.bet_token_name === "WGF"){
    let skjk = await WGFWallet.find({user_id})
    current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
  }

  if(sent_data.bet_token_name === "BTC"){
    let skjk = await BTC_wallet.find({user_id})
    current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
  }

  if(sent_data.bet_token_name === "ETH"){
    let skjk = await ETHwallet.find({user_id})
    current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
  }

    CraeatBetGame({...sent_data, hidden, user_id, game_type})
    updateUserWallet({ ...sent_data, user_id, current_amount})
    res.status(200).json({...sent_data,current_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const handleUpdateCrashState = async(event)=>{
  await crash_game.updateOne({ user_id:event.user_id, game_id:event.game_id }, 
  {cashout: event.crash, 
    profit:event.profit,
    user_status:false ,
    has_won: true
   });
}

const handleCashout = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data
  try {
    let current_amount; 
    if(sent_data.bet_token_name === "WGF"){
      let skjk = await WGFWallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
    }
  
    if(sent_data.bet_token_name === "BTC"){
      let skjk = await BTC_wallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
    }
  
    if(sent_data.bet_token_name === "ETH"){
      let skjk = await ETHwallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
    }
    handleUpdateCrashState({...sent_data, user_id, current_amount:current_amount })
    updateUserWallet({current_amount, ...sent_data, user_id})
      res.status(200).json({...sent_data, balance:current_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const handleRedTrendball = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data

  if(sent_data.bet_token_name !== "WGF"){
    handleWagerIncrease(user_id, sent_data.bet_amount)
  }

  try {
    let current_amount; 
    if(sent_data.bet_token_name === "WGF"){
      let skjk = await WGFWallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
    }
  
    if(sent_data.bet_token_name === "BTC"){
      let skjk = await BTC_wallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
    }
  
    if(sent_data.bet_token_name === "ETH"){
      let skjk = await ETHwallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
    }
  
      CraeatBetGame({...sent_data, hidden, user_id})
      updateUserWallet({ ...sent_data, user_id, current_amount})
      res.status(200).json({...sent_data,current_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
    console.log(err)
  }
})


module.exports = { handleCrashBet, handleCashout , handleRedTrendball}
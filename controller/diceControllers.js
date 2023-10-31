const crypto = require('crypto');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const DiceEncription = require("../model/dice_encryped_seeds")
const DiceGame = require("../model/dice_game")
const Wallet = require("../model/wallet")
const USDTWallet = require("../model/Usdt-wallet")
const Ethwallet = require("../model/PPL-wallet")
const PPFWallet = require("../model/PPF-wallet")

let nonce = 0
let maxRange = 100
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
function generateRandomNumber(serverSeed, clientSeed, hash) {
  nonce += 1
  const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}`;
  const hmac = crypto.createHmac('sha256', combinedSeed);
  const hmacHex = hmac.digest('hex');
  const decimalValue = (parseInt(hmacHex , 32) % 10001 / 100)
  const randomValue = (decimalValue % maxRange).toFixed(2);
  let row = { point : randomValue, server_seed:serverSeed, client_seed:clientSeed, nonce }
  return row;
}


const updateUserWallet = (async(data)=>{
  await Wallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount });
  if(data.bet_token_name === "WGF"){
    await PPFWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount });
  }
  else if(data.bet_token_name === "BTC"){
    await USDTWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount });
  }
  else if(data.bet_token_name === "ETH"){
    await Ethwallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount });
  }
})


const handleDiceBet = (async(req,res)=>{
    const {user_id} = req.id
    let {sent_data} = req.body

    const GetEncryptedSeeds = (async(user_id)=>{
      const CraeatBetGame = (async(data)=>{
        let bet = {
          user_id: data.user_id,
          username: data.username,
          profile_img: data.user_img,
          bet_amount: data.bet_amount,
          token: data.bet_token_name,
          token_img:data.bet_token_img,
          bet_id: Math.floor(Math.random()*10000000)+ 72000000,
          game_nonce: nonce,
          cashout: parseFloat(data.io.point),
          profit: data.payoutIO,
          client_seed: data.io.client_seed,
          server_seed: data.io.server_seed,
          time: data.time,
          hidden_from_public: data.hidden,
          payout: data.payout,
          has_won : data.has_won,
          chance: data.chance
        }
        let wallet = {
            coin_name: data.bet_token_name,
            coin_image:  data.bet_token_img,
            balance:  parseFloat(data.current_amount).toFixed(4),
        }
           let previusGame = await DiceGame.find({user_id})
           let result = await DiceGame.create(bet)
            res.status(200).json({history:[...previusGame, result], wallet,point: parseFloat(data.io.point)})

            let trx_rec = {
              user_id: data.user_id,
              transaction_type: data.has_won ? "Classic Dice-Win" : "Classic Dice-Betting", 
              sender_img: "-", 
              sender_name: "DPP_wallet", 
              sender_balance: 0,
              trx_amount: data.has_won ? data.payoutIO : data.bet_amount,
              receiver_balance: data.current_amount,
              datetime: currentTime, 
              receiver_name: data.bet_token_name,
              receiver_img: data.bet_token_img,
              status: 'successful',
              transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
              is_sending: 0
            }
            handleProfileTransactions(trx_rec)
        })

        let hidden;
        let response =  await DiceEncription.find({user_id})
        let server = response[response.length - 1].server_seed
        let client = response[response.length - 1].client_seed
        let hash = response[response.length - 1].hash_seed

        if(sent_data.bet_token_name !== "WGF"){
          handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
        }

        const randomResult = generateRandomNumber(server, client, hash);

          if(parseFloat(sent_data.chance) > parseFloat(randomResult.point)){
            try {
              let sjbhsj = await Wallet.find({user_id})
              if(sjbhsj[0].hidden_from_public){
                  hidden = true
                }else{
                  hidden = false
              }
                let previous_bal = parseFloat(sjbhsj[0].balance)
                let wining_amount = parseFloat(sent_data.wining_amount)
                let current_amount = (previous_bal + wining_amount).toFixed(4)

              updateUserWallet({current_amount, ...sent_data, user_id})
              CraeatBetGame({...sent_data, user_id, payoutIO:wining_amount,hidden,  has_won : true, io: randomResult, current_amount})
            } catch (err) {
              res.status(501).json({ message: err.message });
            }
          }else{
          try {
            let response =  await Wallet.find({user_id})
              if(response[0].hidden_from_public){
                hidden = true
              }else{
                hidden = false
              }
            let previous_bal = parseFloat(response[0].balance)
            let bet_amount = parseFloat(sent_data.bet_amount)
            let current_amount = (previous_bal - bet_amount).toFixed(4)
            CraeatBetGame({...sent_data, user_id,payoutIO:0,hidden, has_won : false, io: randomResult, current_amount})
            updateUserWallet({current_amount, ...sent_data, user_id})
          } catch (err) {
            res.status(501).json({ message: err.message });
          }
        }
    })
  
  if(sent_data.bet_amount < 0.2){
    res.status(501).json({ error:  "Minimum Bet amount for classic Dice is 0.20"});
  } 
  else if (sent_data.bet_amount > 5000){
    res.status(501).json({ error:  "Minimum Bet amount for classic Dice is 5000"});
  } else{
    GetEncryptedSeeds(user_id)
  }
})


const seedSettings = (async ( req, res )=>{
    let {user_id} = req.id
    let {data} = req.body
const handleHashGeneration = (()=>{
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const clientSeed = data;
  const combinedSeed = serverSeed + salt + clientSeed;
  const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
  return hash
})
  try{
    let client_seed = data
    let server_seed = handleHashGeneration()
    nonce = 0
    await DiceEncription.updateOne({user_id},{
      server_seed:server_seed,
      client_seed:client_seed,
      updated_at:currentTime
    })
    res.status(200).json("Updated sucessfully")
  }
  catch(err){
    res.status(501).json({ message: err });
  }
})





const getDiceGameHistory = (async (req, res)=>{
    const {user_id} = req.id
    try {
      let disoa = await DiceGame.find({user_id})
        res.status(200).json(disoa)
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
})


// ============================== Initialize dice game ===============================
const InitializeDiceGame = (async(user_id)=>{

  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function generateString(length) {
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }
  
  const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
  
const handleHashGeneration = (()=>{
      const serverSeed = crypto.randomBytes(32).toString('hex');
      const clientSeed = generateString(23);
      const combinedSeed = serverSeed + salt + clientSeed;
      const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
      let encrypt = { hash, clientSeed, serverSeed }
      return encrypt
  })
    let data = {
        user_id: user_id,
        server_seed: handleHashGeneration().serverSeed,
        hash_seed: handleHashGeneration().hash,
        client_seed:handleHashGeneration().clientSeed,
        is_open:false,
        updated_at: currentTime
    }
     await DiceEncription.create(data)
  })

const handlePrev_Games = (async(req, res)=>{
    
})
  

module.exports = { handleDiceBet , getDiceGameHistory, seedSettings, InitializeDiceGame, handlePrev_Games}
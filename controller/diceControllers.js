const { connection } = require("../database/index")
const crypto = require('crypto');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")

let nonce = 0
let maxRange = 100
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
function generateRandomNumber(serverSeed, clientSeed) {
    nonce += 1
  const combinedSeed = `${serverSeed}-${clientSeed}-${nonce}`;
  const hmac = crypto.createHmac('sha256', combinedSeed);
  const hmacHex = hmac.digest('hex');
  const decimalValue = (parseInt(hmacHex , 32) % 10001 / 100)
  const randomValue = (decimalValue % maxRange).toFixed(2);
  let row = { point : randomValue, server_seed:serverSeed, client_seed:clientSeed, nonce }
  return row;
}


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
    else if(data.bet_token_name === "PPE"){
        receiverWallet = `ppe_wallet` 
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


const handleDiceBet = ((req,res)=>{
    const user_id = req.id
    let {sent_data} = req.body

    const GetEncryptedSeeds = ((user_id)=>{
        let previusGame = []

        const CraeatBetGame = ((data)=>{
          let date = new Date();
          let hours = date.getHours();
          let minutes = date.getMinutes();
          let newformat = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          let time = (hours + ':' + minutes + ' ' + newformat);

            let bet = {
              user_id: data.user_id,
              username: data.username,
              profile_img: data.user_img,
              bet_amount: data.bet_amount,
              token: data.bet_token_name,
              token_img:data.bet_token_img,
              bet_id: Math.floor(Math.random()*10000000)+ 72000000,
              game_nonce: nonce,
              cashout: data.io.point,
              profit: data.payoutIO,
              client_seed: data.io.client_seed,
              server_seed: data.io.server_seed,
              time: time,
              hidden_from_public: data.hidden,
              payout: data.payout,
              has_won : data.has_won,
              chance: data.chance,
              time_date: currentTime
            }

            let wallet = {
                coin_name: data.bet_token_name,
                coin_image:  data.bet_token_img,
                balance:  (data.current_amount).toFixed(4),
            }

            res.status(200).json({history:[...previusGame[0], bet], wallet,point: data.io.point})
        
            let sql = `INSERT INTO dice_game SET ?`;
            connection.query(sql, bet, (err, result)=>{
                if(err){
                    (err)
                }else{
                  (result)
                }
            })

            let trx_rec = {
              user_id: data.user_id,
              transaction_type: data.has_won ? "Classic Dice-Win" : "Classic Dice-Betting", 
              sender_img: "", 
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
        let query = `SELECT * FROM dice_encryped_seeds WHERE user_id="${user_id}"`;
        connection.query(query, async function(error, response){
  
          let server = response[0].server_seed
          let client = response[0].client_seed

          if(sent_data.bet_token_name !== "PPF"){
            handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
          }

          const randomResult = generateRandomNumber(server, client);
          if(parseFloat(sent_data.chance) > parseFloat(randomResult.point)){
            try {
                let query = `SELECT * FROM  wallet  WHERE user_id = "${user_id}"`;
                connection.query(query, async function(error, data){
                  if(data[0].hidden_from_public){
                    hidden = 1
                  }else{
                    hidden = 0
                }
                let previous_bal = parseFloat(data[0].balance)
                let wining_amount = parseFloat(sent_data.wining_amount)
                let current_amount = previous_bal + wining_amount

                updateUserWallet({current_amount, ...sent_data, user_id})
                CraeatBetGame({...sent_data, user_id, payoutIO:wining_amount,hidden,  has_won : 1, io: randomResult, current_amount})
                })
            } catch (err) {
              res.status(501).json({ message: err.message });
            }
          }else{
              try {
                  let query = `SELECT * FROM  wallet  WHERE user_id = "${user_id}"`;
                connection.query(query, async function(error, data){
                  if(data[0].hidden_from_public){
                    hidden = 1
                  }else{
                    hidden = 0
                  }
                let previous_bal = parseFloat(data[0].balance)
                let bet_amount = parseFloat(sent_data.bet_amount)
                let current_amount = previous_bal - bet_amount
                CraeatBetGame({...sent_data, user_id,payoutIO:"0.00",hidden, has_won : 0, io: randomResult, current_amount})
                updateUserWallet({current_amount, ...sent_data, user_id})
                })
              } catch (err) {
                res.status(501).json({ message: err.message });
              }
          }
        })

        let query1 = `SELECT * FROM  dice_game  WHERE user_id="${user_id}"`;
        connection.query(query1, async function(error, data){
           previusGame.push(data)
        })
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
    let user_id = req.id
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
    let sql2 = `UPDATE dice_encryped_seeds SET server_seed="${server_seed}", client_seed="${client_seed}",  updated_at="${currentTime}"  WHERE user_id="${user_id}"`;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
    });
    res.status(200).json("Updated sucessfully")
  }
  catch(err){
    res.status(501).json({ message: err });
  }
})





const getDiceGameHistory = (async (req, res)=>{
    const user_id = req.id
    try {
      let query = `SELECT * FROM  dice_game  WHERE user_id="${user_id}"`;
      connection.query(query, async function(error, data){
          res.status(200).json(data)
      })
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
})



// ============================== Initialize dice game ===============================
const InitializeDiceGame = ((user_id)=>{

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
  // Generate a random server seed 
      const serverSeed = crypto.randomBytes(32).toString('hex');
      // The client provides their own seed
      const clientSeed = generateString(23);
      // Combine the server seed and client seed with a salt
      const combinedSeed = serverSeed + salt + clientSeed;
      // Create a hash of the combined seed using SHA-256 (or a different hash function if preferred)
      const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
      let encrypt = { hash, clientSeed }
      return encrypt
  })
  
      let data = {
          user_id: user_id,
          server_seed: handleHashGeneration().hash,
          client_seed: handleHashGeneration().clientSeed,
          updated_at: currentTime
      }
      let sql = `INSERT INTO dice_encryped_seeds SET ?`;
      connection.query(sql, data, (err, result)=>{
          if(err){
              console.log(err)
          }else{
              (result)
          }
      })
  })
  

module.exports = { handleDiceBet , getDiceGameHistory, seedSettings, InitializeDiceGame}
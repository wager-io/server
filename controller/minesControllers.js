const crypto = require('crypto');
const minesEncrypt = require("../model/mine_encrypt")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';

function getResult(hash) {
  const allNums = [
    7, 2, 19, 25, 1, 13, 5, 24, 14, 6, 15, 9, 22, 16, 3, 17, 18, 20, 8, 21, 4,
    12, 10, 23, 11,
  ];
  let seed = hash;
  let finalNums = createNums(allNums, seed);
  seed = crypto.createHash("SHA256").update(seed).digest("hex");
  finalNums = createNums(finalNums, seed);
  return finalNums.map((m) => m.num.num);
}

function createNums(allNums, hash) {
  let nums = [];
  let h = crypto.createHash("SHA256").update(hash).digest("hex");
  allNums.forEach((c) => {
    nums.push({ num: c, hash: h });
    h = h.substring(1) + h.charAt(0);
  });
  nums.sort(function (o1, o2) {
    if (o1.hash < o2.hash) {
      return -1;
    } else if (o1.hash === o2.hash) {
      return 0;
    } else {
      return 1;
    }
  });
  return nums;
}


function main (serverSeed, clientSeed, nonce) {
  let resultArr = [clientSeed, nonce];
  let hmacSha256Result = crypto.createHmac("sha256", serverSeed).update(resultArr.join(":")).digest("hex")
  let resultList = getResult(hmacSha256Result);
  return (resultList);
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
  
  
  const handleMinesBet = (async(req,res)=>{
      const {user_id} = req.id
      let {sent_data} = req.body

      console.log(sent_data)
  
    //   const GetEncryptedSeeds = (async(user_id)=>{
    //     const CraeatBetGame = (async(data)=>{
    //       let bet = {
    //         user_id: data.user_id,
    //         username: data.username,
    //         profile_img: data.user_img,
    //         bet_amount: data.bet_amount,
    //         token: data.bet_token_name,
    //         token_img:data.bet_token_img,
    //         bet_id: Math.floor(Math.random()*10000000)+ 72000000,
    //         game_nonce: nonce,
    //         cashout: parseFloat(data.io.point),
    //         profit: data.payoutIO,
    //         client_seed: data.io.client_seed,
    //         server_seed: data.io.server_seed,
    //         time: data.time,
    //         hidden_from_public: data.hidden,
    //         payout: data.payout,
    //         has_won : data.has_won,
    //         chance: data.chance
    //       }
    //       let wallet = {
    //           coin_name: data.bet_token_name,
    //           coin_image:  data.bet_token_img,
    //           balance:  parseFloat(data.current_amount).toFixed(4),
    //       }
    //          let previusGame = await DiceGame.find({user_id})
    //          let result = await DiceGame.create(bet)
    //           res.status(200).json({history:[...previusGame, result], wallet,point: parseFloat(data.io.point)})
    //       })
  
    //       let hidden;
    //       let response =  await DiceEncription.find({user_id})
    //       let server = response[response.length - 1].server_seed
    //       let client = response[response.length - 1].client_seed
    //       let hash = response[response.length - 1].hash_seed
  
    //       if(sent_data.bet_token_name !== "WGF"){
    //         handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
    //       }
  
    //       const randomResult = generateRandomNumber(server, client, hash);
    //         if(parseFloat(sent_data.chance) > parseFloat(randomResult.point)){
    //           try {
    //             let sjbhsj = await Wallet.find({user_id})
    //             if(sjbhsj[0].hidden_from_public){
    //                 hidden = true
    //               }else{
    //                 hidden = false
    //             }
    //               let previous_bal = parseFloat(sjbhsj[0].balance)
    //               let wining_amount = parseFloat(sent_data.wining_amount)
    //               let current_amount = (previous_bal + wining_amount).toFixed(4)
    //             // updateUserWallet({current_amount, ...sent_data, user_id})
    //             CraeatBetGame({...sent_data, user_id, payoutIO:wining_amount,hidden,  has_won : true, io: randomResult, current_amount})
    //           } catch (err) {
    //             res.status(501).json({ message: err.message });
    //           }
    //         }else{
    //         try {
    //           let response =  await Wallet.find({user_id})
    //             if(response[0].hidden_from_public){
    //               hidden = true
    //             }else{
    //               hidden = false
    //             }
    //           let previous_bal = parseFloat(response[0].balance)
    //           let bet_amount = parseFloat(sent_data.bet_amount)
    //           let current_amount = (previous_bal - bet_amount).toFixed(4)
    //           CraeatBetGame({...sent_data, user_id,payoutIO:0,hidden, has_won : false, io: randomResult, current_amount})
    //         //   updateUserWallet({current_amount, ...sent_data, user_id})
    //         } catch (err) {
    //           res.status(501).json({ message: err.message });
    //         }
    //       }
    //   })
    
    // if(sent_data.bet_amount < 0.2){
    //   res.status(501).json({ error:  "Minimum Bet amount for classic Dice is 0.20"});
    // } 
    // else if (sent_data.bet_amount > 5000){
    //   res.status(501).json({ error:  "Minimum Bet amount for classic Dice is 5000"});
    // } else{
    //   GetEncryptedSeeds(user_id)
    // }
  })
  

const handleInitialze = (async(req, res)=>{
  try{
    const { user_id } = req.id
    const { data } = req.body
    let seed = data.server_seed
    let hash = data.server_seed
    let client = data.client_seed
    let nonce = data.nonce
   let jjsk =  main(seed, client, nonce);
    // res.status(200).json(mines)
  }
  catch(error){
    console.log(error)
  }
})

const handleMinesEncryption = (async(req, res)=>{
  try{
    const { user_id } = req.id
  let kjsljjj =   await minesEncrypt.find({user_id})
    res.status(200).json(kjsljjj)
  }
    catch(err){
      res.status(400).status({error: err})
    }
})

// ============================== Initialize dice game ===============================
const InitializeMinesGame = (async(user_id)=>{

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
        nonce :0,
        server_seed: handleHashGeneration().serverSeed,
        hash_seed: handleHashGeneration().hash,
        client_seed:handleHashGeneration().clientSeed,
        is_open:false,
        updated_at: currentTime
    }
      await minesEncrypt.create(data)
  })
  module.exports = { handleMinesBet ,InitializeMinesGame, handleInitialze, handleMinesEncryption }
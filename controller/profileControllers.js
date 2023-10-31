const Profile = require("../model/Profile")
const { handleProfileTransactions } = require("../profile_mangement/index")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const PPFWallet = require("../model/PPF-wallet")
const Wallet = require("../model/wallet")
const CrashGame = require("../model/crashgame")
const DiceGame = require("../model/dice_game")

const createProfile = (async(email,username, invited_code, user_id )=>{
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function generateString(length) {
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  let datas = {
    born: "-",
    firstname: '-',
    lastname: '-',
    user_id: user_id,
    email : email,  
    hide_profile: false,
    hidden_from_public: false,
    refuse_friends_request: false,
    refuse_tips: false, 
    username : username ? username : generateString(9).toString(),  
    profile_image: "https://img2.nanogames.io/avatar/head1.png",
    vip_level: 0,
    kyc_is_activated: false,
    phone: "-",
    next_level_point:1,
    total_wagered: 0,
    invited_code: invited_code ? invited_code : "-",
    google_auth_is_activated : false,
    is_suspend: false,
    vip_progress: 0,
    fa_is_activated: false,   
    earn_me: 0,
    commission_reward: 0,
    usd_reward : 0, 
    joined_at: currentTime,
    account_type: "normal",
    total_chat_messages:0,
    weekly_wagered: 0,
    monthly_wagered: 0
}

  try{
    const profile = await Profile.create(datas)
    return profile
  }
  catch(err){
    console.log(err)
  }
})

const UpdateProfile = (async(req, res)=>{
  const {user_id} = req.id;
  const {data} = req.body
  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  } else{
    try{
     await Profile.updateOne({ user_id }, {
      born: data.born,
       firstname: data.firstname,
        lastname:data.lastname
     });
     res.status(200).json({message: "Updated succesfully"})
    }
    catch(error){
      res.status(501).json({ message: error });
    }
  }
})

const UpdateUser = (async(req, res)=>{
    const {user_id} = req.id;
    const {data} = req.body
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } 
    else{
      try{
       await Profile.updateOne({ user_id }, {
        username: data.username,
        profile_image: data.profile_image,
       });
       res.status(200).json({message: "Updated succesfully"})
      }
      catch(error){        
        res.status(404).json({ message: error });
      }
    }
})


const SingleUser = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users =   await Profile.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})


const handleHiddenProfile = (async(req, res)=>{
  const {user_id} = req.id
  const { profile_state } = req.body
  try{
   let response = await Profile.updateOne({user_id},{
      hide_profile: profile_state
    })
      res.status(200).json(response)
  }
  catch(error){
    console.log(error)
  }
})


const handleRefusefriendRequest = (async(req, res)=>{
  const {user_id} = req.id
  const { profile_state } = req.body
  try{
    let response = await Profile.updateOne({user_id},{
      refuse_friends_request: profile_state
    })
      res.status(200).json(response)
  }
  catch(error){
    console.log(error)
  }
})

const handleRefuseTip = (async(req, res)=>{
  const {user_id} = req.id
  const { profile_state } = req.body
  try{
    let response = await Profile.updateOne({user_id},{
      refuse_tips: profile_state
    })
      res.status(200).json(response)
  }
  catch(error){
    console.log(error)
  }
})

const handlePublicUsername = (async(req, res)=>{
  const {user_id} = req.id
  const { profile_state } = req.body
  try{
    await Profile.updateOne({user_id},{
      hidden_from_public: profile_state
    })

    await Wallet.updateOne({user_id},{
      hidden_from_public: profile_state
    })

    await CrashGame.updateOne({user_id},{
      hidden_from_public: profile_state
    })

    let result = await DiceGame.updateOne({user_id},{
      hidden_from_public: profile_state
    })
      res.status(200).json(result)
  }
  catch(error){
    console.log(error)
  }
})

const handleDailyPPFbonus =  (async(req, res)=>{
  const {user_id} = req.id
  try{
    let result = await PPFWallet.find({user_id})
    let prev_bal = result[0].balance
    let pre_date = result[0].date
    let now = new Date()
    let yesterdy = new Date(pre_date)
  
    if(yesterdy.getDate() !== now.getDate()){
      await PPFWallet.updateOne({ user_id }, {
        balance: prev_bal + 20000,
        date:now
       });
    }
  
    // let trx_rec = {
    //   user_id,
    //   transaction_type: "PPF daily bonus", 
    //   sender_img: "---", 
    //   sender_name: "DPP_wallet", 
    //   sender_balance: 0,
    //   trx_amount: 20000,
    //   receiver_balance: prev_bal + 20000,
    //   datetime: currentTime, 
    //   receiver_name: "PPF",
    //   receiver_img: "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828376/ppf_logo_ntrqwg.png",
    //   status: 'successful',
    //   transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
    //   is_sending: 0
    // }
    // handleProfileTransactions(trx_rec)
    res.status(200).json({message: "daily ppf added successfully"})
  }
  catch(err){
    res.status(500).json({error: err})
  }

})

module.exports = { SingleUser, UpdateUser, UpdateProfile,handleHiddenProfile , handlePublicUsername, handleRefusefriendRequest, handleRefuseTip, handleDailyPPFbonus, createProfile }
const { connection } = require("../database/index")
const Profile = require("../model/Profile")
const { handleProfileTransactions } = require("../profile_mangement/index")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

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
        profile_image: data.profile_img,
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
  const user_id = req.id
  const { profile_state } = req.body
  try{
    let sql = `UPDATE profiles SET hide_profile="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json(result)
    });
  }
  catch(error){
    console.log(error)
  }
})


const handleRefusefriendRequest = (async(req, res)=>{
  const user_id = req.id
  const { profile_state } = req.body
  try{
    let sql = `UPDATE profiles SET refuse_friends_request="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json(result)
    });
  }
  catch(error){
    console.log(error)
  }
})

const handleRefuseTip = (async(req, res)=>{
  const user_id = req.id
  const { profile_state } = req.body
  try{
    let sql = `UPDATE profiles SET refuse_tips="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json(result)
    });
  }
  catch(error){
    console.log(error)
  }
})

const handlePublicUsername = (async(req, res)=>{
  const user_id = req.id
  const { profile_state } = req.body
  try{
    let sql = `UPDATE profiles SET hidden_from_public="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
    (result)
    });

    let sql2 = `UPDATE wallet SET hidden_from_public="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
    (result)
    });

    let sql22= `UPDATE crash_game SET hidden_from_public="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql22, function (err, result) {
      if (err) throw err;
    (result)
    });

    let sql23= `UPDATE dice_game SET hidden_from_public="${profile_state}" WHERE user_id="${user_id}"`;
    connection.query(sql23, function (err, result) {
      if (err) throw err;
      res.status(200).json(result)
    });
  }
  catch(error){
    console.log(error)
  }
})

const handleDailyPPFbonus =  (async(req, res)=>{
    const user_id = req.id
    let query = `SELECT * FROM ppf_wallet WHERE user_id="${user_id}"`;
    connection.query(query, async function(error, data){
      let prev_bal = parseFloat(data[0].balance)
      let pre_date = parseInt(data[0].date)
      const now = new Date()
      if(pre_date === now.getDate()){
        return "don't add anything"
      }else{
        let trx_rec = {
          user_id,
          transaction_type: "PPF daily bonus", 
          sender_img: "---", 
          sender_name: "DPP_wallet", 
          sender_balance: 0,
          trx_amount: 20000,
          receiver_balance: prev_bal + 20000,
          datetime: currentTime, 
          receiver_name: "PPF",
          receiver_img: "https://www.linkpicture.com/q/ppf_logo.png",
          status: 'successful',
          transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
          is_sending: 0
        }
        handleProfileTransactions(trx_rec)
        let sql22= `UPDATE ppf_wallet SET balance="${prev_bal + 20000}", date="${now.getDate()}" WHERE user_id="${user_id}"`;
        connection.query(sql22, function (err, result) {
          if (err) throw err;
        (result)
        });
      }
    })  
})

module.exports = { SingleUser, UpdateUser, UpdateProfile,handleHiddenProfile , handlePublicUsername, handleRefusefriendRequest, handleRefuseTip, handleDailyPPFbonus, createProfile }
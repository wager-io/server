const { connection } = require("../database/index")
var admin = require("firebase-admin");
const db = admin.firestore()
const { handleProfileTransactions } = require("../profile_mangement/index")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');


const UpdateProfile = (async(req, res)=>{
  const user_id = req.id;
  const {data} = req.body

  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  } else{
    db.collection("profile").doc(data.email).update({
      firstname: data.firstname, lastname: data.lastname, born: data.born
    }).then(function() {
      ("user is updated");
    });
    try{
      let sql = `UPDATE profiles SET born="${data.born}", firstname="${data.firstname}", lastname="${data.lastname}"  WHERE user_id="${user_id}"`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).json(result)
      });
    }
    catch(error){
      res.status(501).json({ message: error });
    }
  }
})



const UpdateUser = (async(req, res)=>{
    const user_id = req.id;
    const {data} = req.body

    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } 
    else{
      try{
        db.collection("profile").doc(data.email).update({
          username: data.username, 
          profile_image: data.profile_image
        }).then(function() {
          ("user is updated");
        });
        let sql = `UPDATE profiles SET username="${data.username}", profile_image="${data.profile_image}"  WHERE user_id = "${user_id}"`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
         res.status(200).json(result)
        });
      }
      catch(error){        
        res.status(404).json({ message: error });
      }
    }
})

const SingleUser = (async(req, res)=>{
    const user_id = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        let query = `SELECT * FROM  profiles  WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data)
        })
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

module.exports = { SingleUser, UpdateUser, UpdateProfile,handleHiddenProfile , handlePublicUsername, handleRefusefriendRequest, handleRefuseTip, handleDailyPPFbonus }
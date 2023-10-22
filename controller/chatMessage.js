const { connection } = require("../database/index")

const str = 'abcde @';

// ✅ Get the last character of a string using charAt()
const last = str.charAt(str.length - 1);
console.log(last); // 👉️ e

const ChatMessages = (async (req, res)=>{ 
    const {data} = req.body
    const user_id = req.id;
    let fdata = {
      user_id,
      type: data.type,
      text: data.text,
      sent_at: data.sent_at,
      profle_img: data.profle_img,
      username: data.sender_username,
      gif: data.gif,
      tipped_user: data.tipped_user,
      tipped_amount: data.tipped_amount,
      tipped_comment: data.tipped_comment,
      tipped_coin_image: data.tipped_coin_image,
      tip_Token: data.tip_Token,
      hide_profile:0,
      coin_rain_amount: data.coin_rain_amount ,
      coin_rain_comment: data.coin_rain_comment,
      coin_rain_num: data.coin_rain_num,
      coin_rain_token:  data.coin_rain_token,
      coin_drop_amount: data.coin_drop_amount,
      coin_drop_comment: data.coin_drop_comment,
      coin_drop_num: data.coin_drop_num,
      coin_drop_token: data.coin_drop_token,    
      vip_level: data.vip_level,
      time: new Date()
  }

  let sql = `INSERT INTO public_chat SET ?`;
  connection.query(sql, fdata, (err, data)=>{
        if(err){
            console.log(err)
        }else{
          res.status(200).json(data)
        }
  })

  let query3 = `SELECT * FROM profiles WHERE user_id="${user_id}"`;
  connection.query(query3, async function(error, result){
      let count = parseInt(result[0].total_chat_messages)
      let sql2 = `UPDATE profiles SET total_chat_messages="${count + 1}" WHERE user_id="${user_id}"`;
      connection.query(sql2, function (err, result) {
        if (err) throw err;
      (result)
      });
})


  // if(data.type === "coin_drop"){
  //   for(let i = 0; i <= data.coin_drop_num; i++){
  //     pusher.trigger("chat-room", "public-messages", data);
  //   }
  // }

})






module.exports = { ChatMessages }

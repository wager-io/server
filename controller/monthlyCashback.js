const { connection } = require("../database/index")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const crypto = require("crypto")
const {Helper} = require("../utils/helperFunction");
const { handleProfileTransactions } = require("../profile_mangement");
const helper = new Helper()

const monthlyCashback = (async (req, res)=>{
 let user_id = req.id

 // console.log(user_id)

 try {
  const query = `SELECT * FROM profiles WHERE vip_level > 20 AND monthly_wagered >= 10000 AND user_id = "${user_id}"`;
      connection.query(query, async function (error, response) {
       if(response && (response.length !== 0)){
        // console.log(response[0])

        let percentage = 0;
        if(response[0].vip_level >= 21 && response[0].vip_level <= 36){
          percentage = 0.03
        }else if(response[0].vip_level >= 37 && response[0].vip_level <= 54){
          percentage = 0.035
        }else if(response[0].vip_level >= 55 && response[0].vip_level <= 68){
          percentage = 0.04
        }else if(response[0].vip_level >= 69 && response[0].vip_level <= 83){
          percentage = 0.045
        }else if(response[0].vip_level >= 84 && response[0].vip_level <= 101){
          percentage = 0.05
        }else{
          percentage = 0
        }
         const amountToReceive = +response[0].monthly_wagered * 0.01 * percentage;

         let new_bal
         let query5 = `SELECT * FROM  ppd_wallet  WHERE user_id="${response[0].user_id}"`;
         connection.query(query5, async function(error, res){  
             let prev_bal = parseFloat(res[0].balance)
             new_bal = prev_bal + amountToReceive
         })

         setTimeout(()=>{
          let trx_rec = {
            user_id: response[0].user_id,
            type_of_transation: "monthly_cashback",
            sender_img: "---", 
            sender_name: "DPP_wallet", 
            sender_balance: 0,
            trx_amount: amountToReceive,
            receiver_balance: new_bal,
            datetime: currentTime, 
             receiver_name: "PPD",
            receiver_img: "https://www.linkpicture.com/q/dpp_logo.png",
            status: 'successful',
            transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
            is_sending: 0
          }
        
         // save the transaction in the database
         handleProfileTransactions(trx_rec)
         }, 500)
         await helper.incPPDWallet(amountToReceive, response[0].user_id)
         await helper.clearMonthlyWagered(response[0].user_id)
         
         return res.status(200).json({
          status:true,
          message:"Cashback dropped into your ppd successfully"
         })
       }else{
        return res.status(500).json({
         status:false,
         message:"Your are not eligible for this cashback"
        })
       }
      })

 } catch (error) {
  console.log(error)
  return res.status(500).json({
   status:false,
   message:"Something completely went wrong"
  })
 }


})

module.exports ={
  monthlyCashback
}
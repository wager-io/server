const {connection} = require("../database/index");
const { Helper } = require("../utils/helperFunction");
const crypto = require('crypto');
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const helper = new Helper()
const { handleProfileTransactions } = require("../profile_mangement/index")
// ============== weekly cashback ==========
const weeklyCashback = async () => {
 const checkTime = () => {
  const now = new Date();
  if (now.getDay() === 1 && now.getHours() === 18 && now.getMinutes() === 0 && now.getSeconds() === 0) {
 try {
  const query = `SELECT * FROM profiles WHERE vip_level > 20 AND weekly_wagered >= 1000`;
      connection.query(query, async function (error, response) {
       if(response && (response.length !== 0)){
        for(const receiver of response){

          let percentage = 0;
          if(receiver.vip_level >= 21 && receiver.vip_level <= 36){
            percentage = 0.05
          }else if(receiver.vip_level >= 37 && receiver.vip_level <= 54){
            percentage = 0.06
          }else if(receiver.vip_level >= 55 && receiver.vip_level <= 68){
            percentage = 0.07
          }else if(receiver.vip_level >= 69 && receiver.vip_level <= 83){
            percentage = 0.075
          }else if(receiver.vip_level >= 84 && receiver.vip_level <= 101){
            percentage = 0.08
          }else{
            percentage = 0
          }

         const amountToReceive = +receiver.weekly_wagered * 0.01 * percentage;

         let new_bal
         let query5 = `SELECT * FROM  ppd_wallet  WHERE user_id="${receiver.user_id}"`;
         connection.query(query5, async function(error, res){
             let prev_bal = parseFloat(res[0].balance)
             new_bal = prev_bal + data
         })

         setTimeout(()=>{
          let trx_rec = {
            user_id: receiver.user_id,
            type_of_transation: "Weekly_cashback",
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
         await helper.clearWeeklyWagered(receiver.user_id)
         await helper.incPPDWallet(amountToReceive, receiver.user_id)
        }
       }
      })
 } catch (error) {
  console.log(error)
 }
  }
};
setInterval(checkTime, 1000);

}





//=============== monthly cashback ========
const monthlyCashback = async () => {

 const checkTime = () => {
  const now = new Date();
    const dayOfMonth = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    if (dayOfMonth === 15 && hours === 18 && minutes === 0 && seconds === 0) {
 try {
  const query = `SELECT * FROM profiles WHERE vip_level > 20 AND monthly_wagered >= 10000`;
      connection.query(query, async function (error, response) {
       if(response && (response.length !== 0)){
        for(const receiver of response){

          let percentage = 0;
          if(receiver.vip_level >= 21 && receiver.vip_level <= 36){
            percentage = 0.03
          }else if(receiver.vip_level >= 37 && receiver.vip_level <= 54){
            percentage = 0.035
          }else if(receiver.vip_level >= 55 && receiver.vip_level <= 68){
            percentage = 0.04
          }else if(receiver.vip_level >= 69 && receiver.vip_level <= 83){
            percentage = 0.045
          }else if(receiver.vip_level >= 84 && receiver.vip_level <= 101){
            percentage = 0.05
          }else{
            percentage = 0
          }

         const amountToReceive = +receiver.monthly_wagered * 0.01 * percentage;


         // save the transaction in the database
         await helper.save_transaction({
          user_id: receiver.user_id,
          type_of_transation: "monthly_cashback",
          trx_from:receiver.user_id,
          trx_sent_amount:amountToReceive,
          trx_received_amount: amountToReceive,
          trx_to: receiver.user_id,
          datetime:currentTime,
          status: "completed",
          transaction_id:crypto.randomUUID()
         })

         await helper.clearMonthlyWagered(receiver.user_id)
        await helper.incPPDWallet(amountToReceive, receiver.user_id)

        }
       }
      })



 } catch (error) {
  console.log(error)
 }
  }
};

setInterval(checkTime, 1000);

}


module.exports = {
 weeklyCashback,monthlyCashback
}
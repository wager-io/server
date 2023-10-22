const {connection} = require("../database/index");
const { Helper } = require("../utils/helperFunction");
const crypto = require('crypto');
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const helper = new Helper()

// ============== weekly cashback ==========
const rakebacks = async () => {

 const checkTime = () => {
  const now = new Date();
  const gamesTable = ["crash_game"]

  if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
   for(const game of gamesTable){
    try {
     const query = `SELECT * FROM ${game} `;
         connection.query(query, async function (error, response) {
          if(response && (response.length !== 0)){
           let allEligibles = [];
           for(receiver of response){
            const currentDate = new Date();
            const yesterday = new Date(currentDate);
            yesterday.setDate(currentDate.getDate() - 1);

            try {

            if(
             receiver.time.getDate() === yesterday.getDate() &&
             receiver.time.getMonth() === yesterday.getMonth() &&
             receiver.time.getFullYear() === yesterday.getFullYear()
             ){
              // multiply the risk of each users accordingly and send to their commission_reward for the day
              const {user_id, bet_amount} = receiver;
              const commission = +bet_amount * 0.01 * 0.15;
              
              let query = `SELECT * FROM affiliate_code WHERE user_id = ?`;
              connection.query(query, user_id, async function(error, response){
          
              if(response && response.length > 0){
              
               const query = `UPDATE affiliate_code SET commission_reward = ${Number( response[0].commission_reward) + commission}  WHERE created_at = ? AND user_id = ?`;
               connection.query(query, [response[0].created_at, response[0].user_id], async function (error, response) {
                if (error) {
                  console.error(error.message);
                }else{
                 
                 await helper.save_transaction({                  
                  user_id:user_id,
                  transaction_type:"daily-rakeback-bonus", 
                  sender_img:"---",
                  sender_name:"DPP_wallet",
                  sender_balance:0,
                  trx_amount:commission,
                  receiver_balance:0,
                  receiver_img:"https://www.linkpicture.com/q/ppf_logo.png",
                  receiver_name:"PPF",
                  datetime:currentTime,
                  status:"successful",
                  transaction_id:crypto.randomUUID(),
                  is_sending:0,
                 })
                }
              });
              }})
             }
             } catch (error) {
                 console.error(error.message);
             }
           }
          }
         })
    } catch (error) {
     console.log(error)
    }
   }

  }
};
setInterval(checkTime, 1000);

}


module.exports = {
 rakebacks,
}
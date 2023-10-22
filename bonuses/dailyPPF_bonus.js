// const {connection} = require("../database/index");
// const { Helper } = require("../utils/helperFunction");
// const crypto = require('crypto');
// const { handleProfileTransactions } = require("../profile_mangement/index")
// const { format } = require('date-fns');
// const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
// const helper = new Helper()

// // ============== weekly cashback ==========
// const dailyPPFBONUS = async () => {

//  const checkTime = () => {
//   const now = new Date();
//   const bonus_amount = 20000;
//   if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
//  try {
//   const query = `SELECT * FROM ppf_wallet `;
//       connection.query(query, async function (error, response) {
//         let prev_bal = parseFloat(response[0].balance)
//         let new_bal = prev_bal + bonus_amount
//        if(response && (response.length !== 0)){
//         for(receiver of response){
//          try {
//           const query = `UPDATE ppf_wallet SET balance = ${Number(receiver.balance) + bonus_amount}  WHERE user_id = ?`;
//            connection.query(query, [receiver.user_id], async function (error, response) {
//             if (error) {
//               console.error(error.message);
//             }else{
//               let trx_rec = {
//                 user_id: receiver.user_id,
//                 transaction_type: "Daily Bonus", 
//                 sender_img: "---", 
//                 sender_name: "DPP_wallet", 
//                 sender_balance: 0,
//                 trx_amount: bonus_amount,
//                 receiver_balance: new_bal,
//                 datetime: currentTime, 
//                 receiver_name: "PPF",
//                 receiver_img: "https://www.linkpicture.com/q/ppf_logo.png",
//                 status: 'successful',
//                 transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
//                 is_sending: 0
//               }
//               handleProfileTransactions(trx_rec)
//             }
//           });
//           } catch (error) {
//               console.error(error.message);
//           }
//         }
//        }
//       })
//  } catch (error) {
//   console.log(error)
//  }
//   }
// };
// setInterval(checkTime, 1000);

// }


// module.exports = {
//  dailyPPFBONUS,
// }
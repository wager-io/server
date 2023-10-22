const { default: axios } = require("axios");
const crypto = require("crypto");
const { connection } = require("../database");
const CCPAYMENT_API_ID = "202310051818371709996528511463424";
const CC_APP_SECRET = "206aed2f03af1b70305fb11319f2f57b";
const CCPAYMENT_API_URL = "https://admin.ccpayment.com";
const { handleProfileTransactions } = require("../profile_mangement/index")
const { handlePPDunLockUpdate } = require("../profile_mangement/ppd_unlock")
const { handleTotalNewDepsitCount } = require("../profile_mangement/cashbacks")

const RequestTransaction = ((event)=>{
  let data = {
    user_id: event.user_id,
    order_id: event.data.order_id,
    amount: event.data.amount,
    crypto: event.data.crypto,
    network: event.data.network,
    pay_address: event.data.pay_address,
    token_id: event.data.token_id,
    order_valid_period: event.data.order_valid_period,
    time: new Date(),
    merchant_order_id: event.merchant_order_id,
    contract: "",
    status: "pending"
  }
  if(event.msg === "success"){
    let sql = `INSERT INTO deposit_request SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            (err)
        }else{
          (result)
        }
    })
  }
})

const handleFirstDeposit = ((user_id, amount, num)=>{
    let data = {
      user_id,
      amount,
      date: new Date()
    }
    let bonus
    if(num < 1){
     bonus = amount * (180 / 100)
    }
    else if(num === 1){
      bonus = amount * (240 / 100)
    }
    else if(num === 2){
      bonus = amount * (300 / 100)
    }
    else if(num === 3){
      bonus = amount * (360 / 100)
    }
    handlePPDunLockUpdate(user_id, bonus)
    let sql = `INSERT INTO first_deposit SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            (err)
        }else{
          (result)
        }
    })
})

const handleSuccessfulDeposit = ((event)=>{
  let query1 = `SELECT * FROM deposit_request WHERE merchant_order_id="${event.merchant_order_id}"`;
  connection.query(query1, async function(error, data){
    let user_id = data[0].user_id
    let order_amount = parseFloat(data[0].amount)
      handleFirstDeposit(user_id, order_amount, data.length)
      handleTotalNewDepsitCount(order_amount)
    let sql22= `UPDATE deposit_request SET status="${event.status}", contract="${event.contract}" WHERE user_id="${user_id}" AND merchant_order_id="${event.merchant_order_id}"`;
    connection.query(sql22, function (err, result) {
      if (err) throw err;
    (result)
    });
    let query1 = `SELECT * FROM usdt_wallet WHERE user_id="${user_id}"`;
    connection.query(query1, async function(error, data){
      let prev_bal = parseFloat(data[0].balance)
      let sql22= `UPDATE usdt_wallet SET balance="${prev_bal + order_amount}"  WHERE user_id="${user_id}"`;
      connection.query(sql22, function (err, result) {
        if (err) throw err;
      (result)
      });
    })
  })
})

const handleFailedTransaction = ((event)=>{
  let query1 = `SELECT * FROM deposit_request WHERE merchant_order_id="${event.merchant_order_id}"`;
  connection.query(query1, async function(error, data){
    let user_id = data[0].user_id
  let sql22= `UPDATE deposit_request SET status="${event.status}", contract="${event.contract}" WHERE user_id="${user_id}" AND merchant_order_id="${event.merchant_order_id}"`;
  connection.query(sql22, function (err, result) {
    if (err) throw err;
  (result)
  });
})
})


const initiateDeposit = async (req, res) => {
  try {
    const user_id = req.id
    const { data } = req.body;
    const transaction_type = "Wallet Fund";
    const timestamp = Math.floor(Date.now() / 1000);
    let tokenid;

    if(data.network === "erc"){
      tokenid = "264f4725-3cfd-4ff6-bc80-ff9d799d5fb2"
    }
    else if(data.network === "trc"){
      tokenid = "0912e09a-d8e2-41d7-a0bc-a25530892988"
    }
    else if(data.network === "bep"){
      tokenid = "92b15088-7973-4813-b0f3-1895588a5df7"
    }
    const merchant_order_id = Math.floor(Math.random()*100000) + 1000000;
    const currency = "USD";
    const paymentData = {
      remark: transaction_type,
      token_id : tokenid,
      product_price: data.amount.toString(),
      merchant_order_id:merchant_order_id.toString(),
      denominated_currency: currency,
      order_valid_period: 43200,
    };

    let str = CCPAYMENT_API_ID + CC_APP_SECRET +  timestamp + JSON.stringify(paymentData);
    let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
    const headers = {
      Appid: CCPAYMENT_API_ID,
      "Content-Type": "application/json; charset=utf-8",
      Timestamp: timestamp,
      Sign: sign,
    };
  await axios.post(`${CCPAYMENT_API_URL}/ccpayment/v1/bill/create`, paymentData,
      {  headers: headers } 
    ).then((response)=>{
      RequestTransaction({...response.data, user_id, merchant_order_id:merchant_order_id.toString()})
      res.status(200).json({status: true,message: response.data.msg, ...response.data, status: "pending"});
    })
    .catch((error)=>{
      console.error("Error processing deposit:", error);
      res.status(404).json({ status: false, message: "Internal server error" });
    })
  }
   catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const confirmDeposit = async () => {
  try {
    let usersID = []
    let query1 = `SELECT * FROM  deposit_request`;
    connection.query(query1, async function(error, data){
      for(let i = 0; i < data.length; i++){
        if(data[i].status === "pending"){
            usersID.push(data[i].merchant_order_id)
        }
      }
    })
    setTimeout(async()=>{
      const timestamp = Math.floor(Date.now() / 1000);
      let str =  CCPAYMENT_API_ID + CC_APP_SECRET + timestamp +  JSON.stringify({"merchant_order_ids": usersID});
      let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
      const headers = {
        Appid: CCPAYMENT_API_ID,
        "Content-Type": "application/json; charset=utf-8",
        Timestamp: timestamp,
        Sign: sign,
      };
    
      const response = await axios.post(
      `${CCPAYMENT_API_URL}/ccpayment/v1/bill/info`,{
        merchant_order_ids: usersID
      },
        {
          headers: headers,
        }
      );
      let result = response.data.data
      if(usersID.length !== 0){
        for(let e = 0; e < result.length; e++){
          if(result[0].order_detail.status === "Successful"){
              handleSuccessfulDeposit(result[0].order_detail)
          }
          else if(result[0].order_detail.status !== "Pending"){
            handleFailedTransaction(result[0].order_detail)
          }
      }
      }
    },2000)
  } catch (error) {
    console.error("Error confirming deposit:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}
// setInterval(() => {
//   confirmDeposit()
// }, 6000);


const fetchPendingOrder = ((req, res)=>{
    const user_id = req.id
    try{
    let query1 = `SELECT * FROM  deposit_request WHERE user_id="${user_id}" AND status="${"pending"}"`;
      connection.query(query1, async function(error, data){
        res.status(200).json(data)
      })
    }
    catch(error){
      res.status(500).json(error)
    }
})

module.exports = { initiateDeposit, fetchPendingOrder }
const axios = require("axios");
const crypto = require('crypto');
let app_id = "202310051818371709996528511463424"
let app_secret = "206aed2f03af1b70305fb11319f2f57b"
let merchant_order_id = "CP13651"

const handleDeposit = (async(req, res)=>{

let url = "https://admin.ccpayment.com/ccpayment/v1/concise/url/get"

let body =  {
    "remark": "okwyed",
    "token_id": "8e5741cf-6e51-4892-9d04-3d40e1dd0128",
    "product_price": 0.6,
    "merchant_order_id": merchant_order_id,
    "denominated_currency": "USD",
    "order_valid_period":8234563458
  };

try{
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    // let hash = app_id + app_secret + str(timestamp) + body

    let str = app_id + app_secret + (Math.floor(Date.now() / 1000)) + JSON.stringify(body);
    let sign = crypto.createHash('sha256').update(str, 'utf8').digest('hex');

     await axios.post(url, {
        body
     }, {
        headers:{
            "Content-Type": "application/json;charset=uf8",
            "Appid": app_id,
            "Sign": sign,
            "Timestamp": timestamp
        }
     })
     .then((res)=>{
        res.status(200).json(res.data)
     })
    .catch((error)=>{
        res.status(501).json({error})
    })
}
catch(err){
   console.log(err)
}


})


const handleTokenIDInterface = (async(req, res)=>{

    let body =  {
        "remark": "",
        "token_id": "0912e09a-d8e2-41d7-a0bc-a25530892988",
        "product_price": "0.5",
        "merchant_order_id": merchant_order_id,
        "denominated_currency": "USD",
        "order_valid_period":823456
      }
    
    

    await axios.post(url, {
        data: body
     }, {
        headers:{
            "Content-Type": "application/json;charset=uf8",
            "Appid": app_id,
            "Sign": sign,
            "Timestamp": timestamp
        }
     })
     .then((res)=>{
        res.status(200).json(res.data)
     })
    .catch((error)=>{
        res.status(501).json({error})
    })
})


module.exports = { handleDeposit }
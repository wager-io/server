const Wallet = require("../model/wallet")
const BTCWallet = require("../model/btc-wallet")
const EThHWallet = require("../model/eth-wallet")
const WGFWallet = require("../model/wgf-wallet")
const WGDWallet = require("../model/wgd-wallet")

// ============= get wallet  ====================
const GetPPDWallet = ((req, res)=>{
    const user_id = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        let query = `SELECT * FROM  ppd_wallet  WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data)
        })
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetPPFWallet = ((req, res)=>{
    const user_id = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        let query = `SELECT * FROM  ppf_wallet  WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data)
        })
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})


const GetPPEWallet = ((req, res)=>{
    const user_id = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        let query = `SELECT * FROM  ppe_wallet  WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data)
        })
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetPPLWallet = ((req, res)=>{
    const user_id = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        let query = `SELECT * FROM  ppl_wallet  WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data)
        })
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetUSDTWallet = ((req, res)=>{
    const user_id = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        let query = `SELECT * FROM  usdt_wallet  WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data)
        })
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetDefaultWallet = (async(req, res)=>{
  const {user_id} = req.id;
  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  } else {
    try {
      const users =   await Wallet.find({user_id})
      res.status(200).json(users)
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
  }
})

const UpdatedefaultWallet = (async(req, res)=>{
  const user_id = req.id;
  const data = req.body

  try {
    let sql = `UPDATE wallet SET  balance="${data.balance}", coin_name="${data.coin_name}", 
    coin_image="${data.coin_image}"  WHERE user_id = "${user_id}"`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json(result)
    });
  } catch (err) {
    res.status(501).json({ message: err.message });
  }

})



module.exports = {  GetPPDWallet, GetPPFWallet, GetPPEWallet, GetPPLWallet, GetUSDTWallet, UpdatedefaultWallet, GetDefaultWallet, UpdatedefaultWallet}
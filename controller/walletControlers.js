const Wallet = require("../model/wallet")
const BTCWallet = require("../model/btc-wallet")
const EThHWallet = require("../model/eth-wallet")
const WGFWallet = require("../model/wgf-wallet")
const WGDWallet = require("../model/wgd-wallet")

// ============= get wallet  ====================
const GetPPDWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    }
    else {
      try {
        const users = await BTCWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetPPFWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await WGFWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})


const GetPPEWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await EThHWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetPPLWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await WGDWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetUSDTWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await EThHWallet.find({user_id})
        res.status(200).json(users)
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
      const users = await Wallet.find({user_id})
      res.status(200).json(users)
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
  }
})

const UpdatedefaultWallet = (async(req, res)=>{
  const {user_id} = req.id;
  const data = req.body
  try {

 await Wallet.updateOne({ user_id }, {
    balance: data.balance,
    coin_name: data.coin_name, 
    coin_image:data.coin_image
   });

  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})



module.exports = {  GetPPDWallet, GetPPFWallet, GetPPEWallet, GetPPLWallet, GetUSDTWallet, UpdatedefaultWallet, GetDefaultWallet, UpdatedefaultWallet}
const Wallet = require("../model/wallet")
const BTCWallet = require("../model/Usdt-wallet")
const EThHWallet = require("../model/PPL-wallet")
const WGFWallet = require("../model/PPF-wallet")
const WGDWallet = require("../model/PPD-wallet")

// ================ store USDt wallet details ===================
const handleDefaultWallet = (async(user_id)=>{
    let balance = 10000
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698010748/wft_z3ouah.png"
    let coin_name = "WGF"
    let hidden_from_public = false
    let walletEl = {user_id, balance, coin_image, coin_name, hidden_from_public }
    try{
     let defal =  await Wallet.create(walletEl)
     return defal
    }
    catch(err){
        console.log(err)
    }
})

// ================ store USDt wallet details ===================
const createbtc = (async(user_id)=>{
    let balance =  0
    let coin_image = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
    let coin_name = "BTC"
    let coin_fname = "Bitcoin"
    let data = {user_id, balance, coin_image, coin_fname, coin_name}
    await BTCWallet.create(data)
})


 // ================ store PPD wallet  details===================
 const createEth = (async(user_id)=>{
    let balance =  0.0000
    let coin_image ="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
   let coin_fname = "Etheruem"
    let coin_name = "ETH"
    let data = {user_id, balance, coin_image, coin_name,coin_fname}
    await EThHWallet.create(data)
})

// ================ store PPF wallet  details===================
const createWGF = (async(user_id)=>{
    let now = new Date()
    let balance = 10000
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698010748/wft_z3ouah.png"
    let coin_fname = "Wager Fun"
    let coin_name = "WGF"
    let date = now
    let data = {user_id, balance, coin_image, coin_fname, coin_name, date}
    await WGFWallet.create(data)
})

// ================ store PPF wallet  details===================
const createwagerToken = (async(user_id)=>{
    let balance = 0
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698011384/type_1_w_hqvuex.png"
    let coin_fname = "Wager Dollar"
    let coin_name = "WGD"
    let data = {user_id, balance, coin_image, coin_fname, coin_name}
    await WGDWallet.create(data)
})

module.exports = {createWGF, createEth, createbtc, createwagerToken, handleDefaultWallet }
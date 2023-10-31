const jwt = require('jsonwebtoken');
const User = require("../model/User")
const Profile = require("../model/Profile")
const Wallet = require("../model/wallet")
const { createProfile } = require("./profileControllers")
var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`
const { format } = require('date-fns');
const { createCashbackTable } = require("../profile_mangement/cashbacks")
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const Chats = require("../model/public-chat")
const {createWGF, createEth, createbtc, createwagerToken, handleDefaultWallet  } = require("../wallet_transaction/index")
const { InitializeDiceGame } = require("../controller/diceControllers")
const { CreateAffiliate, CheckValidity } = require("./affiliateControllers")
const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock")
const { handleNewNewlyRegisteredCount } = require("../profile_mangement/cashbacks")
const createToken = ((_id)=>{
   return  jwt.sign({_id}, SECRET, { expiresIn: '4d' })
})


// Signup controller
const CreateAccount = (async (req, res)=>{ 
    const data = req.body
    let email = (data.user.email)
    let emailVerified = (data.user.emailVerified)
    let google_auth = false
    let user_id = (data.user.uid)
    const created_at = currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let password =  (data.user.apiKey)
    let provider =  (data.user.providerData[0].providerId)
    let invited_code = ""
    let username = data.user.displayName
    const fullData = {
        email, user_id, created_at, lastLoginAt, password, provider, emailVerified, google_auth,last_login_ip
    }
    const exist = await User.findOne({ user_id })
    if(!exist){
        try{
        await User.create(fullData)
        createWGF(user_id)
        createEth(user_id)
        createwagerToken(user_id)
        createbtc(user_id)
        InitializeDiceGame(user_id)
        const Token = createToken(user_id)
        const default_wallet = await handleDefaultWallet(user_id)
        let result = await createProfile(email, username, invited_code, user_id )
         res.status(200).json({Token,default_wallet,result })
        }
        catch(err){
           res.status(401).json({error: err})
        }
    }else{
        const result = await Profile.find({user_id})
        const default_wallet = await Wallet.find({user_id})
        const Token = createToken(user_id)
        res.status(200).json({Token,default_wallet:default_wallet[0],result: result[0] })
    }
})

const Register = (async(req, res)=>{
    const data = req.body
    let email = (data.user.email)
    let emailVerified = (data.user.emailVerified)
    let google_auth = 0
    let user_id = (data.user.uid)
    const created_at =  currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let password =  (data.user.apiKey)
    let provider =  (data.user.providerData[0].providerId)
    let username = ''
    let invited_code = data.reff
    const fullData = {
        email, user_id, created_at, lastLoginAt, password, provider, emailVerified, google_auth,last_login_ip
    }
    if(invited_code){
        let validateCode = await CheckValidity(invited_code,user_id )
        if(validateCode){
            invited_code = validateCode
        }
    }
    const exist = await User.findOne({ user_id })
    if(!exist){
        try{
        await User.create(fullData)
        createWGF(user_id)
        createEth(user_id)
        createwagerToken(user_id)
        createbtc(user_id)
        InitializeDiceGame(user_id)
        const Token = createToken(user_id)
        const default_wallet = await handleDefaultWallet(user_id)
        let result = await createProfile(email, username, invited_code , user_id )
            res.status(200).json({Token,default_wallet,result })
        }
        catch(err){
           res.status(401).json({error: err})
        }
    }else{
        const result = await Profile.find({user_id})
        const default_wallet = await Wallet.find({user_id})
        const Token = createToken(user_id)
        res.status(200).json({Token,default_wallet:default_wallet[0],result: result[0] })
    }
})

// get a user profile by id
const SingleUserByID = (async(req, res)=>{
    const {id} = req.params;
    try{
        const users =  await Profile.find({user_id:id})
        res.status(200).json(users)
    }
    catch(error){
        res.status(500).json({error})
    }
})

// ============= get previous messages ====================
const previousChats = (async(req, res)=>{
    try{
        let newMessage = await Chats.find()
        res.status(200).json(newMessage)
    }
    catch(err){
        res.status(500).json({error: err})
    }
})

module.exports = { 
    CreateAccount, 
    Register, 
    previousChats,
    SingleUserByID
}
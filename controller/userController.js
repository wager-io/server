const jwt = require('jsonwebtoken');
const User = require("../model/User")
const Profile = require("../model/Profile")
const Wallet = require("../model/wallet")
const { createProfile } = require("./profileControllers")
var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`
const { format } = require('date-fns');
const { createCashbackTable } = require("../profile_mangement/cashbacks")
const { genAffiliate } = require('../utils/genAffiliate');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { createWGF, createEth, createbtc, createwagerToken, handleDefaultWallet } = require("../wallet_transaction/index")
const { InitializeDiceGame } = require("../controller/diceControllers")
const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock")
const { handleNewNewlyRegisteredCount } = require("../profile_mangement/cashbacks")
const createToken = ((_id)=>{
   return  jwt.sign({_id}, SECRET, { expiresIn: '4d' })
})


// Signup controller
const CreateAccount = (async (req, res)=>{ 
    const data = req.body
    let affiliate_bonus = 0
    let email = (data.user.email)
    let emailVerified = (data.user.emailVerified)
    let google_auth = false
    let user_id = (data.user.uid)
    const created_at = currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let password =  (data.user.apiKey)
    let provider =  (data.user.providerData[0].providerId)
    let invited_code = ''
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
        createbtc(user_id)
        createwagerToken(user_id)
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
    let invited_code = ''
    const fullData = {
        email, user_id, created_at, lastLoginAt, password, provider, emailVerified, google_auth,last_login_ip
    }
    const exist = await User.findOne({ user_id })
    if(!exist){
        try{
        await User.create(fullData)
        createWGF(user_id)
        createEth(user_id)
        createbtc(user_id)
        createwagerToken(user_id)
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

//============================ store Affiliate Code =================
const createAffiliate = ((_data)=>{
    let user_id = _data?.user?.uid || _data?.user_id
    let created_at = currentTime
    let  affiliate_code = genAffiliate(9)
    let registered_friends = 0
    let  friends = JSON.stringify([])
    let  new_codes_generated = JSON.stringify([])
    let is_suspend = 0
    let commission_reward = 0
    let available_usd_reward = 0
    let welcome_msg = _data?.welcome_msg?.trim() || ""
    let is_activated = 0
    let data =  {
        user_id, 
        created_at, 
        affiliate_code,
         registered_friends,
         friends, 
         commission_reward,
         available_usd_reward,
         welcome_msg,
          is_activated, 
         new_codes_generated,
         is_suspend,
         today_commission: 0
    }
    let sql = `INSERT INTO affiliate_code SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            console.log(err)
        }else{
           (result)
        }
    })
})


//============================ update Affiliate Code =================
const updateAffiliate = (async (affiliateCode,user_id)=>{
    try {
        let query = `SELECT * FROM affiliate_code`;
         connection.query(query, async function(error, response){
        
            if(response && response.length > 0){
               function convertAffiliateFriendsToArray(data) {
                return data.map(function(item) {
                  try {
                    item.friends = JSON.parse(item.friends);
                  } catch (error) {
                    console.error( error);
                    item.friends = [];
                  }
                  return item;
                });
              }
              
              var dataArray = convertAffiliateFriendsToArray(response)
              
            //   find the affiliate code out
              const selected = dataArray.find(data=> data.affiliate_code.trim() === affiliateCode.trim())
              if(selected === undefined){
                console.log("invalid affiliate code")
                return;
              }
              const { affiliate_code, registered_friends, friends } = selected;

              const newFriends = [...friends];
              newFriends.push(user_id);
              
              try {
                const query = `UPDATE affiliate_code SET registered_friends = ${registered_friends + 1}, friends = ? WHERE affiliate_code = ?`;
                 connection.query(query, [JSON.stringify(newFriends), affiliate_code], function (error, response) {
                  if (error) {
                    console.error(error.message);
                  }
                });
                } catch (error) {
                    console.error(error.message);
                }
              
            }
        })
    } catch (error) {
      console.log(error.message)
    }
})


//============================ regenerate Affiliate Code =================
const regenerateAffiliateCode = (async(req, res)=>{
    const body = req.body;
    const user_id = body.id
    const welcome_msg = body.welcome_msg?.trim() || ""
    if(!user_id){
        return res.status(500).json({
            status:false,
            message:"User not found"
        });
    }
    try {
        let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
         connection.query(query, async function(error, response){
            if(response && response.length > 19){
                return res.status(500).json({
                    status:false,
                    message:"Max affiliate code generated"
                })
            }
            const data = {
                user_id,welcome_msg
            }
            createAffiliate(data)
            return res.status(200).json({
                status:true,
                message:"Affiliate Code generated successfully"
            })
        })
    } catch (error) {
        return res.status(501).json({
            status:false,
            message: error.message
        })
    }
})

//============================ regenerate Affiliate Code =================
const manuallygenerateAffiliateCode = (async(req, res)=>{
    const body = req.body;
    const user_id = body.id
    const new_affiliate_code = body.new_affiliate_code
    if(!new_affiliate_code){
        return res.status(500).json({
            status:false,
            message:"Input the new affiliate code"
        })
    }
    if(!user_id){
        return res.status(500).json({
            status:false,
            message:"User not found"
        });
    }
    try {
        let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
         connection.query(query, async function(error, response){
            if(response && response.length > 19){
                return res.status(500).json({
                    status:false,
                    message:"Max affiliate code generated"
                })
            }
            const data = {
                user_id
            }
          createAffiliate(data)
            return res.status(200).json({
                status:true,
                message:"Affiliate Code generated successfully"
            })
        })
    } catch (error) {
        return res.status(501).json({
            status:false,
            message: error.message
        })
    }
})

//======================= get all affiliate code ===================
const userAffiliateCodes = (async(req, res)=>{
    const body = req.body;
    const user_id = body.id
    if(!user_id){
        return res.status(500).json({
            status:false,
            message:"User not found"
        });
    }
    try {
        let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
        connection.query(query, async function(error, response){
        return res.status(200).json({
                status:true,
                data:response,
            })
        })
    } catch (error) {
        return res.status(501).json({
            status:false,
            message: error.message
        })
    }
})

// get a user profile by id
const SingleUserByID = (async(req, res)=>{
    const {id} = req.params;
    try{
        const users =   await Profile.find({user_id:id})
        console.log(users)
    }
    catch(error){
        res.status(500).json({error})
    }
})

// ============= get previous messages ====================
const previousChats = ((req, res)=>{
    let query = `SELECT * FROM public_chat`;
    connection.query(query, async function(error, response){
        res.status(200).json(response)
    })
})

module.exports = { 
    CreateAccount, 
    Register, 
    previousChats,
    SingleUserByID, 
    regenerateAffiliateCode,
    userAffiliateCodes,
    manuallygenerateAffiliateCode
}
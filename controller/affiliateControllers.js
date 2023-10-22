const { connection } = require("../database/index")
const { format } = require('date-fns');
const { genAffiliate } = require("../utils/genAffiliate");
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const {Helper} = require('../utils/helperFunction')
const helper = new Helper()

const handleActivateAffiliateCode = (async(req, res)=>{
    //============================ activate Affiliate Code =================
    const body = req.body;
    let user_id = req.id

    if(!body.code){
        return res.status(500).json({
            status:false,
            message:"Please provide code to activate"
        })
    }
    const msg = await helper.activateCode(body.code, user_id)

    return res.status(200).json({
        status:true,
        message: msg
    })
})

const handleAffiliateProfile = (async (req, res)=>{
    let user_id = req.id
    try {
        let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
         connection.query(query, async function(error, response){
            return res.status(200).json(response)
        })
    } catch (error) {
      console.log(error.message)
    }
})


const handleActivateAffiliate = (async (req, res)=>{
    let user_id = req.id
    const { data } = req.body
    try {
        let sql = `UPDATE affiliate_code SET is_activated="${data}" WHERE user_id="${user_id}"`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
        res.status(200).json("Updated successfully")
        });
    } catch (error) {
      console.log(error.message)
    }
})

const handleFriendsInfo = (async(req, res)=>{
    let user_id = req.id
    let usd_reward = []
    let commission_reward = []
    let friends_list = []
    let total_usd_bonus = []

    try {
        let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
         connection.query(query, async function(error, response){
            let friends = JSON.parse(response[0].friends)
            for(let i = 0; i < friends.length; i++){
                let query = `SELECT * FROM profiles WHERE user_id="${friends[i]}"`;
                connection.query(query, async function(error, response){
                    usd_reward.push(response[0].usd_reward)
                    commission_reward.push(response[0].commission_reward)
                    friends_list.push(response[0])
                    total_usd_bonus.push(response[0].earn_me)
               })
            }
        })

        setTimeout(()=>{
            let total_usd_reward = 0
            let total_commission_reward = 0
            let total_earn_me = 0
            for(let i = 0; i < usd_reward.length; i++){
                total_usd_reward += usd_reward[i]
            }

            for(let i = 0; i < commission_reward.length; i++){
                total_commission_reward += commission_reward[i]
            }

            for(let i = 0; i < total_usd_bonus.length; i++){
                total_earn_me += total_usd_bonus[i]
            }
            return res.status(200).json({total_commission_reward,total_earn_me , total_usd_reward, friends_list})
        },100)
    } catch (error) {
      console.log(error.message)
    }
})



const handleViewAllFriends = (async (req,res)=>{
    try {
        let user_id = req.id
        let query = `SELECT * FROM friends WHERE user_id = "${user_id}"`;
         connection.query(query, async function(error, response){
            return res.json(response)
        })
    } catch (error) {
      console.log(error.message)
    }
})


module.exports = { handleActivateAffiliateCode,handleViewAllFriends, handleAffiliateProfile , handleActivateAffiliate, handleFriendsInfo}
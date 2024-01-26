const Bills = require("../model/bill");

const handleBills = (async(req, res)=>{
    try{
        const { user } = req.body
        const responses = await Bills.find({user_id:user})
        res.status(200).json(responses)
    }
    catch(error){
        res.status(500).json(error)
    }
})

module.exports = { handleBills }
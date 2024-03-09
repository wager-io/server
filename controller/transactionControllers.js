const Bills = require("../model/bill");

const handleTransaction = (async(req, res)=>{
    const { id } = req.params;
    const { user_id } = req.id;
    try{
        const bill = id === "all" || id === "game" ? await Bills.find({user_id}) : []
        res.status(200).json(bill)
    }
    catch(error){
        res.status(500).json({error})
    }
})

module.exports = { handleTransaction }
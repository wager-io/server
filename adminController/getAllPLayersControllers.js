const { connection } = require("../database")

const GetAllPlayersByGameId = (async(req, res)=>{
    const id = req.body
    let query = `SELECT * FROM  crash_game  WHERE game_id="${id.game_id}"`;
    connection.query(query, async function(error, data){
        res.status(200).json(data)
    })
})

module.exports = { GetAllPlayersByGameId }
const { connection } = require("../database/index")

// Store crash_ history after it crash
const handleCrashHistory = ((e)=>{
    let data = {hash: e.hash, game_id:e.game_id, crash_point: e.crashpoint}
    let sql = `INSERT INTO crash_game_history SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            (err)
        }else{
            (result)
        }
    })
})

const handleGameCrash = ((event)=>{
    let sql3 = `UPDATE crash_game SET has_won="${0}", user_status="${0}", cashout="${0}", profit="${0}"  WHERE game_id="${event.game_id}" AND game_type="${'Classic'}" AND user_status="${1}"  `;
    connection.query(sql3, function (err, result) {
      if (err) throw err;
      (result)
    });
    let sql2 = `UPDATE crash_game SET game_hash="${event.hash}", payout="${event.crashpoint}", game_status="${0}" WHERE game_id="${event.game_id}" AND game_type="${'Classic'}" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
    });
    let sql4 = `UPDATE crash_game SET game_hash="${event.hash}", game_status="${0}" WHERE game_id="${event.game_id}"  `;
    connection.query(sql4, function (err, result) {
      if (err) throw err;
      (result)
    })
})


//================== update payout and crash hash ===========================
const handleMoonTrendballEl = ((game)=>{
    let sql2 = `UPDATE crash_game SET payout="${game.crashpoint}",  game_hash="${game.hash}", game_status="${0}" WHERE game_id="${game.game_id}" AND game_type="Moon" `;
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      (result)
    });
})



module.exports = { handleCrashHistory,handleGameCrash , handleMoonTrendballEl}
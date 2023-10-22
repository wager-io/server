const { connection } = require("../database/index")

const handleCreatePPDunlocked = ((user_id)=>{
    let data = {
        user_id,
        locked: 0,
        unlocked: 0
    }
    let sql = `INSERT INTO ppd_unlocked SET ?`;
    connection.query(sql, data, (err, result)=>{
        if(err){
            (err)
        }else{
          (result)
        }
    })
})

const handlePPDunLockUpdate = ((user_id, amount)=>{
    let query1 = `SELECT * FROM ppd_unlocked WHERE user_id="${user_id}"`;
    connection.query(query1, async function(error, data){
        let prev_bal = parseFloat(data[0].unlocked)
        let sql22= `UPDATE ppd_unlocked SET unlocked="${prev_bal + amount}" WHERE user_id="${user_id}"`;
        connection.query(sql22, function (err, result) {
          if (err) throw err;
        (result)
        });
    })
})

const unlockedPPD = ((user_id, total_wagered)=>{
    let query1 = `SELECT * FROM ppd_unlocked WHERE user_id="${user_id}"`;
    connection.query(query1, async function(error, data){
        let rsr = 0.01 * 0.25 * total_wagered
        let unlocked = parseFloat(data[0].unlocked)
        let locked = parseFloat(data[0].locked)

        if( locked > 0 ){
            let sql22= `UPDATE ppd_unlocked SET unlocked="${unlocked + rsr}", locked="${locked - rsr}" WHERE user_id="${user_id}"`;
            connection.query(sql22, function (err, result) {
              if (err) throw err;
            (result)
        })

         let query1 = `SELECT * FROM ppd_wallet WHERE user_id="${user_id}"`;
            connection.query(query1, async function(error, data){
            let prev_bal = parseFloat(data[0].balance)

            let sql22= `UPDATE ppd_wallet SET balance="${prev_bal + rsr}" WHERE user_id="${user_id}"`;
            connection.query(sql22, function (err, result) {
                if (err) throw err;
            (result)
                })
            })
        }
    })
})

const displayUnlockDDP = ((req, res)=>{
    const user_id = req.id
    try{
        let query1 = `SELECT * FROM ppd_unlocked WHERE user_id="${user_id}"`;
        connection.query(query1, async function(error, data){
            res.status(200).json(data)
        })
    }
    catch(error){
        res.status(500).json(error)
    }
})

module.exports = { handleCreatePPDunlocked, handlePPDunLockUpdate,unlockedPPD, displayUnlockDDP}
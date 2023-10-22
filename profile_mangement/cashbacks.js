const { connection } = require("../database/index")

const createCashbackTable = ((user_id)=>{
  let data = {
    user_id: user_id,
    week_cashback: 0,
    week_bonus:0,
    monthly_cashback: 0,
    recharge_balance: 0,
    recharge_settings: '',
    total_level_bonus: 0,
    vip_level: 0,
    total_bonus_claimed:0,
    next_level_point:1,
    month_bonus: 0,
    total_wagered: 0
  }
  let sql = `INSERT INTO cashbacks SET ?`;
  connection.query(sql, data, (err, data)=>{
      if(err){
          console.log(err)
      }
    })
})


const handleAllCashbacks = (async(req, res)=>{
    const user_id = req.id
    if(user_id){
      try{
        let query = `SELECT * FROM cashbacks WHERE user_id="${user_id}"`;
        connection.query(query, async function(error, data){
          res.status(200).json(data[0])
        })
      }
      catch(err){
        res.status(500).json({error: err})
      }
    }else{
      res.status(500).json({error: "No user found"})
    }
})


const level_upCard = (async(req, res)=>{
  const user_id = req.id

})

const handleUpdateDailyReports = (()=>{
  let query = `SELECT * FROM daily_reports`;
  connection.query(query, async function(error, data){
    let yesterdy = data[data.length - 1].date
    let before = new Date(yesterdy).getDate()
    let now = new Date().getDate()
    if( before !== now){
      let newStore = {
        DAU:0,
        newly_registered:0,
        total_new_deposit:0,
        total_new_deposit_amount:0,
        total_re_deposit_amount:0,
        total_withdraw_amount:0,
        total_withdraw: 0,
        date: new Date()
      }
      let sql = `INSERT INTO daily_reports SET ?`;
      connection.query(sql, newStore, (err, data)=>{
          if(err){
              console.log(err)
          }
        })
    }
  })
})
setInterval(()=> handleUpdateDailyReports() ,1000)

const handleNewNewlyRegisteredCount = (()=>{
  let query = `SELECT * FROM daily_reports`;
  connection.query(query, async function(error, data){
      let newly_registered = parseInt(data[0].newly_registered)
      let sql22= `UPDATE daily_reports SET newly_registered="${newly_registered + 1}"`;
      connection.query(sql22, function (err, result) {
        if (err) throw err;
      (result)
      })
  })
})


const handleTotalNewDepsitCount = ((amount)=>{
  let query = `SELECT * FROM daily_reports`;
  connection.query(query, async function(error, data){
      let newly_registered = parseInt(data[0].total_new_deposit)
      let deposit_amount = parseInt(data[0].total_new_deposit_amount)
      let sql22= `UPDATE daily_reports SET total_new_deposit="${newly_registered + 1}", total_new_deposit_amount="${deposit_amount + amount}", total_re_deposit_amount="${deposit_amount + amount}"`;
      connection.query(sql22, function (err, result) {
        if (err) throw err;
      (result)
      })
  })
})

module.exports = {  createCashbackTable, handleAllCashbacks, handleNewNewlyRegisteredCount, handleTotalNewDepsitCount}
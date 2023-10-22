const { connection  } = require("../database/index")

const Nextfirstofthemonth = (()=>{
  const today = new Date();
  // Get next month's index(0 based)
  const nextMonth = today.getMonth() + 1;
  const year = today.getFullYear() + (nextMonth === 12 ? 1: 0);
  // Get first day of the next month
  const firstDayOfNextMonth = new Date(year, nextMonth%12, 1);

  function getNextMonday(date = new Date()) {
    const dateCopy = new Date(date.getTime());
    const nextMonday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
      )
    );
    return nextMonday;
  }
  // 👇️ Get Monday of Next Weeka
  let data = {
    next_firstofthemonth: firstDayOfNextMonth,
    next_monday: new Date(getNextMonday()) 
  }


  let sql = `INSERT INTO app_timer SET ?`;
  connection.query(sql, data, (err, data)=>{
      if(err){
          console.log(err)
      }
    })
})


const handleMonthlyCashback = ((user_id, amount)=>{
    let query = `SELECT * FROM cashbacks WHERE user_id="${user_id}"`;
    connection.query(query, async function(error, data){
      let prev_bal = parseFloat(data[0].monthly_cashback)
      let new_bal = prev_bal + amount
      let sql = `UPDATE cashbacks SET monthly_cashback="${new_bal}" WHERE user_id="${user_id}"`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });
    })
})


const handleClaimMonthlyBonus = ((req, res)=>{
  let user_id = req.id
  try{
    let query = `SELECT * FROM cashbacks WHERE user_id="${user_id}"`;
    connection.query(query, async function(error, data){
      let new_bal = parseFloat(data[0].month_bonus)
      let new_claim = parseFloat(data[0].total_bonus_claimed)
      let query2 = `SELECT * FROM ppd_wallet WHERE user_id="${user_id}"`;
      connection.query(query2, async function(error, data){
        let prev_bal = parseFloat(data[0].balance)
      let sql2 = `UPDATE ppd_wallet SET balance="${new_bal + prev_bal}" WHERE user_id="${user_id}"`;
      connection.query(sql2, function (err, result) {
        if (err) throw err;
      });
      let sql3 = `UPDATE cashbacks SET month_bonus="${0}", total_bonus_claimed="${new_claim + new_bal}" WHERE user_id="${user_id}"`;
      connection.query(sql3, function (err, result) {
        if (err) throw err;
      });
    })
  })
    res.status(200).json({result: "Claimed successfully"})
}
catch(error){
    res.status(500).json({error})
}
})

const handleCashReturn = ((user_id, cash)=>{
  let sql2 = `UPDATE cashbacks SET monthly_cashback="${0}", month_bonus="${cash}" WHERE user_id="${user_id}"`;
  connection.query(sql2, function (err, result) {
    if (err) throw err;
  });
})

const handleMonthlyCashbackImplementation = (async()=>{
  let query = `SELECT * FROM cashbacks`;
  connection.query(query, async function(error, data){
      for(let i = 0; i < data.length; i++){
          if(data[i].monthly_cashback > 10000){
              let vip_level = data[i].vip_level
              let user_id = data[i].user_id
              let cash;
              let monthly_cashback = data[i].monthly_cashback
              if(vip_level < 38){
               cash = (monthly_cashback * 0.01 * 0.03).toFixed(6)
               handleCashReturn(user_id, cash )
              }
              else if(vip_level > 37 && vip_level < 56){
                  cash = (monthly_cashback * 0.01 * 0.35).toFixed(6)
                  handleCashReturn(user_id, cash )
              }
              else if(vip_level >= 56 && vip_level <= 89){
                  cash = (monthly_cashback * 0.01 * 0.04).toFixed(6)
                  handleCashReturn(user_id, cash )
              }
              else if(vip_level > 69 && vip_level < 85){
                  cash = (monthly_cashback * 0.01 * 0.045).toFixed(6)
                  handleCashReturn(user_id, cash )
              }
              else if(vip_level > 84 ){
                  cash = (monthly_cashback * 0.01 * 0.05).toFixed(6)
                  handleCashReturn(user_id, cash )
              }
          }
          else{
            cash = 0
            handleCashReturn(user_id, cash )
          }
      }
  })
}) 

module.exports = { handleMonthlyCashback, handleClaimMonthlyBonus ,handleMonthlyCashbackImplementation}
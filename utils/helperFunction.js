const { connection } = require("../database/index")
const { format } = require('date-fns');
const crypto = require('crypto')

class Helper {
 
 // Helper function for getting anyuser USDT spent
 async getallUSDT_wagered (user_id){
  
 }

 // Helper function for assigning a rank for a user
 async rank_user(user_id){
  // 100 -> 4_000 USDT-WAGER == VIP1
  // 5_000 -> 45_000 USDT-WAGER == silver
  // 49_000 -> 297_000 USDT-WAGER == gold
  // 321_000 -> 2_081_000 USDT-WAGER == platinum 1
  // 2_369_000 -> 8_577_000 USDT-WAGER == platinum 2
  // 9_217_000 -> 38_913_000 USDT-WAGER == diamond 1
  // 41_985_000 -> 212_993_000 USDT-WAGER == diamond 2
 }

 // Helper function for Keeping track of the user level
 async update_user_level(user_id){
  // 100 -> 4_000 USDT-WAGER == bronze
  // 5_000 -> 45_000 USDT-WAGER == silver
  // 49_000 -> 297_000 USDT-WAGER == gold
  // 321_000 -> 2_081_000 USDT-WAGER == platinum 1
  // 2_369_000 -> 8_577_000 USDT-WAGER == platinum 2
  // 9_217_000 -> 38_913_000 USDT-WAGER == diamond 1
  // 41_985_000 -> 212_993_000 USDT-WAGER == diamond 2

 }

 // Helper function for the Level Up Bonus
 async send_levelUpBonus(user_id){

 }

  // Helper function for the weekly cashback
  async send_weekly_cashback(user_id){

  }

    // Helper function for the weekly cashback
    async send_monthly_cashback(user_id){

    }


    async get_who_referred_me_id(user_id){
     return new Promise((resolve, reject) => {
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
              
              const foundObject = []
              for (const object of dataArray) {
                if (object.friends && object.friends.includes(user_id)) {
                  foundObject.push(object)
                  break;
                }
              }
              if(foundObject.length !== 0){
                // console.log('he was referred by:',foundObject[0].user_id)
                resolve(foundObject[0].user_id)
              }else{
                resolve("null")
              }
            
            }
        })
    } catch (error) {
      console.log(error.message)
    }
     })
      
  }


  async get_who_referred_me(user_id){
    return new Promise((resolve, reject) => {
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
             
             const foundObject = []
             for (const object of dataArray) {
               if (object.friends && object.friends.includes(user_id)) {
                 foundObject.push(object)
                 break;
               }
             }
             if(foundObject.length !== 0){
               resolve(foundObject[0])
             }else{
               resolve("null")
             }
           
           }
       })
   } catch (error) {
     console.log(error.message)
   }
    })
     
 }


 async get_players_that_used_USDT() {
  return new Promise(async (resolve, reject) => {
    const allUser = [];
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE token = "PPF" ORDER BY bet_amount DESC`; //CHANGE TO USDT
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              const array = response.map(item => item.user_id);
              array.forEach(e => allUser.push(e));
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(allUser);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async get_players_that_won_used_USDT() {
  return new Promise(async (resolve, reject) => {
    const allUser = [];
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE token = "PPF" AND has_won = ? ORDER BY bet_amount DESC `;
          connection.query(query,1, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              const array = response.map(item => item.user_id);
              array.forEach(e => allUser.push(e));
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(allUser);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async get_user_specific_details(user_id,detail) {
  return new Promise(async (resolve, reject) => {
    const allUser = [];
    const tableName = ["profiles"];

    try {
      const queries = tableName.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE ${detail} = "${user_id}"`;
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              response.forEach(e=>allUser.push(response))
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(allUser);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}



async userDeposit(user_id,detail) {
  return new Promise(async (resolve, reject) => {
    const allUser = [];
    const tableName = ["deposit_request"];

    try {
      const queries = tableName.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE ${detail} = "${user_id}" AND status ="successful"`;
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              response.forEach(e=>allUser.push(response[0]))
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(allUser);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async sumUSDTPPDPPL(user_id,detail) {
  return new Promise(async (resolve, reject) => {
    let sum = 0;
    const tableName = ["usdt_wallet","ppd_wallet","ppl_wallet"];

    try {
      const queries = tableName.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT balance FROM ${table} WHERE ${detail} = "${user_id}"`;
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              response.forEach(e=>sum += +response[0].balance)
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(sum);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async getAllUsersId(){
 return new Promise((resolve, reject) => {
  const query =`SELECT user_id FROM users`
  connection.query(query,async function(err,data){
    if(data && data.length >0){
      resolve(data)
    }else{resolve([])}
  })
 })
}


async getAllGamesReport(tableName){
  return new Promise((resolve, reject) => {
   const query =`SELECT bet_amount, has_won,cashout FROM ${tableName}`
   connection.query(query,async function(err,data){
     if(data && data.length >0){
       resolve(data)
     }else{resolve([])}
   })
  })
 }


async getUserHighestBet(user_id) {
  return new Promise(async (resolve, reject) => {
    let heighest_bet = 0;
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = 'SELECT * FROM ?? WHERE user_id = ? ORDER BY bet_amount DESC LIMIT 1';
          const values = [table, user_id];
          connection.query(query,values, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              heighest_bet += response[0].bet_amount
              // response.forEach(e=>allUser.push(response))
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);


      resolve(heighest_bet);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async getUserHighestBetWon(user_id) {
  return new Promise(async (resolve, reject) => {
    let heighest_bet = 0;
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = 'SELECT * FROM ?? WHERE user_id = ? AND has_won = ? ORDER BY bet_amount DESC LIMIT 1';
          const values = [table, user_id,1];
          connection.query(query,values, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              heighest_bet += response[0].bet_amount
              // response.forEach(e=>allUser.push(response))
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);


      resolve(heighest_bet);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async usdReward_to_commissionReward (){
  
}

async getUserHighestBetLoss(user_id) {
  return new Promise(async (resolve, reject) => {
    let heighest_bet = 0;
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = 'SELECT * FROM ?? WHERE user_id = ? AND has_won = ? ORDER BY bet_amount DESC LIMIT 1';
          const values = [table, user_id, 0];

          connection.query(query,values, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              heighest_bet += response[0].bet_amount
              // response.forEach(e=>allUser.push(response))
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);


      resolve(heighest_bet);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}


  async get_players_that_loss_used_USDT() {
    return new Promise(async (resolve, reject) => {
      const allUser = [];
      const all_game_tables = ["crash_game"];
  
      try {
        const queries = all_game_tables.map(table => {
          return new Promise((queryResolve, queryReject) => {
            const query = `SELECT * FROM ${table} WHERE token = "PPF" AND has_won = ? ORDER BY bet_amount DESC `;
            connection.query(query,0, async function (error, response) {
              if (error) {
                queryReject(error);
              } else if (response && response.length > 0) {
                const array = response.map(item => item.user_id);
                array.forEach(e => allUser.push(e));
                queryResolve();
              } else {
                queryResolve();
              }
            });
          });
        });
  
        // Wait for all queries to finish before resolving the main promise
        await Promise.all(queries);
  
        resolve(allUser);
      } catch (error) {
        console.error(error.message);
        reject(error);
      }
    });
  }
  


async getTotalUSDTWagered() {
  return new Promise(async (resolve, reject) => {
    let totalWagered = 0
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE token = "PPF" `;
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              if(response && (response.length !== 0)){
               for(const e of response){
                totalWagered += Number(e.bet_amount)
               }
              }
              // array.forEach(e => allUser.push(e));
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(totalWagered);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}


async getTotalUSDTWin() {
  return new Promise(async (resolve, reject) => {
    let totalWon = 0
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE token = "PPF" AND has_won = ? `;
          connection.query(query,[1], async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              if(response && (response.length !== 0)){
               for(const e of response){
                totalWon += Number(e.cashout)
               }
              }
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);
      resolve(totalWon);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

async getTotalUSDTWinByUser(user_id) {
  
  return new Promise(async (resolve, reject) => {
    let totalWon = 0
    const all_game_tables = ["crash_game"];

    try {
      const queries = all_game_tables.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE token = "PPF" AND has_won = ? AND user_id = ? `;
          connection.query(query,[1,user_id], async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              if(response && (response.length !== 0)){
               for(const e of response){
                totalWon += Number(e.cashout)
               }
              }
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);
      resolve(totalWon);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}


async get_total_player_balance(playersList) {
  return new Promise(async (resolve, reject) => {
    let amount = 0
    try {
      const queries = playersList.map(player => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM usdt_wallet WHERE user_id = "${player}"`;
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              const totalBalance = response.reduce((acc, currentItem) => {
                const balance = parseFloat(currentItem.balance);
                if (!isNaN(balance)) {
                  return acc + balance;
                }
                return acc;
              }, 0);
              amount = amount + totalBalance
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });

      // Wait for all queries to finish before resolving the main promise
      await Promise.all(queries);

      resolve(amount);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
}

// Helper function that takes an array and makes it unique by removing duplicate values
async uniqueArray(inputArray) {
  const uniqueValuesSet = new Set(inputArray);
  const uniqueArray = Array.from(uniqueValuesSet);
  return uniqueArray;
}


  // Helper function for getting how much a user has risked
  async getHowMuchRisked(user_id){
    return new Promise((resolve, reject) => {
      let _response = "";
      const tableNames = ["crash_game"]
     for(const tableName of tableNames){
      try {
        let query = `SELECT * FROM ${tableName} WHERE user_id = "${user_id}" AND token = "PPF"`;
         connection.query(query, async function(error, response){
        
            if(response && response.length > 0){
              
              const totalBetAmount = response.reduce((accumulator, currentValue) => {
                return accumulator + parseFloat(currentValue.bet_amount);
              }, 0);

              resolve(totalBetAmount)

            }else{
              resolve("null")
            }
        })
    } catch (error) {
      console.log(error.message)
      resolve("null")
    }
     }
    })
 }

 roundNumber(number){
  const numDigits = Math.abs(Math.floor(Math.log10(number))) + 1;
  if (numDigits >= 4) {
    return Math.round(number / 1000) * 1000;
  } else if (numDigits === 3) {
    return Math.round(number / 100) * 100;
  } else if (numDigits === 2) {
    return Math.round(number / 10) * 10;
  } else {
    return number;
  }
 }

 // Helper function for increasing the PPD WALLET
async incPPDWallet(amount,user_id){
  try {
      let query = `SELECT * FROM ppd_wallet WHERE user_id = "${user_id}"`;
       connection.query(query, async function(error, response){
          if(response && response.length > 0){
            try {
              const query = `UPDATE ppd_wallet SET balance = ${Number(response[0].balance) + Number(amount)}  WHERE user_id = ?`;
               connection.query(query, [user_id], function (error, response) {
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
}

async incWeeklyWagered(amount,user_id){
  try {
      let query = `SELECT * FROM profiles WHERE user_id = "${user_id}"`;
       connection.query(query, async function(error, response){
      
          if(response && response.length > 0){
            try {
              const query = `UPDATE profiles SET weekly_wagered = ${Number(response[0].weekly_wagered) + Number(amount)}  WHERE user_id = ?`;
               connection.query(query, [user_id], function (error, response) {
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
  
}

async clearWeeklyWagered(user_id){
  try {
    const query = `UPDATE profiles SET weekly_wagered = 0  WHERE user_id = ?`;
     connection.query(query, [user_id], function (error, response) {
      if (error) {
        console.error(error.message);
      }
    });
    } catch (error) {
        console.error(error.message);
    }
  
  
}

async incMonthlyWagered(amount,user_id){
  try {
      let query = `SELECT * FROM profiles WHERE user_id = "${user_id}"`;
       connection.query(query, async function(error, response){
      
          if(response && response.length > 0){
            try {
              const query = `UPDATE profiles SET monthly_wagered = ${Number(response[0].monthly_wagered) + Number(amount)}  WHERE user_id = ?`;
               connection.query(query, [user_id], function (error, response) {
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
  
}

async clearMonthlyWagered(user_id){
  try {
    const query = `UPDATE profiles SET monthly_wagered = 0  WHERE user_id = ?`;
     connection.query(query, [user_id], function (error, response) {
      if (error) {
        console.error(error.message);
      }
    });
    } catch (error) {
        console.error(error.message);
    }
  
  
}


/**
 * @params {number,value} = update
 */
async updateUserLevel(user_id,update){
  try {
    const query = 'UPDATE profiles SET vip_level = ?, vip_value = ? WHERE user_id = ?';
    const values = [update.number, update.value, user_id];  
     connection.query(query, values, function (error, response) {
      if (error) {
        console.error(error.message);
      }
    });
    } catch (error) {
        console.error(error.message);
    }
}

// Helper function for saving to the transaction_db
/**
 * @params {user_id, type_of_transation, trx_from, trx_sent_amount, 
 *          trx_received_amount, trx_to, datetime, status, transaction_id}
 */
async save_transaction(data) {
  try {
    const {
      user_id,
      transaction_type,
      sender_img,
      sender_name,
      sender_balance,
      trx_amount,
      receiver_balance,
      receiver_img,
      receiver_name,
      datetime,
      status,
      transaction_id,
      is_sending
    } = data;

    const fullData = {
      user_id,
      transaction_type,
      sender_img,
      sender_name,
      sender_balance,
      trx_amount,
      receiver_balance,
      receiver_img,
      receiver_name,
      datetime,
      status,
      transaction_id,
      is_sending
    };

    const sql = 'INSERT INTO transactions SET ?';
    const response = await new Promise((resolve, reject) => {
      connection.query(sql, fullData, (err, result) => {
        if (err) {
          reject(err); 
        } else {
          resolve(result);
        }
      });
    });

    return response;
  } catch (error) {
    throw error; // Rethrow any errors that occur
  }
}



async track_wager_transaction(data) {
  try {
    const {
      user_id,
      amount_added,
      risk_before,
      risk_after,
      trx_date
    } = data;

    const fullData = {
      user_id,
      amount_added,
      risk_before,
      risk_after,
      trx_date
    };

    const sql = 'INSERT INTO wager_trx SET ?';
    const response = await new Promise((resolve, reject) => {
      connection.query(sql, fullData, (err, result) => {
        if (err) {
          reject(err); 
        } else {
          resolve(result);
        }
      });
    });

    return response;
  } catch (error) {
    throw error; // Rethrow any errors that occur
  }
}



// Helper function for updating the crash_consumed
async updateCrashConsume() {
  /// stuck your code here

  return new Promise(async (resolve, reject) => {
    let amount = 1
    const tableNames = ["consumed"];
    try {
      const queries = tableNames.map(table => {
        return new Promise((queryResolve, queryReject) => {
          const query = `SELECT * FROM ${table} WHERE id = "1"`;
          connection.query(query, async function (error, response) {
            if (error) {
              queryReject(error);
            } else if (response && response.length > 0) {
              amount += Number(response[0].crash_consumed)
              // update it back
              const query = `UPDATE ${table} SET crash_consumed = ${amount} WHERE id = "1"`;
              connection.query(query, async function (error, response) {
                if(error){console.log(error)}
              })
              queryResolve();
            } else {
              queryResolve();
            }
          });
        });
      });
      
      await Promise.all(queries);
      resolve(amount);
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });

}


   

//  Helper function for getting all the bets by the user using the USDT token
async getAllUSDTRisked(user_id){
  return new Promise((resolve, reject) => {
    let amount = 0
    const tableNames = ["crash_game"] //all games to query here
   for(const tableName of tableNames){
    try {
      let query = `SELECT * FROM ${tableName} WHERE user_id = "${user_id}" AND token = "PPF"`;
       connection.query(query, async function(error, response){
        if(error){console.log(error)}else{
            response.forEach(e=> amount+=Number(e.bet_amount))
            resolve(amount)
        }
      })
  } catch (error) {
    console.log(error.message)
    resolve("null")
  }
   }
  })
   
}
  


    // Helper function for checking user affiliate balance of an affiliate code
    async get_affiliateCode_affiliate_balance(user_id,affiliateCode){
     return new Promise((resolve, reject) => {

      // query the user
      let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
          connection.query(query, async function(error, response){
             if(response && response.length !== 0){
              // filter out the result for the object that has the affiliateCode
              const selectedArray = response.filter(item=> item.affiliate_code === affiliateCode)
              
              if(selectedArray && selectedArray.length !== 0){
               resolve (Number(selectedArray[0].affiliate_balance))
              }resolve("")
             }
       })
     })
    }


       // Helper function for checking for removing user affiliate balance
       async subtract_affiliateCode_affiliate_balance(user_id,affiliateCode){
        return new Promise((resolve, reject) => {
   
         // query the user
         let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
             connection.query(query, async function(error, response){
                if(response && response.length !== 0){
                 // filter out the result for the object that has the affiliateCode
                 const selectedArray = response.filter(item=> item.affiliate_code === affiliateCode)
                 
                 if(selectedArray && selectedArray.length !== 0){
                  resolve (selectedArray[0].affiliate_balance)
                 }resolve("")
                }
          })
        })
       }


      //  Helper function for saving the withdrawal of commission to the PPD
      async saveCommissionWithdrawal() {
        return new Promise((resolve, reject) => {
          // id,user_id,withdrawal_date,amount
        })
      }


      // Helper function for saving the manage_friends to database
      async manage_friends(data){
        return new Promise((resolve, reject) => {
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
              const selected = dataArray.find(list=> list.affiliate_code.trim() === data.reff.trim())
              if(selected === undefined){
                console.log("invalid affiliate code")
               resolve()
              }

              try {
                let user_id = selected.user_id
                let total_wagered = 0
                let commission_reward = 0
                let  registration_date =  format(new Date(), 'yyyy-MM-dd HH:mm:ss');
                let  code = data.reff;
                let  referred_friend = data.user.uid
                let _data = {user_id,total_wagered,commission_reward,registration_date,code,referred_friend}
                let sql = `INSERT INTO friends SET ?`;
                connection.query(sql, _data, (err, result)=>{
                    if(err){
                        console.log(err)
                        resolve()
                    }else{
                        (result)
                        resolve()
                    }
                })

                } catch (error) {
                    console.error(error.message);
                    return;
                }

            }
          })
        })
      }

      // Helper function to check if a code is valid for a specific user
 async activateCode(reff_code,user_id){
  return new Promise((resolve, reject) => {
   try {
       let query = `SELECT * FROM affiliate_code`;
        connection.query(query, async function(error, response){
       
           if(response && response.length > 0){
           //   find the affiliate code out
             const selected = response.find(data=> data.affiliate_code.trim() === reff_code.trim() && data.user_id === user_id)
             if(selected === undefined){
               console.log("invalid affiliate code")
               resolve('invalid affiliate code')
             }

             const { is_activated } = selected;

             let new_update = is_activated === 0? 1 : 0
             let res_msg = is_activated === 0? "Affiliate Code activated Successfully": "Affiliate Code deactivated successfully"

             try {
               const query = `UPDATE affiliate_code SET is_activated = ${new_update} WHERE affiliate_code = ?`;
                connection.query(query, [reff_code], function (error, response) {
                 if (error) {
                  resolve('invalid affiliate code')
                 }
                 resolve(res_msg)
               });
               } catch (error) {
                resolve('invalid affiliate code')
               }
             
           }
       })
   } catch (error) {
    resolve('null')
   }
  })
   
}

      // Helper function for saving the user rewards   (DATABASE CREATED)
      async save_USD_Rewards(){
        return new Promise((resolve, reject) => {
          // Note before saving, check if the user_id already exist in the database
          //ELSE
          //save using
          // user_id,VIP level, EarnedMe, Registration time
        })
      }

      // Helper function for querying the USD REWARD SAVED using their user_id to query
      async query_USD_Rewards(){
        return new Promise((resolve, reject) => {
          
        })
      }



}

module.exports = {Helper}

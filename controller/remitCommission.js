

// Define the table to pay.
const tableToPay = ["crash_game"];

const remitCommission = async (connection) => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
   
//   run code exactly 12:00AM
  if (hours === 0 && minutes === 0 && seconds === 0) { ////////////////////
      const dispenseTime = new Date();
    // Iterate through the tableToPay array.
    for (const gameTable of tableToPay) {
      setTimeout(() => {

        // variables
        const allAffiliated = []  //list of people that really referred
        const all_daily_wagered = []
        try {
        const query = `SELECT * FROM affiliate_code`;
        connection.query(query, async function (error, response) {
          if (error) {
            console.error("Error executing query:", error);
          } else {
            response.map(affiliate=>{
                  if(JSON.parse(affiliate.affiliateFriends).length !== 0) {allAffiliated.push(affiliate)}})
            
            for (const receiver of allAffiliated){
                  const receiverId = receiver.user_id
                  const friendsId = JSON.parse(receiver.affiliateFriends)


                  let allForThisReceiver = []
                  
                  
                  // loop through the friends to check their bet_amount
                  for(const friendId of friendsId){

                        // search the gameTable for the friendId to pick the bet_amounts by the 
                        // friend that is between now and past 24hours 
                        const query = `SELECT * FROM ${gameTable} WHERE user_id = "${friendId}"`;
                        connection.query(query, async function (error, response) {
                          if (error) {
                            console.error("Error executing query:", error);
                          } else {
                              if(response.length !== 0){
                                    for(const res of response){
                                          const gameTime = new Date(res.time)
                                          const timeDifference = dispenseTime - gameTime

                                          // Define the number of milliseconds in 24 hours
                                          const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

                                          if (timeDifference < twentyFourHoursInMilliseconds) {
                                                // Calculate the commission to credit the referral     
                                                const Commission = Number(res.bet_amount)*0.01*0.15

                                                try {
                                                  const selectQuery = 'SELECT * FROM affiliate_code WHERE user_id = ?';
                                                  connection.query(selectQuery, [receiverId], async function (error, response) {
                                                    if (error) {
                                                      console.error(error.message);
                                                      return;
                                                    }
                                                
                                                    if (response && response.length > 0) {
                                                      // loop through to search for where the friend is attached
                                                      const foundFriend = response.find(hasfriend => {
                                                        const affiliateFriends = JSON.parse(hasfriend.affiliateFriends);
                                                        return affiliateFriends.includes(friendId);
                                                      });
                                                      if (foundFriend) {
                                                        console.log(foundFriend)
                                                        const { affiliate_balance, affiliateFriends } = foundFriend;
                                                          const newBalance = Number(affiliate_balance) + Commission;

                                                          try {
                                                            const affiliateFriendsArray = JSON.parse(affiliateFriends);
                                                            
                                                            const updateQuery = 'UPDATE affiliate_code SET affiliate_balance = ? WHERE user_id = ? AND affiliateFriends = ?';

                                                            // Execute the query
                                                            connection.query(updateQuery, [newBalance, receiverId, JSON.stringify(affiliateFriendsArray)], (error, results) => {
                                                              if (error) {console.error(error); } else {console.log('Update successful');
                                                              }
                                                            });
                                                          } catch (error) {
                                                            console.error(error);
                                                          }
                                                          console.log("__________________________")
                                                      }
                                                    } else {
                                                      console.error('User not found.');
                                                    }
                                                  });
                                                } catch (tryCatchError) {
                                                  console.error('An error occurred outside the query:', tryCatchError.message);
                                                }
                                          } else {
                                                console.log('dateNow is 24 hours or more than when the game was played');
                                          }

                                    }
                              }
                          }
                        })
                        
                  }
          }
          }
        });
        } catch (error) {
            console.log(error)
        }
      }, 10_000);
    }
  } 
};

module.exports = {
  remitCommission
};
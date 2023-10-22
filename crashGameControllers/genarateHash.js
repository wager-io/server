const { connection } = require("../database/index")
const crypto = require('crypto');


function hashInput(input, times) {
    let hashedValue = input;
    let num = 1
    let gameId = 100000

    let inter = setInterval(()=>{
        const hash = crypto.createHash('sha256');
        hashedValue = hash.update(hashedValue).digest('hex');
        if(num <= times){
            let data = {
                game_id: gameId + num,
                game_hash: hashedValue
            }
            let sql = `INSERT INTO crash_hash SET ?`;
            connection.query(sql, data, (err, result)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(num)
                }
            })
            num += 1
        }else{
            console.log("Generated hashes completed")
            clearInterval(inter)
        }
    },50)
}
 

  const input = 'c242f95eeb39166966118ceb07d35766ded15105390cbab8e26a60022a666d4d'; // Replace with your actual input
  const numberOfTimesToHash =  500000;
//  hashInput(input, numberOfTimesToHash);

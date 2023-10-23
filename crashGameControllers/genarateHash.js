const CrashHash = require("../model/crash_hash")
const crypto = require('crypto');


const hashInput = async(input, times)=> {
    let hashedValue = input;
    let num = 1
    let gameId = 100000

    let inter = setInterval(async()=>{
        const hash = crypto.createHash('sha256');
        hashedValue = hash.update(hashedValue).digest('hex');
        if(num <= times){
            let data = {
                game_id: gameId + num,
                game_hash: hashedValue
            }
          let saved = await CrashHash.create(data)
            console.log(saved, num)
            num += 1
        }else{
            console.log("Generated hashes completed")
            clearInterval(inter)
        }
    },100)
}
 
const input = `d71e0f071db39ecf8f1331ddfa58c073d267ee9388c4c4c967918a721f032042` // Replace with your actual input
const numberOfTimesToHash =  300000;
//  hashInput(input, numberOfTimesToHash);

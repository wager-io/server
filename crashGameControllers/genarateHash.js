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
            try{
                let saved = await CrashHash.create(data)
                console.log(saved, num)
                num += 1
            }
            catch(err){
                console.log(err)
            }
        }else{
            console.log("Generated hashes completed")
            clearInterval(inter)
        }
    },50)
}

const input = `13d64828e4187853581fdaf22758c13843bbb91e518c67a44c6b55a1cc3e3a5a` // Replace with your actual input
const numberOfTimesToHash =  300000;
//  hashInput(input, numberOfTimesToHash);

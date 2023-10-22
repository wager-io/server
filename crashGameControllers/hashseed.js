const crypto = require('crypto');

const salt = "0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4";

let count = 0
function crashPointFromHash(gameHash) {  
  const hash = crypto.createHmac("sha256", gameHash.game_hash).update(salt).digest("hex"); 
  const hex = hash.substring(0, 8);
  const int = parseInt(hex, 16);
  const crashpoint = Math.max(1, (Math.pow(2, 32) / (int + 1)) * (1 - 0.01)).toFixed(3);
  const rounddown = (Math.floor(crashpoint * 100) / 100).toFixed(2);
  let row = { hash: gameHash.game_hash, crashpoint: rounddown, game_id: gameHash.game_id};
  return row
}

module.exports = {
  crashPointFromHash
}
const crypto = require('crypto');
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';

const handleHashGeneration = (()=>{
// Generate a random server seed 
const serverSeed = crypto.randomBytes(32).toString('hex');
// The client provides their own seed
const clientSeed = '0c30b8b6aa51a1e0a33549b0a2ae82d9';
// Combine the server seed and client seed with a salt
const combinedSeed = serverSeed + salt + clientSeed;
// Create a hash of the combined seed using SHA-256 (or a different hash function if preferred)
const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
console.log('Server Seed:', serverSeed);
console.log('Client Seed:', clientSeed);
console.log('Salt:', salt);
console.log('Hash:', hash);
})

// handleHashGeneration()
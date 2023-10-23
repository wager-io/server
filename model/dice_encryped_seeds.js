const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
        unique : true
    },
    server_seed: {
        type: String,
        required: true,
    },
    client_seed: {
        type: String,
        required: true,
    },
    updated_at: {
        type: Date,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('dice_encryped_seed', Userschema)
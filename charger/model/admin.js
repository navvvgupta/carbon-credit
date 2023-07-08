const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    contractAddress: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
    },
    isMinter: {
        type: Boolean,
    }
},
    { timestamps: true },
)

module.exports=mongoose.model('Admin',adminSchema)
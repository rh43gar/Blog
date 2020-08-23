const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    username :  {
        type: String,
        unique: true
    },
    passwordHash : String
})

module.exports = mongoose.model('account', accountSchema)
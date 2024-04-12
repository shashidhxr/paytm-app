const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://shashidharb459:0jtZ2u06qV7c56U9@paytm-cluster0.pgxo5ce.mongodb.net/paytmapp")

const userSchema = new mongoose.schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 15,
    },
    second_name: {
        type: String,
        required: false,
        maxlength: 15,
    }, 
    username: {
        type: String,
        required: true, 
        unique: true,
        maxlength: 15,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }, 
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account,
}
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    profileImage:String,
    likedWaifus:[String]
})

// module.exports("User", user)
mongoose.model('User', UserSchema)
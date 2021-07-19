const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    profileImage:String,
    likedWaifus:[String],
    followers:Number,
    followersList:[String],
    about: String
})

// module.exports("User", user)
mongoose.model('User', UserSchema)
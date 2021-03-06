const mongoose = require('mongoose')
const WaifuSchema = new mongoose.Schema({
    // Waifu Information
    name:String,
    series:String,
    description:String,
    gender:String,
    image:String,
    likes:Number,
    
    // User Information
    owner:String
})

mongoose.model('Waifu', WaifuSchema)
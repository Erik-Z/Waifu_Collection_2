require('./Schemas/user')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

module.exports = function(passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({username: username}, (err, user)=>{
                if (err) throw err
                if (!user) return done(null, false, { message: 'Incorrect username.' })
                bcrypt.compare(password, user.password, (err, result) =>{
                    if (err) throw err
                    if (result) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Incorrect password.' })
                    }
                })
            })
        })
    )

    passport.serializeUser((user, callback) => {
        callback(null, user.id)
    })

    // Returns user and stores userInformation in req.user
    passport.deserializeUser((id, callback) => {
        User.findOne({_id: id}, (err, user) => {
            const userInformation = {
                username: user.username
            }
            callback(err, userInformation)
        })
    })
}
// nodemon app - start server
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const expressSession = require('express-session')
const app = express()
require('./Schemas/waifu')
require('./Schemas/user')

// Data Base
// const mongoURL = 'mongodb+srv://leafbright:pfzGv0E84FZtuPcV@cluster0.cazqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const mongoURL = process.env.MONGO_URI
const Waifu = mongoose.model('Waifu')
const User = mongoose.model('User')
mongoose.connect(mongoURL, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
mongoose.connection.on("connected",()=>{
    console.log("Connected to Database")
})
mongoose.connection.on("error",(err)=>{
    console.log(err)
})

// Middleware
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true, limit: '50mb'}))   
app.use(cors({credentials: true, origin: true}))

app.use(expressSession({
    secret: "SecretCode",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser("SecretCode"))
app.use(passport.initialize())
app.use(passport.session())
require("./passportConfig")(passport)

/*----------------------------------END OF MIDDLEWARE-----------------------------------------*/

// server requests
app.get('/', (req, res) => {
    Waifu.find({}).then(data=>{
        res.send(data)
    }).catch(err => {
        console.log(err)
    })
})

// Authentication Routes

/*
*   Logs user into the application
*   @param username: Username
*   @param password: Plain text password
*/
app.post('/login', async (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err
        if (!user) res.status(400).send({message: 'Incorrect Username or Password'})
        else {
          req.logIn(user, (err) => {
            if (err) throw err;
            res.send("Login Successful");
            console.log(req.user);
          });
        }
    })(req, res);
})

/*
*   Registers user to the application
*   @params username: Username obviously.
*   @params password: Plain text password. It gets hashed and stored in the database.
*/
app.post('/register', async (req, res) => {
    User.findOne({username: req.body.username}, async (err, doc) => {
        if (err) throw err
        if (doc) res.status(400).send({message: 'User Already Exists'})
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                profileImage: "https://i.imgur.com/TA3petQ.jpg",
                likedWaifus: [],
                followers: 0,
                followersList:[]
            })
            await newUser.save()
            res.send("User Created")
        }
    })
})

/*
*   Returns the document of logged in user.
*/
app.get('/user', async (req, res) => {
    res.send(req.user)
})

/*
*   Returns the user with the specified username
*   @param username: Username of the user.
*/
app.get('/get-user', (req, res)=> {
    User.findOne({username: req.query.username}, async (err, doc) => {
        if (err) throw err
        if (!doc) res.status(400).send({message: "User Doesn't Exists"})
        res.send(doc)
    })
})

/*
*   Logs the current user out of the application
*/
app.get('/logout', function(req, res){
    req.logout();
    res.send("Logout Successful")
    console.log("Logout Triggered")
})

/*------------------------------- END OF AUTHENTICATION ROUTES ------------------------------*/

// Waifu API Routes

/*
*   Adds a new Waifu Document to the database
*   @param name: Name of the waifu.
*   @param series: Series of the waifu.
*   @param description: Description of the waifu.
*   @param gender: Waifu's gender
*   @param image: Imgur link of the image.
*   @param owner: Username of who uploaded the Waifu.
*/
app.post('/add-waifu', async (req, res) => {
    const waifu = new Waifu(req.body)
    await waifu.save().then(data => {
        console.log(data)
        res.send('200 Success')
    }).catch(err => console.log(err))
})

app.delete('/delete', async (req, res) => {
    await Waifu.findByIdAndRemove(req.body.id).then(data=> {
        console.log(data)
        res.send(req.body.id + " Deleted")
    }).catch(err => console.log(err))
})

app.put('/update', async (req, res) => {
    await Waifu.findByIdAndUpdate(req.body.id, req.body).then(data => {
        console.log(data)
        res.send(req.body.id + " Updated")
    }).catch(err => console.log(err))
})

/*
*    Returns a list of all waifus created by a specific owner.
*    List is in newest - oldest order.
*    @param owner: Owner of the waifus in the list. 
*/
app.get("/waifus", async (req, res) => {
    console.log(req.query.owner)
    await Waifu.find({owner: req.query.owner}).sort({ _id: -1 }).then(data => {
        res.send(data)
    })
})

/*
*    Returns a list of all waifus in the database in newest - oldest order
*/
app.get("/all-waifus", async (req, res) => {
    await Waifu.find().sort({ _id: -1 }).then(data => {
        res.send(data)
    })
})

/*
*    Returns a list of liked waifus of a specified user
*    @params username: specified User
*/
app.get("/liked-waifus", async (req, res) => {
    await User.findOne({username: req.query.username}, async (err, doc) => {
        if (err) throw err
        if (!doc) res.status(400).send({message: "User Doesn't Exists"})
        res.send(doc.likedWaifus)
    })
})

/*------------------------------- END OF WAIFU API ROUTES ------------------------------*/

// User Profile Routes

/*
*   Adds a liked waifu to the selected user.
*   @params username: Selected user
*   @params waifu: ID of the waifu that is to be liked.
*/
app.post('/like-waifu', async (req, res) => {
    User.updateOne({username: req.body.username}, { $push: { likedWaifus: req.body.waifu}})
    .then(()=>{
        res.send('Waifu Liked')
        console.log('Waifu Liked')
    })
})

/*
*   Removes a liked waifu from the selected user.
*   @params username: Selected user
*   @params waifu: ID of the waifu that is to be unliked.
*/
app.post('/unlike-waifu', async (req, res) => {
    User.updateOne({username: req.body.username}, { $pull: { likedWaifus: req.body.waifu}})
    .then(()=>{
        res.send('Waifu UnLiked')
        console.log('Waifu Unliked')
    })
})

app.post('/inc-likes', async (req, res) => {
    Waifu.updateOne({_id: req.body.waifu}, { $inc: {likes: 1}})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.waifu + " Likes Incremented")
    })
})

app.post('/dec-likes', async (req, res) => {
    Waifu.updateOne({_id: req.body.waifu}, { $inc: {likes: -1}})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.waifu + " Likes Decremented")
    })
})

app.post('follow-user')
app.post('unfollow-user')

app.listen(3000, () => {
    console.log("Server Running")
})
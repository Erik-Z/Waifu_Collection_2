// nodemon app - start server
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const expressSession = require('express-session')
const app = express()
const fetch = require("node-fetch")
const FormData = require('form-data')
require('./Schemas/waifu')
require('./Schemas/user')

// Data Base
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
                followersList:[],
                about: ""
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

/*
*   Deletes the selected Waifu from the database
*   @params id: The _id of the selected waifu
*/
app.delete('/delete', async (req, res) => {
    await Waifu.findByIdAndRemove(req.body.id).then(data=> {
        console.log(data)
        res.send(req.body.id + " Deleted")
    }).catch(err => console.log(err))
    await User.updateMany({}, {$pull: {likedWaifus: req.body.id}}).then(data=> {
        console.log(data)
    }).catch(err => console.log(err))
})

/*
*   Updates contents of specified waifu.
*   @params id: The ID of specified waifu.
*/
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

/*
*   Increments selected waifu's likes count by 1
*   @params waifu: ID of selected waifu.
*/
app.post('/inc-likes', async (req, res) => {
    Waifu.updateOne({_id: req.body.waifu}, { $inc: {likes: 1}})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.waifu + " Likes Incremented")
    })
})

/*
*   Decrements selected waifu's likes count by 1
*   @params waifu: ID of selected waifu.
*/
app.post('/dec-likes', async (req, res) => {
    Waifu.updateOne({_id: req.body.waifu}, { $inc: {likes: -1}})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.waifu + " Likes Decremented")
    })
})

/*
*   Append specified user to authenticated user's follow list
*   @param user: the user that is to be followed
*/
app.post('/follow-user', async (req, res) => {
    if(req.user){
        User.updateOne({username: req.user.username}, { $push: { followersList: req.body.user}})
        .then(() => {
            res.send("200 Success")
            console.log(req.body.user + " Followed")
        })
    } else {
        res.status(400).send({message: "Not Logged In"})
    }
})

/*
*   Remove specified user to authenticated user's follow list
*   @param user: the user that is to be unfollowed
*/
app.post('/unfollow-user', async (req, res) => {
    if(req.user){
        User.updateOne({username: req.user.username}, { $pull: { followersList: req.body.user}})
        .then(() => {
            res.send("200 Success")
            console.log(req.body.user + " UnFollowed")
        })
    } else {
        res.status(400).send({message: "Not Logged In"})
    }
})

/*
*   Increments the number of followers of a specified user.
*   @params user: The specified User
*/
app.post('/inc-followers', async (req, res) => {
    User.updateOne({username: req.body.user}, { $inc: {followers: 1}})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.user + " Followers Incremented")
    })
})

/*
*   Decrements the number of followers of a specified user.
*   @params user: The specified User
*/
app.post('/dec-followers', async (req, res) => {
    User.updateOne({username: req.body.user}, { $inc: {followers: -1}})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.user + " Followers Decremented")
    })
})

/*
*   Uploads an image to imgur and sets it as the profile picture of uploader
*   @params image: image to be uploaded.
*   @params user: currently logged in user.
*/
app.post('/upload-profile-picture', async (req, res) => {
    const formData = new FormData();
    formData.append('image', req.body.image)
    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Client-ID ' + process.env.IMGUR_API
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            User.updateOne({username: req.body.user}, {profileImage: data.data.link})
            .then(()=>{
                res.send('200 Success')
                console.log(req.body.user + " Profile picture set to " + data.data.link)
            })
        } else {
            console.log(data)
            res.status(400).send({message: "Server is being stupid. Just try uploading again."})
        }
    })
})

/*
*   Updates the about section of the user.
*   @params about: the contents of the new about section.
*   @params user: currently logged in user.
*/
app.post('/update-user-about', async (req, res) => {
    User.updateOne({username: req.body.user}, {about: req.body.about})
    .then(()=>{
        res.send('200 Success')
        console.log(req.body.user + "'s About status updated.")
    })
})

app.listen(3000, () => {
    console.log("Server Running")
})
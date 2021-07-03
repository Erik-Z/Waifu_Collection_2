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
        console.log(data)
        res.send(data)
    }).catch(err => {
        console.log(err)
    })
})

// Authentication Routes
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

app.post('/register', async (req, res) => {
    User.findOne({username: req.body.username}, async (err, doc) => {
        if (err) throw err
        if (doc) res.status(400).send({message: 'User Already Exists'})
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            })
            await newUser.save()
            res.send("User Created")
        }
    })
})

app.get('/user', async (req, res) => {
    res.send(req.user)
})

app.get('/logout', function(req, res){
    req.logout();
    res.send("Logout Successful")
    console.log("Logout Triggered")
})

/*------------------------------- END OF AUTHENTICATION ROUTES ------------------------------*/

// Waifu API Routes
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

app.get("/waifus", async (req, res) => {
    console.log(req.query.owner)
    await Waifu.find({owner: req.query.owner}).sort({ _id: -1 }).then(data => {
        console.log(data)
        res.send(data)
    })
})

app.get("/all-waifus", async (req, res) => {
    await Waifu.find().sort({ _id: -1 }).then(data => {
        res.send(data)
    })
})

app.listen(3000, ()=> {
    console.log("Server Running")
})
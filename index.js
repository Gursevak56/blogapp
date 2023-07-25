const bodyParser = require('body-parser');
const express= require('express')
const session = require('express-session');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userrouter = require('./router/userrouter')
const User = require('./models/user.js');
const errorhandler = require('./middleware/errorhandler');
// const errorhandler = require('./middleware/errorhandler');
const cookieParser = require('cookie-parser');
const app =express();
require('dotenv').config();
const dburl = process.env.DB_URL;
console.log(dburl)
//Database connectivity
mongoose.connect(dburl,{useNewUrlParser:true}).then(()=>{
    console.log("user connected successfully");
}).catch((err)=>{
    console.log(err.message)
})
//Third party middlewares
app.use(express.static('public'))
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}))
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:60*1000
    }
}))
app.use(passport.initialize());
app.use(passport.session())
//routers
app.use('/',userrouter);
app.use((err,req,res,next)=>{
    if(err instanceof errorhandler){
        res.status(err.statuscode).json({
            message:err.message,
            status:'error',
            statuscode: err.statuscode,
            errorcode:err.errorcode,
            errordata:err.errordata
        })
    }
})
passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:'http://localhost:3001/callback'
},(accesstoken,refereshtoken,profile,done)=>{
     User.findOne({googleId:profile.id}).then(user=>{
        if(user){
            return done(null,user)
        }})
        const newuser = new User({
            googleId:profile.id,
            username:profile.displayname,
            email:profile.emails[0].value,
            phonenumber:profile.phonenumber
        })
     newuser.save().then(()=>{
        console.log('user sign in successfully')
     }).catch(err=>{
        console.log(err.message);
     })
}))
passport.serializeUser((user,done)=>{
    return done(null,user);
})
passport.deserializeUser((user,done)=>{
    return done(null,user);
})
//server connectivity
app.listen(process.env.PORT,()=>{
    console.log(`server connected on ${process.env.PORT}`);
})

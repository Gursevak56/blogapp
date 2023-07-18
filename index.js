const bodyParser = require('body-parser');
const express= require('express')
const session = require('express-session');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const userrouter = require('./router/userrouter')
const errorhandler = require('./middleware/errorhandler');
const cookieParser = require('cookie-parser');
const app =express();
require('dotenv').config();
const dburl = process.env.DB_URL;
console.log(dburl)
//Database connectivity
mongoose.connect(dburl,{useNewUrlParser:true}).then(()=>{
    console.log("user connected successfully");
}).catch((err)=>{
    console.log(err.message);
})
//Third party middlewares
app.use(helmet());
app.use(morgan());
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}))
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave:true
}))
//routers
app.use('/',userrouter);
app.use(errorhandler)
//server connectivity
app.listen(process.env.PORT,()=>{
    console.log(`server connected on ${process.env.PORT}`);
})

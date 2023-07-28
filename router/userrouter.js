const express= require('express')
const router = express.Router();
const passport  = require('passport')
const user = require('./../models/user.js');
const usercontroller = require('./../controller/usercontroller')
const authenticate = require('./../middleware/authenticate')
//routers
router.get('/home',usercontroller.home)
router.post('/signup',authenticate.islogout,usercontroller.signup);
router.post('/signin',authenticate.islogout,usercontroller.signin);
router.get('/logout',authenticate.islogin,usercontroller.logout)
router.post('/addblog',authenticate.islogin,usercontroller.addblog);
router.get('/like/:id',authenticate.islogin,usercontroller.like);       
router.get('/allblogs',authenticate.islogout,usercontroller.allblogs);
router.post('/comment/:id',authenticate.islogin,usercontroller.comment)
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email','https://www.googleapis.com/auth/user.phonenumbers.read']}));
router.get('/callback',passport.authenticate('google',{successRedirect:'/profile',failureRedirect:'/signup'}))
router.get('/profile',usercontroller.profile);
router.put('/deleteblog/:id',authenticate.isadmin||authenticate.userauthorization,usercontroller.deleteblog)
router.post('/auth/search',authenticate.islogin,usercontroller.searchdata);
router.post('/auth/blogsearch',authenticate.islogin,usercontroller.searchblogdata);
module.exports = router;
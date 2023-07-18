const express= require('express')
const router = express.Router();
const user = require('./../models/user');
const usercontroller = require('./../controller/usercontroller')
const authenticate = require('./../middleware/authenticate')
//routers
router.post('/signup',authenticate.islogout,usercontroller.signup);
router.post('/signin',authenticate.islogout,usercontroller.signin);
router.get('/logout',authenticate.islogin,usercontroller.logout)
router.post('/addblog',authenticate.islogin,usercontroller.addblog);
router.get('/like/:id',authenticate.islogin,usercontroller.like);       
router.get('/allblogs',usercontroller.allblogs);
router.post('/comment/:id',authenticate.islogin,usercontroller.comment)
module.exports = router;
const express= require('express')
const router = express.Router();
const user = require('./../models/user');
const usercontroller = require('./../controller/usercontroller')
//routers
router.post('/signup',usercontroller.signup);
router.post('/signin',usercontroller.signin);
module.exports = router;
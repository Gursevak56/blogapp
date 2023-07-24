const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service:"email",
    host:"smtp",
    port:"587",
    auth:{
        user:"gursevaksinghgill21@gmail.com",
        pass:process.env.GMAIL_PASS
    }
    
})
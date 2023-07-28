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
const mailOptions = {
    from:"gursevaksgill@nexgeniots.com",
    to:email,
    subject:'Email verification',
    html:'<p> Hii '+name+' This is otp for email verification </p>'
}
transporter.sendMail(mailOptions,(err,value,next)=>{
    if(err){
        next(err)
    }
    else{
        console.log('email sent successfully')
    }
})
const genrateotp =  ()=>{
    let otplength = 6;
   let otp ='';
    for(let i =1;i<6;i++){
    otp = otp + Math.floor(Math.random() *  10);
    }
    return otp;
}
console.log(genrateotp());
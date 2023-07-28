const nodemailer = require('nodemailer');
const Otp = require('./../models/otp');
require('dotenv').config();
const verifyemail = async (email,name)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        port:"567",
        auth:{
            user:"gursevaksinghgill21@gmail.com",
            pass:process.env.GMAIL_PASS
        }
    })
    const mailOptions = {
        from:"gursevaksinghgill21@gmail.com",
        to:email,
        subject:'Email verification',
        html:'<p> Hii '+name+' This is otp for email verification '+genrateotp()+'</p>'
    }
    transporter.sendMail(mailOptions,(err,value)=>{
        if(err){
            console.log(err.message)
        }
        else{
            console.log('email sent successfully')
        }
    })
}
let sentotp ='';
const genrateotp =  ()=>{
    let otplength = 6;
   let otp ='';
    for(let i =1;i<6;i++){
    otp = otp + Math.floor(Math.random() *  10);
    }
    const savedotp = new Otp({
        otp:otp
    })
    savedotp.save();
    return otp;
}
console.log(genrateotp());
module.exports = {
    verifyemail,
    sentotp
}
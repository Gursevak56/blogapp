const nodemailer = require('nodemailer');
const Otp = require('./../models/otp');
require('dotenv').config();
const verifyemail = async (email,name,phoneNumber)=>{
    console.log(process.env.GMAIL_PASS)
    const transporter = nodemailer.createTransport({
        service:"gmail",
        port:"567",
        secure:false,
        auth:{
            user:"gursevaksinghgill21@gmail.com",
            pass:"onlfsmvfbardclkl"
        }
    })
    const emailotp =await genrateotp();
    const mailOptions = {
        from:"gursevaksinghgill21@gmail.com",
        to:email,
        subject:'Email verification',
        html:'<p> Hii '+name+' This is otp for email verification '+emailotp+'</p>'
    }
    transporter.sendMail(mailOptions,(err,value)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log('email sent successfully')
        }
    })
}
let emailotp = '';
const genrateotp = async ()=>{
    let otplength = 6;
   let otp ='';
    for(let i =1;i<6;i++){
    emailotp = emailotp + Math.floor(Math.random() *  10);
    }
    const savedotp = new Otp({
        emailotp:emailotp
    })
   await savedotp.save();
    return emailotp;
}
module.exports = {
    verifyemail
}
const twilio = require('twilio')
require('dotenv').config();
console.log(process.env.TWILIO_AUTH_TOKEN)
const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
client.messages.create({
    body:"7893",
    from:"+917037772781",
    to:'+919756017535'
}).then(()=>{
    console.log('otp sent successfully');
}).catch(err=>{
    console.log(err.message);
})

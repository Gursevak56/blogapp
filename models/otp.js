const mongoose = require('mongoose');
const otpschema = mongoose.Schema({
    otp:{type:String,required:true},
    expiresAt:{
        type:Date,
        default:()=>{Date.now() +12000},
        index:{expires:'2m'}
    }
})
const Otp = mongoose.model('otp',otpschema);
module.exports = Otp;
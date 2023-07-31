const mongoose = require('mongoose');
const otpschema = mongoose.Schema({
    emailotp: { type: String, required: true },
    expiresAt: {
        type: Date,
        default: () => { Date.now() + 12000 },
        index: { expires: '2m' }
    }

})
const Otp = mongoose.model('otp', otpschema);
module.exports = Otp;
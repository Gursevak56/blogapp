const mongoose = require('mongoose');
const paymentschema = mongoose.Schema({
    paymentId:{type:String,required:true},
    amount:{type:String,required:true}
})
const Payment= mongoose.model('payment',paymentschema);
module.exports = Payment;
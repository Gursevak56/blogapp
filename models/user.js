const mongoose = require('mongoose');
const validator = require('validator.js')
const userschema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        maxLength:10,
        minLength:8,
        validate:{
            validator:function (value){
                const passRegex = /[a-z]/
                passRegex.test(value)
            },
            message:"please enter password in small word and length between 8 and 10"
        }
    },
    confirmpassword:{
        type:String,
        maxLength:10,
        minLength:8,
        validate:function (value){
            return this.password === value
        },
        message:"password must be match with the confirm password"
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        maxLength:12,
        minLength:10
    }
},{timestamps:true})
const User = mongoose.model('user',userschema);
module.exports = User;
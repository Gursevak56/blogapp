const mongoose = require('mongoose');
const validator = require('validator.js')
const bcrypt = require('bcrypt')
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
    confirmpassword: {
        type: String,
        required:true,
        maxLength: 10,
        minLength: 8,
        validate:{
            validator:function (value){
                return this.parent().password == value
            },
            message:"password must match with the confirm password"
        }
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
userschema.pre('save',function (next){
    if(this.isModified('password')|| this.isNew()){
        const hashpassword = bcrypt.hashSync(this.password,10);
        this.password = hashpassword;
        next()
    }
    else{
        next()
    }
})
userschema.methods.comparepass = async function (password,passworddb){
    return await bcrypt.compare(password,passworddb);
}

const User = mongoose.model('user',userschema);
module.exports = User;
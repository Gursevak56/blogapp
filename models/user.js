const mongoose = require('mongoose')
const validator = require('validator.js')
const bcrypt = require('bcrypt')
const userschema = mongoose.Schema({
    username:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false,
        maxLength:10,
        minLength:8,
        validate:{
            validator:function (value){
                const passRegex = /^(?=.*[~!@#$%^&*()+?])(?=.*[A-Za-z])(?=.*[0-9]).{8,10}$/
                return passRegex.test(value)
            },
            message:"please enter password in small word and length between 8 and 10"
        }
    },
    confirmpassword: {
        type: String,
        required:false,
        select:false,
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
        required:true,
        validate:{
            validator:function (value){
                const emailRegex = /^(?=.*@)[^\s@]+@[^\s@]+\.[^\s@]+$/

                return emailRegex.test(value)
            },
            message:"email must have @ and number"
        }
    },
    phoneNumber:{
        type:String,
        required:false,
        // validate:{
        //     validator:function (value){
        //         const phoneRegex = /^\+\d{1,3}-\d{3}-\d{4}$|^\+\d{1,3}\d{10}$/;
        //         return phoneRegex.test(value);
        //     },
        //     message:"phone number must have + sign and country code"
        // }
    },
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog'
    }],
    googleId:{
        type:String
    },
    isadmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
userschema.pre('save',function (next){
    if(this.isModified('password')){
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
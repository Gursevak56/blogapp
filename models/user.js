const mongoose = require('mongoose');
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
                const passRegex = /[a-z]/
                passRegex.test(value)
            },
            message:"please enter password in small word and length between 8 and 10"
        }
    },
    confirmpassword: {
        type: String,
        required:false,
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
        required:false
    },
    phoneNumber:{
        type:String,
        required:false,
        maxLength:12,
        minLength:10
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
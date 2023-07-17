const user = require('./../models/user');
module.exports ={
    signup: async (req,res)=>{
        const email = req.body.email;
        const checkuser = await user.findOne({email:email});
        if(!checkuser){
            const newuser = new user({
                username:req.body.username,
                password:req.body.password,
                confirmpasword:req.body.password,
                email:req.body.email,
                phonenumber:req.body.phonenumber
            })
        }
    }
}
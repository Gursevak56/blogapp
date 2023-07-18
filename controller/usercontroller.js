const User = require('./../models/user');
module.exports ={
    signup: async (req,res)=>{
        try {
            const email = req.body.email;
        console.log(email);
        const checkuser = await User.findOne({email:req.body.email})
        console.log(checkuser)
        if(checkuser){
            res.status(200).json({
                message:"user already exists"
            })
        }
        const newuser = new User({
            username:req.body.username,
            password:req.body.password,
            confirmpasword:req.body.confirmpasword,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber
        })
        const saveduser = await newuser.save().then(()=>{
            console.log("user inserted successfully");
        }).catch(err=>{
            console.log(err.message);
        })
    
        } catch (error) {
            res.status(400).json({
                message:error.message
            })
        }
    },
    signin:async (req,res,next)=>{
        try {
            const email = req.body.email;
            const checkuser = await User.findOne({email:email});
            if(!checkuser){
                const err = new Error('user not found',404)
                next(err);
            }
          const passwordcheck =  await checkuser.comparepass(req.body.password,checkuser.password);
          if(!passwordcheck){
            const err = new Error('your password is incorrect',403);
            next(err);
          }
          req.session.user = checkuser;
          res.status(200).json({
            message:"user log in successfully",
            user:checkuser,
            cookies:req.cookies
          })
        } catch (error) {
            next(error)
        }
    }
}
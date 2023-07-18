const islogin = async (req,res,next)=>{
    if(req.session.user){
        next()
    }
    else{
        const err = new Error('user is offline',400);
        next(err);
    }
}
const islogout = async (req,res,next)=>{
    if(req.session.user){
        const err = new Error('user is online',400)
        next(err);
    }
    else{
        next();
    }
}
module.exports = {
    islogin,
    islogout
}
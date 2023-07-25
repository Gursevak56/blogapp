const errorhandler = require('./errorhandler')
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
        const err = new errorhandler("you are already online",403,'wrong request',{addtionaldata:'please enjoy your session'});
        next(err)
    }
    else{
        next();
    }
}
const isadmin = async (req,res,next)=>{
    if(req.session.user.isadmin == true){
        next()
    }
    else{
        const err = new errorhandler('you have not permission to access this module',403)
        next(err);
    }

}
const userauthorization= async (req,res,next)=>{
    const blog = await Blog.findOne({_id:req.params.id});
    if(req.session.user._id === blog.author){
        next()
    }
    else{
        const err = new Error("you have not permission to delete this blog",403);
        next(err);
    }
}
module.exports = {
    islogin,
    islogout,
    isadmin,
    userauthorization
}
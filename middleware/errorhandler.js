const errorhandler = (err,req,res)=>{
    res.status(403).json({
        status:'fail',
        message:err.message
    })
}
module.exports = errorhandler;
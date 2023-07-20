class errorhandler extends Error{
    constructor(message,statuscode,errorcode,errordata){
        super(message);
        this.name=this.constructor.name,
        this.statuscode=statuscode||500,
        this.errorcode = errorcode||'genric_error',
        this.errordata = errordata||{},
        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports = errorhandler;
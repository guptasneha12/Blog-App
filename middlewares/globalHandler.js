const globalErrHandler=(err,req,res,next)=>{
    // status:failed/something happend /server error
    // message
    // stack: it shows in which file and in which line the error has occured


    const stack= err.stack;
    const message=err.message;
    const status=err.status? err.status: 'Failed';
    const statusCode=err.statusCode? err.statusCode : 500;

    // send the response
    res.status(statusCode).json({
        message,
        status,
        stack,
      
    });


};

module.exports=globalErrHandler;
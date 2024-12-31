const { expressError } = require("./expressError");

function AsyncWrap(inp_func){
    return (req,res,next)=>{
        inp_func(req,res,next).catch((err)=>{
            next(new expressError(err,501));
        })
    }
}

module.exports=AsyncWrap;
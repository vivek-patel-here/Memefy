const Joi=require("joi");

const chatSchema = Joi.object({
    chat:Joi.string(),
    image:Joi.string(),
    postedBy:Joi.object().required() //////
}).required();

const  ValidateChatSchema =(req,res,next)=>{
    let {error}=chatSchema.validate(req.body);
    if(error){
        next(error);
    }
    next()
}

module.exports={ValidateChatSchema};
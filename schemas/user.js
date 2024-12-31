const Joi = require("joi");
const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
}).required();

function ValidateUserSchema(req,res,next){
    let {error}=userSchema.validate(req.body);
    if(error){
        next(error);
    }
    next();
}

module.exports={ValidateUserSchema}

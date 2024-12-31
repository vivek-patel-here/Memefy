const mongoose = require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  profile:{type: String,
    default:"https://res.cloudinary.com/dhmnfhipn/image/upload/v1735563395/Memestream/nvo9mdftonsc5re1f8qb.png",
    set:(v)=>v===''?"https://res.cloudinary.com/dhmnfhipn/image/upload/v1735563395/Memestream/nvo9mdftonsc5re1f8qb.png":v
  }    //image url
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);

module.exports={User};
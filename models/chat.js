const mongoose =require("mongoose");

const chatSchema = new mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chat:{type: String},
    image:{
        type: String,
    }

})

const Chat = mongoose.model("Chat",chatSchema);

module.exports={Chat}
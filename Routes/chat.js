const express=require("express");
const router=express.Router();
const {Chat}= require("../models/chat.js")
const {User}=require("../models/user.js")
const {upload}=require("../utils/multerStorage.js")
const {ValidateChatSchema}=require("../schemas/chat.js")
const Wrap =require("../utils/Errorhandler.js")


router.get("/",Wrap(async(req,res)=>{
    let chats =await Chat.find().populate("postedBy");
    res.render("chat.ejs",{chats:chats});
}))


router.post("/",upload.single("image"),Wrap(async(req,res,next)=>{
    if(req.file){
        req.body.image=req.file.path;
    }else{
        req.body.image="https://res.cloudinary.com/dhmnfhipn/image/upload/v1735566574/Memestream/ypfswy1gsosfglyr4lpj.jpg"
    }
    let q={username:req.session.passport.user};
    let owner=await User.findOne(q);
    req.body.postedBy=owner._id;
    next();
}),ValidateChatSchema,Wrap(async(req,res)=>{
    let newchat=new Chat(req.body);
    await newchat.save();
    req.flash("success","Message Sent Successfully!")
    res.redirect("/chat");
}))

module.exports = router
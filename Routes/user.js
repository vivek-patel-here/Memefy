const express = require("express");
const router = express.Router();
const { ValidateUserSchema } = require("../schemas/user.js");
const { User } = require("../models/user.js");
const {Chat}=require("../models/chat.js")
const passport = require("passport");
const { upload } = require("../utils/multerStorage.js");
const Wrap =require("../utils/Errorhandler.js");
const {isLogIn}=require("../utils/authentication_middlewares.js")


router.get("/",Wrap(async(req,res)=>{
  let users=await User.find();
  res.render("user.ejs",{users});
}))

router.get("/signup", (req, res) => {
  res.render("SignUpForm.ejs");
});

router.post("/signup", Wrap(async (req, res, next) => {
  let { username, email, password } = req.body;
  let newuser = { username, email };
  let checkuser =await User.findOne({username});
  if(checkuser){
    req.flash("error","A user with the given username is already registered! Try Login. Or signup with another username. ")
    res.redirect("/user/signup");
  }
  let registeredUser = await User.register(newuser, password);
  req.logIn(registeredUser, (err) => {
    if (err) {
      next(err);
    }
    req.flash("success","Welcome To MemeStream!")
    res.redirect("/chat");
  });
}));


router.get("/login", (req, res, next) => {
  res.render("LogInForm.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/user/login" ,failureFlash:true}),
  (req, res) => {
    req.flash("success","Welcome Back!")
    res.redirect("/chat");
  }
);

router.get("/logout",isLogIn, (req, res, next) => {
  req.logOut((err) => {
    req.flash("error","Unable to log-out at this moment! :(")
    next(err);
  });
  req.flash("success","Logged-Out Successfully!")
  res.redirect("/chat");
});

router.get("/profile",isLogIn,Wrap( async (req, res) => {
  let { user: username } = req.session.passport;
  let userProfile = await User.findOne({ username });
  res.redirect(`/user/profile/${userProfile._id}`);
}));

router.get("/profile/:id",isLogIn,Wrap(async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  res.render("profile.ejs", { user });
}));

router.post("/profile/:id",isLogIn,upload.single("profile"),Wrap(async (req, res) => {
  let { id } = req.params;
  await User.findByIdAndUpdate(id, { profile: req.file.path });
  req.flash("success","Profile Updated successfully!");
  res.redirect(`/user/profile/${id}`);
}));

router.delete("/:id",isLogIn,Wrap(async(req,res,next)=>{
  let{id}=req.params;
  let user= await User.findById(id);
  await Chat.deleteMany({postedBy:user._id});
  await User.findByIdAndDelete(id);
  req.logOut((err)=>{
    req.flash("error","Unable to delete Account!");
    next(err)
  })
  req.flash("success","Account Deleted Successfully!");
  res.redirect("/chat");
}))

module.exports = router;

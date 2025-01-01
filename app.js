//Jai Siya Ram
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const http =require("http")
const express = require("express");
const app = express();
const server = http.createServer(app);
const {Server}=require("socket.io");
const io = new Server(server);
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { main } = require("./utils/connectDB.js");
const chatRoute = require("./Routes/chat.js");
const userRoute = require("./Routes/user.js");
const { expressError } = require("./utils/expressError.js");
const passport = require("passport");
const LocalStorage = require("passport-local");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { User } = require("./models/user.js");
const flash=require("connect-flash");
let Db_url=`${process.env.DATABASE_URL}`;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // Unable us to use ejs-layouts

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // To parse the urlEncoded Data
app.use(express.json());
let store = MongoStore.create({
  mongoUrl:Db_url,
  crypto:{
    secret:`${process.env.SECRET}`
  }
})
app.use(
  session({
    store:store,
    secret:`${process.env.SECRET}`,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStorage(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash())

// connecting to DB

main(Db_url)
  .then(() => {
    console.log("Connection established Successfully!");
  })
  .catch((err) => {
    console.log("Unable to connect to Database\nDue to:\n", err);
  });

//For authentication
app.use((req, res, next) => {
  res.locals.currentUser = req.session.passport;
  res.locals.success =req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//socket.io
io.on("connection",(socket)=>{
  socket.on("new-msg",(msg)=>{
    io.emit("msg",msg)
  })
})


//redirecting to home page
app.get("/", (req, res) => {
  res.redirect("/chat");
});

//chat Routes
app.use("/chat", chatRoute);

//user Routes
app.use("/user", userRoute);

//page not found
app.use("*", (req, res,next) => {
  next(new expressError("Page not Found",501))
});

//Error Handler
app.use((err, req, res, next) => {
  if (err) {
    let { status, message } = err;
    res.render("error.ejs", { status, message });
  }
});

server.listen(8080, () => {
  console.log("App is listening at port 8080");
});


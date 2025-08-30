
if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const express = require("express");
const ExpressErr = require("./utils/ExpressErr.js");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo"); 
const flash = require("connect-flash");
const listings =require("./routers/listings.js");
const reviews =require("./routers/reviews.js");
const userrouter =require("./routers/user.js");

const passport = require("passport");
const Localstrategy= require("passport-local");
const User = require("./models/user.js");

// let MongoURl = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl= process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


const store =MongoStore.create({
  mongoUrl : dbUrl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error" , (err)=>{
  console.log("ERROR in Mongo session store",err);
});

const sessionOptions={
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now()+7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly :true,
  }
};
app.use(session(sessionOptions)); //express session : use cookies to make the site sort of stateful
app.use(flash());//used to display some messages for a some milli second

app.use(passport.initialize())
app.use(passport.session())
passport.use(new Localstrategy(User.authenticate()));//user should be authenticate through  authenticate 
passport.serializeUser(User.serializeUser());//storing all the data of the user in session can be said as serilization
passport.deserializeUser(User.deserializeUser());  //unstoring all the data of the user from session can be said as deserilization



// app.get("/", (req, res) => {
//   res.send("hi i am root");
// });



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.Curruser = req.user;
  next(); 
})
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong!" } = err;
// console.error(err);
//   res.status(statusCode).render("error.ejs", { message });
// });

// app.get("/demouser", async (req,res)=>{
//   let Fakeuser = new User({
//     email: "student@gmail.com",
//     username: "sigma-user"
//   });
//   let registerUser = await User.register(Fakeuser,"helloworld");
//   res.send(registerUser);
// })


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)
app.use("/",userrouter)

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.all(/.*/, (req, res, next) => {
  next(new ExpressErr(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening at 8080");
});
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController =require("../controller/users.js")
// router.post("/signup", (req,res) => {
//     console.log("Raw signup route hit!");
//     res.send("ok");
//   });
router.route("/signup")
.get(userController.Rendersignupform)
.post(wrapasync(userController.signup))

router.route("/login")
.get(userController.renderloginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),userController.login)



router.get("/logout",userController.logout)
module.exports = router;
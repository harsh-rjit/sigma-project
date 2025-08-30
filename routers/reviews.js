const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn,isreviewauthor}= require("../middleware.js");

const reviewcontroller = require("../controller/review.js")


router.post(
    "/",isLoggedIn,validateReview,
    wrapAsync(reviewcontroller.CreateReview)
  );
  // Review Delete
  
  router.delete("/:reviewId",isLoggedIn,isreviewauthor,wrapAsync(reviewcontroller.DestroyReview))

  module.exports = router;
require("dotenv").config();

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validatelisting,
    wrapAsync(listingController.Createlistings)
  );
// .post(upload.single("listing[image][url]"),(req,res)=>{
//   res.send(req.file);
// })

router.get("/new", isLoggedIn, listingController.RendernewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.ShowListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validatelisting,
    wrapAsync(listingController.Updatelisting)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.Destroylisting));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.rendereditform)
);

module.exports = router;

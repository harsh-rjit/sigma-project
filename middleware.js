const Listing = require("C:/Users/Lenovo/OneDrive/backend/Major Project/models/listing.js");
const Review = require("./models/review.js");
const ExpressErr = require("./utils/ExpressErr.js");
const { listingschema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing")
       return res.redirect("/login")
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
       
         res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.Curruser._id)){
      req.flash("error","you are not the owner of this listing")
      return res.redirect(`/listings/${id}`);

    }

      next()

}

module.exports.validatelisting = (req, res, next) => {
    let {error} = listingschema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressErr(400, errmsg);
    } else {
      next();
    }
  };

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    if (error) {
      const errmsg = error.details.map(el => el.message).join(",");
      throw new ExpressErr(400, errmsg);
    } else {
      next();
    }
  };

  module.exports.isreviewauthor=async(req,res,next)=>{
    let { id,reviewId} = req.params;
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.Curruser._id)){
      req.flash("error","you are not the author of this listing")
      return res.redirect(`/listings/${id}`);

    }

      next()

}
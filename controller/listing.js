const Listing = require("../models/listing");


module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

  module.exports.RendernewForm = (req, res) => { 
    res.render("listings/new.ejs");
  };

  module.exports.ShowListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    if(!listing){
      req.flash("error","Listing not found");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }

  module.exports.Createlistings = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
   
    try {
      const defaultImageUrl =
        "https://images.unsplash.com/photo-1751837184233-b26fa8444e4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D";
  
      if (!req.body.listing.image) {
        req.body.listing.image = {};
      }
  
      if (
        !req.body.listing.image.url ||
        req.body.listing.image.url.trim() === ""
      ) {
        req.body.listing.image.url = defaultImageUrl;
      }
  
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url,filename};
      await newListing.save();
      req.flash("success","New listing created successfully");
      res.redirect("/listings");
    } catch (err) {
      next(err);
    }
  };

  module.exports.rendereditform = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing not found");
      return res.redirect("/listings");
    }
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,originalimageurl });
  })

  module.exports.Updatelisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   
    if(typeof req.file!== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
}


    req.flash("success","New listing updated");
    res.redirect(`/listings/${id}`);
  }
  module.exports.Destroylisting = async (req, res) => {
    let { id } = req.params;
    let deletelisting=  await Listing.findByIdAndDelete(id).populate("reviews");
    console.log(deletelisting);
    req.flash("success","listing Deleted successfully");
    res.redirect("/listings");
  }
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

listingSchema=new Schema({
       title:{
        type:String,
        required:true
       },
       description:String,
       image:{
       url:{
       type:String,
                default:"https://images.unsplash.com/photo-1751837184233-b26fa8444e4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D"
                     },
                     filename:String,
                     },
       price:Number,
       location:String,
       country:String,
       reviews:[
          {
               type: Schema.Types.ObjectId,
               ref: "Review",
          }
       ],
       owner:{
        type: Schema.Types.ObjectId,
        ref: "User", 
       }
       
     });

   listingSchema.post("findOneAndDelete", async(listing)=>{
     if(listing){
      await Review.deleteMany({ _id: {$in: listing.reviews}});
     }
   });

        const Listing=mongoose.model("Listing",listingSchema);
        module.exports=Listing;

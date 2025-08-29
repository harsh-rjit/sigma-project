const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing= require("C:/Users/Lenovo/OneDrive/backend/Major Project/models/listing.js");

let MongoURl = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
  console.log("Connected to db")
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MongoURl)
};
const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data =initData.data.map((obj)=>({...obj, owner: "6885e72277b031a9ec17eb5e",}));
    await Listing.insertMany(initData.data); //inserting data
    console.log("data was initialised")
};
initDB();
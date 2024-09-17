import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})

const connectDB=()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log("MongoDB Connected Successfully!!"))
    .catch((error)=>{
        console.log("MongoDB connection Failed!!")
        console.error(error);
        process.exit(1)
    })
}
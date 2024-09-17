import mongoose from "mongoose";

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:String,
        required:true
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        required:true,
    }
},{timestamps:true});

export const Profile=mongoose.model("Profile",profileSchema);
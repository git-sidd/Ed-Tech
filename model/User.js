import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date,
    },
    accountType:{
        type:String,
        enum:["Student","Admin","Instructor"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    image:{
        type:String,
        required:true,
    },
    courseProgress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress"
    }
},{timestamps:true});

export const User=mongoose.model("User",userSchema);
import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
    },
    courseDescription:{
        type:String,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatWillYouLearn:{
        type:String
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true,
    }],
    reviewAndRatings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ReviewAndRatings"
    }],
    price:{
        type:Number,
        
    },
    thumbnail:{
        type:String,
       
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

   
},{timestamps:true});

export const Course=mongoose.model("Course",courseSchema);
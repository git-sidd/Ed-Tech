import mongoose from "mongoose";

const subsectionSchema=new mongoose.Schema({
    title:{
        type:String,
        
    },
    timeDuration:{
        type:String,
       
    },
    description:{
        type:String,
        trim:true,
    },
    videoUrl:{
        type:String,
       
    }
},{timestamps:true});

export const SubSection=mongoose.model("SubSection",subsectionSchema);
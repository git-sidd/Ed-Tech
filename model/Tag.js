import mongoose from "mongoose";

const tagSchema=new mongoose.Schema({
    tagName:{
        type:String   
    },
    description:{
        type:String
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
},{timestamps:true});

export const Tag = mongoose.model("Tag",tagSchema);
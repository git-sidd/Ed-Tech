import {Category} from "../model/Category.js";

export const createTags=async(req,res)=>{
    try {
        //fetch data
        const {tagName,description}=req.body;
        //validate Data
        if(!tagName || !description){
            return res.status(403).json({
                success:false,
                message:"All fields are Required!!.."
            })
        }
        //create entry in db
        const category=await Category.create({
            tagName:tagName,
            description:description,
        })
        console.log("Category:",category)
        return  res.status(200).json({
            success:true,
            messsage:"Tags Created Successfully..!"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
  
export const showAllTags=async(req,res)=>{
    try {
        const allTags=await Category.find({},{
            tagName:true,
            description:true,
        })
        console.log("All TAGS:",allTags)
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
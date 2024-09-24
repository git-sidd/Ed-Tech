import {Course} from "../model/Course.js";
import { Category } from "../model/Category.js";
import {User} from "../model/User.js"
import  {uplaodImageToCloudinary} from "../utils/imageUploader.js"
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})


export const createCourse=async ()=>{
    try {
        //fetch Data..
        const {courseName,courseDescription,whatWillYouLearn,price,category,tag}=req.body;
        //fetch Thumbnail..
        const thumbnail=req.files.thumbnailImage;
        //validation..
        if(!courseName||!courseDescription||!whatWillYouLearn||!price||!category||!thumbnail ||!tag){
            return res.status(400).json({
                success:false,
                message:"All Fields are required.."
            })
        }
        //check for Instructor..
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        console.log("Instructor Details:",instructorDetails);
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Details Not Found.."
            })
        }
        //check given category is valid
        const categoryDetails=await Category.findById(category)
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"Category Details Not Found.."
            })
        }
        //uplaod image to cloudinary
        const thumbnailImage=await uplaodImageToCloudinary(thumbnailImage,process.env.FOLDER_NAME)

        //create an entry for new course
        const newCourse= await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatWillYouLearn,
            price,
            tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url

        })
        //add new course into User Schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )
        //update Category Schema..
        await Category.findByIdAndUpdate(
            {_id:categoryDetails._id},
            {
                $push:{
                    course:newCourse._id
                }
            },
            {new:true}
        )
        //return response 
        return res.status(200).json({
            success:true,
            message:"Course Created Successsfully..!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error In Creating Course....!"
        })
    }
}
import { SubSection } from "../model/SubSection.js"
import { Section } from "../model/Section.js"
import { uploadImageToCloudinary } from "../utils/imageUploader.js"
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})

export const createSubSection = async (req, res) => {

    try { //fetch data
        const { title, timeDuration, description } = req.body
        //fetch video
        const video = req.files.file
        //validation
        if (!title || !timeDuration || !description || !video) {
            return res.status(403).json({
                success: false,
                message: "All fileds are required"
            })
        }
        //upload video to cloudinary
        const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create subsection
        const uploadDetails = await SubSection.create({
            title,
            timeDuration,
            videoUrl: uploadVideo.secure_url,
            description
        })
        //update section 
        const updateSection = await Section.findByIdAndUpdate({ _id: uploadDetails._id },
            {
                $push: {
                    subSection: uploadDetails._id
                }
            },
            { new: true }
            //log updated section here,after adding populate query..
        )
        //return response
        return res.status(200).json({
            success: false,
            message: "SubSection Created successfully.. "
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to Create SubsSection.."
        })
    }
}
export const updateSubSection = async()=>{
    try {
        //fetch data
        const {subSectionId,title,timeDuration,description}=req.body
        //fetch video
        const newVideo=req.files.file
        //validation
        if(!subSectionId|| !title ||!timeDuration ||!description ||!newVideo){
            return res.status(403).json({
                success:false,
                message:"All fields Required.."
            })
        }
        //find by id and update
        await SubSection.findByIdAndUpdate(subSectionId,{
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:newVideo.secure_url,
        },
        {
            new:true
        })
        //todo update id in section while testing
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfullyt"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:"Error in updating SubSection"
        })
    }
}

export const deleteSubSection=async(req,res)=>{
    try {
        //fetch id from params
        const subSectionId=req.params
        //find by id and delete
        await SubSection.findByIdAndDelete(subSectionId);
        return res.status(200).json({
            success:true,
            message:"Subsection deleted Successfully.."
        })
        

    } catch (error) {
        return res.status(500).json({
            success:true,
            message:"Unable to delete subsection.."
        })
        
    }
}
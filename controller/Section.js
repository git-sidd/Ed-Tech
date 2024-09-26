import { Section } from "../model/Section.js";
import { Course } from "../model/Course.js";

export const createSection = async (req, res) => {
    try {
        //fetch data
        const { sectionName, courseId } = req.body;
        //validate Data
        if (!sectionName || !courseId) {
            return res.status(403).json({
                success: false,
                message: "All Fields Required..",
            });
        }
        //create section
        const newSection = await Section.create({ sectionName });
        //update id of section in Course.
        const updateCourse = await Course.findByIdAndUpdate(
            { courseId },
            {
                $push: {
                    courseContent: newSection._id,//here populate section and subsection in Course
                },
            },
            { new: true }
        ).populate({
            path:"courseContent",
            populate:{
                path:"Section"
            }
        });
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully..",
        });
    } catch (error) {
        console.log("Section Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating Section,Please Try Later..",
        });
    }
};

export const updateSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName,sectionId}=req.body

        //validate data
        if(!sectionId|| !sectionName){
            return res.status(403).json({
                success:false,
                message:"All fields Required.."
            })
        }
        //update data
        
        const updateData=await Section.findByIdAndUpdate({sectionId},
            {sectionName:sectionName},
            {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully.."
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update Section..Please try later.."
        })
    }
}
export const deleteSection=async (req,res)=>{
    try {
        //fetch data -assuming that we are fetching section id from query params
        const {sectionId}=req.params
        //use find by id and delete
        //TODO:(Testing):Deleting Section Id from course...
        await Section.findOneAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section ,please try later.."
        })
    }
}
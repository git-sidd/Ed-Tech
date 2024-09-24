import  {Profile} from "../model/Profile.js";
import {User} from "../model/User.js";

export const updateProfile = async (req,res)=>{
    try {
        //fetch data
        const {gender,dateOfBirth="",about="",contactNumber,}=req.body
        const id=req.user.id
        //validate
        if(!gender ||!id ||!contactNumber){
            return res.status(403).json({
                success:false,
                message:"All fields are required.."
            })
        }
        //get find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails._id;
        const profileDetails=await Profile.findById(profileId);

        //new way to store data in db

        profileDetails.gender=gender;
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.contactNumber=contactNumber

        await profileDetails.save();
        return res.status(200).json({
            success:true,
            profileDetails,
            message:"Profile created successfully.."
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in profile creation ",
            error:error.message,
        })
    }
}

//delete account
//explore how to schedule delete Account
export const deleteAccount=async(req,res)=>{
    try {
        //get id
        const id = req.user.id
        //validate id
        const userDetails=await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Not Found.."
            })
        }
        //detete profile
        const profileId=userDetails.additionalDetails;
        const deleteProfile=await Profile.findByIdAndDelete(profileId);
        //delete user
        const deleteUser=await User.findByIdAndDelete(id);
        //return response
        return res.status(200).json({
            success:true ,
            message:"User Account deleted Successfully.."
        })
    } catch (error) {
        return res.status(500).json({
            success:false ,
            message:"Unable to Delete User Account"
        })
    }
}

export const getAllUserDetails=async(req,res)=>{
    try {
        //get user
        const id=req.user.id;
        //validate
        const userDetails=await User.findById({_id:id}).populate("additionalDetails").exec()
       
        //return response
        return res.status(200).json({
            success:true,
            message:"User details found:",
            userDetails,
        })   
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in Finding User"
        })   
         
    }
}
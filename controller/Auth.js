import otpGenerator from "otp-generator";
import {OTP} from "../model/OTP.js";
import {User} from "../model/User.js";
import bcrypt, { compare } from "bcrypt";
import {Profile} from "Profile.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import mailSender from "../utils/mailSender.js";

dotenv.config({
    path:"./.env"
})


//send otp
export const SendOTP=async(req,res)=>{
    try {
        //fetch email
    const {email}=req.body

    //check if its already in db

    const existedUser=await User.findOne({email})

    if(existedUser){
        return res.status(400).json({
            success:false,
            message:"User Already Existed !!"
        })
    }

    var otp=otpGenerator.generate(4,{
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })
    console.log("otp:",otp)
    const result=await OTP.findOne({otp:otp})

    while(result){
        otp=otpGenerator(4,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        })
        result=await OTP.findOne({otp:otp})
    }

    const otpPayLoad={email,otp}

    const otpBody= await OTP.create(otpPayLoad)

    res.status(200).json({
        success:true,
        message:"OTP Sent Successfully!!"
    })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Error in Sending Otp"
        })
    }
}


//signup
export const SignUp=async(req,res)=>{
   try {
     //data fetch from request ki body
     const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber}=req.body
     //validate karlo
     if(!firstName || !!lastName || !email ||!password || !confirmPassword || !otp){
         return res.status(400).json({
             success:false,
             message:"every field is required"
         })
     }
     //match password and confirm password
     if(password!==confirmPassword){
         return res.status(403).json({
             success:false,
             message:"password not matches to confirm password"
         })
     }
     //check user already exists or not
     const userExists=await User.findOne({email})
     if(userExists){
         return res.status(400).json({
             success:false,
             message:"User Already Exists.."
         })
     }
     //find most recent otp stored for the user
     const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
     console.log("recentOtp:",recentOtp)
     if(recentOtp.length == 0){
         return res.status(400).json({
             success:false,
             message:"OTP not found.."
         })
     }else if(otp !== recentOtp.otp){
     //validate otp
         return res.status(400).json({
             success:false,
             message:"OTP Doesn't matches.."
         })
     }
     //hash password
     const hashPassword=await bcrypt.hash(password,10);
 
     //create entry in db
    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    }) 

    const user=await User.create({
        firstName,
        lastName,
        email,
        password:hashPassword,
        contactNumber,
        accountType,
        additionalDetails:profileDetails._id,
        image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`


    })
    res.status(200).json({
        success:true,
        message:"User Registered Successfully.."
    })
   } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error in Registering User.."
        })
   }




}

//login

export const Login=async(req,res)=>{
    try {
        //data fetch from request ki body
        const {email,password}=req.body

        //validate Karlo
        if(!email ||!password){
            return res.status(403).json({
                success:false,
                message:"All fields Required.."

            })
        }
        //check user already exists or not

        const registeredUser=await User.findOne({email}).populate("additionalDetails")

        if(!registeredUser){
            return res.status(400).json({
                success:false,
                message:"User Not registered.."
            })
        }

        //generate jwt token after password matching
        if(await bcrypt.compare(password,registeredUser.password)){
            const payload={
                email:registeredUser.email,
                id:registeredUser._id,
                accountType:registeredUser.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            registeredUser.token=token
            registeredUser.password=undefined

            const options={
                expiresIn:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true
            }
            //create cookie and send response
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                message:"User Logged In Successfully.."
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect"
            })
        }

      

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"LoggedIN Failed ,Please Try Later"
        })
    }
}
//change password
export const changePassword=async(req,res)=>{

   try {
     //get data from req body
    //get oldPassword ,newPassword ,confirmnew password 
    const {oldPassword,newPasword,confirmNewPassword}=req.body


    //validate data
    if(!oldPassword||!newPasword||!confirmNewPassword){
        return res.status(403).json({
            success:false,
            message:"All fields are required.."
        })
    }
    if(newPasword!==confirmNewPassword){
        return res.status(403).json({
            success:false,
            message:"New-password not matches with Confirm New-password"
        })
    }
    //update password in db
    const userId=req.user.id

    const user=await User.findOne(userId)

    const isMatch=await bcrypt.compare(oldPassword,user.password)
    if(!isMatch){
        req.status(400).json({
            success:false,
            message:"Old password Doesn't matches.."
        })
    }
    console.log("oldPassword:",password)
    const hashNewPassword=await bcrypt.hash(newPasword,10)

    user.password=hashNewPassword;
    console.log("UpdatedPassword:",password)

    await user.save();
    
        //send mail - password updated 
    const sendMail=await mailSender(user.email,"Password Changed","Your password Changed Successfully")
    console.log(sendMail)

    res.status(200).json({
        success:true,
        message:"password changed successfully.. "
    })

    //return response

   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"something wents wrong while changing password try later.."
    })
    
   }
}
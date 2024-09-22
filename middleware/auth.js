import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})

//auth
export const auth=async(req,res,next)=>{
    try {
        const token=req.cookies.token 
        || req.body.token 
        || req.header("Authorisation").replace("Bearer ","")

        //if token is missing 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing.."
            })
        }

        try {
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            console.log("Decode:",decode)
            req.user=decode;

        } catch (error) {
            //verification -issue
            return res.status(401).json({
                success:false,
                message:"Invalid Token.."
            })
        }
        next();



    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something wents Wrong while validating token.."
        })
    }
}
//isStudent

export const isStudent=(req,res,next)=>{
    try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Students"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in verifyning role ,Please try later"
        })
    }
}

//isInstructor

export const isInstructor=(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Instructor"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in verifyning role ,Please try later"
        })
    }
}
//isAdmin
export const isAdmin=(req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Admin"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in verifyning role ,Please try later"
        })
    }
}
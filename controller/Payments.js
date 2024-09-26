import {instance} from "../config/razorpay.js"
import { User } from "../model/User.js"
import { Course } from "../model/Course.js"
import { mailSender } from "../utils/mailSender.js";
import mongoose from "mongoose";


export const capturePayment= async(req,res)=>{
    //get userid and courseid
    const {courseId}=req.body;

    const userId=req.user.id;

    //validate
    if(!courseId){
        return res.status(403).json({
            success:false,
            message:"Provide valid Course Id.."
        })
    }
    
    //checking whether user already enrolled for the course;
    let course;
    try {
        
         course = await Course.findById(courseId);
        if(!course){
            return res.status(403).json({
                success:false,
                message:"Course not found.."
            })
        }

        //check user already pay for the course;
        //here userId is string inorder to convert into objectId;
        const uid= mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"User Already Enrolled"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    //order create

    const amount=course.price;
    const currency="INR";

    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now().toString()),
        notes:{
            courseId:courseId,
            userId
        }
    }

    try {
        const paymentResponse=instance.orders.create(options)
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            Thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in Creating Order..,Try Later.."
        })
    }
}

//verify Signature of Razorpay and Server

export const verifysignature=async (req,res)=>{
    const webHookSecret="12345678";

    const Signature=req.header["x-razorpay-signature"];

    //creating hashing fuction to store the signature
    //Hmac requires 1.hashing algorithm 2.websecret

    const shasum= crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body))
    const digest=shasum.digest("hex");

    if(Signature===digest){
        console.log("Payment Is Authorized..")
   
    const {userId,courseId}=req.body.payload.payment.entity.notes

    try {
    //fullfill action

    //find the course and enrolled the student in it

    const enrolledCourse=await User.findByIdAndUpdate({_id:userId},
        {   
            $push:{
                courses:courseId,
            }
        },
        {new:true}
    )
    console.log("enrolledCourse:",enrolledCourse)
    if(!enrolledCourse){
        return res.status(500).json({
            success:false,
            message:"Unable to Enrolled in course try later.."
        })
    }
    const enrolledStudent= await Course.findByIdAndUpdate({_id:userId},
        {
            $push:{
                studentEnrolled:userId
            }
        },
        {new:true}
    )
    console.log("enrolledStudent:",enrolledStudent)
    if(!enrolledStudent){
        return res.status(500).json({
            success:false,
            message:"Unable to Enrolled Student try later.."
        })
    }
    const emailResponse= await mailSender(enrolledStudent.email,"Congratulations from Ed-Tech","You Have Successfully Enrolled for the Course...")
    console.log(emailResponse);
    return res.status(200).json({
        success:true,
        message:"Verified Signature and Course Added..",
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to verify Signature and Course Adding..please try later..",
        })
    }
}
else{
    return res.status(400).json({
        success:false,
        message:"Invalid Request.."
    })
}


}

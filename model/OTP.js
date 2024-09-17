import mongoose from "mongoose";
import mailSender from "../utils/mailSender";

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
        
    }
},{timestamps:true});

async function sendVerficationMail(email,otp){
   try {
    let response=await mailSender(email,"Verification Mail by Kartavya Stuidies",otp)
    console.log("Response:",response)
   } catch (error) {
    console.log("Error while sending verification mail:",error)
   }
}

OTPSchema.pre("save",async function (next) {
    await sendVerficationMail(this.email,this.otp);
    next();
})

export const OTP = mongoose.model("OTP",OTPSchema);
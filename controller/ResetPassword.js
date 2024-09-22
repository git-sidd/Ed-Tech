import { User } from "../model/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcrypt";
//resetpassword token
export const resetpasswordToken=async(req,res)=>{
    try {
                //get email from req.body
            const email=req.body.email
            //email validation
            const user= await User.findOne({email:email})
            if(!user){
                return res.json({
                    success:false,
                    message:"This Email is not registered with us.."
                })
            }
            //generate token
            const token= crypto.randomUUID();

            //update User by adding token and expiration time
            const updateDetails=await User.findOneAndUpdate(
                {email:email},
                {
                    token:token,
                    resetPasswordExpires:Date.now()+5*60.1000,
                },
                {
                    new:true
                }
            );
            //create URL of frontend
            const url=`http://localhost:3000/update-password/${token}`

            //send mail containing the reset password url

            await mailSender(email,"Reset Password Link",`Reset Password URL:${url}`)
            return res.json({
                success:true,
                message:"Email Sent Successfully,Please Check Email and Change Password"
            })
    } catch (error) {
        console.log("Reset Password Token Error:",error)
        return res.status(500).json({
            success:false,
            message:"Error While generating Token"
        })
    }
}



//reset password

export const resetPassword = async()=>{
    try {
        //fetch data ,we get token in body because request is send from frontend and frontend sends the response in the req.body 
        const {password ,confirmPassword,token}=req.body

        //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matched.."
            });

        }
        //get user details from db using token

        const userDetails=await User.findOne({token:token});
        //if no entry -invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is Invalid.."
            })
        }
        //token time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token is Expired,please regenerate your token.."
            });
        }
        //hash password
        const hashPassword=await bcrypt.hash(password,10);

        //password update

        await User.findOneAndUpdate(
            {token:token},
            {password:hashPassword},
            {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"password reset successfully.."
        })
    } catch (error) {
        console.log("reset password error:",error)
        return res.status(500).json({
            success:false,
            message:"Something Wents Wrong While sending reset owd mail.."
        })
    }
}


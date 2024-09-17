import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})
const mailSender=async(email,title,body)=>{
    try {
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })
        let info= await transporter.sendMail({
            from:'KARTAVYA STUDIES -by SPRP',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log("info:",info)
    } catch (error) {
        console.log("Error in mail sender:",error.message)
    }
}
export default mailSender;
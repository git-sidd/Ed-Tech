import {v2 as cloudinary} from "cloudinary";


export const uploadImageToCloudinary=async(path,folder,height,quality)=>{
    try {
        const options={folder};
        if(height){
            options.height=height;
        }
        if(quality){
            options.quality=quality;
        }
        options.resource_type="auto";

        return await cloudinary.uploader.upload(file.tempFilePath,options)
    } catch (error) {
        
    }
}
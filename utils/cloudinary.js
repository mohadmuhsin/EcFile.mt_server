const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLD_NAME,
    api_key: process.env.CLD_KEY,
    api_secret: process.env.CLD_SCRT,
  });

  
const uploadToCloudinaryImage = async (path, folder) => {
    try {
      
        const transformationParams = {
            width: 640, 
            height: 480,
            quality: "auto:low", 
            fetch_format: "auto",
        };

        const data = await cloudinary.v2.uploader.upload(path, {
            folder,
            transformation: transformationParams,
        });

        const secureUrl = data.secure_url;
        return { url: secureUrl, public_id: data.public_id };
    } catch (error) {
        console.log(error);
    }
};



module.exports = { 
    uploadToCloudinaryImage,
}
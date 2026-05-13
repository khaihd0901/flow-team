import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image or video
export const uploadMedia = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "flowteam",
    });

    return {
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete image or video
export const deleteMedia = async (
  public_id,
  resource_type = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default cloudinary;
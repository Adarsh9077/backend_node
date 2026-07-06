import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { loadEnvFile } from "process";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!loadEnvFile) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File was uploaded on cloudinary");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteOnCloudinary = async (publicUrl) => {
  try {
    if (!publicUrl || typeof publicUrl !== "string") {
      return null;
    }
    const result = await cloudinary.uploader.destroy(publicUrl);
    console.log(`Deleted: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error("Error deleting single asset:", err.message);
    throw error;
  }
};

export { uploadOnCloudinary };

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

// const deleteOnCloudinary = async (publicUrl) => {
//   try {
//     if (!publicUrl || typeof publicUrl !== "string") {
//       return null;
//     }
//     const result = await cloudinary.uploader.destroy(publicUrl);
//     console.log(`Deleted: ${publicId}`, result);
//     return result;
//   } catch (error) {
//     console.error("Error deleting single asset:", err.message);
//     throw error;
//   }
// };

const deleteOnCloudinary = async (publicUrl) => {
  try {
    if (!publicUrl || typeof publicUrl !== "string") {
      return { success: false, message: "Invalid URL" };
    }

    // Extract public ID from URL
    // URL: http://res.cloudinary.com/dljypvori/video/upload/v1785384160/iggmbtnzlcgr9y2nypjd.mp4
    // Public ID: iggmbtnzlcgr9y2nypjd
    const publicId = extractPublicId(publicUrl);

    const isVideo = publicUrl.includes("/video/upload/");

    if (!publicId) {
      return { success: false, message: "Could not extract public ID" };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? "video" : "image",
    });
    console.log(`Deletion result for ${publicId}:`, result);

    // Cloudinary returns: { result: 'ok' } or { result: 'not found' }
    if (result.result === "ok") {
      return { success: true, message: "Deleted successfully", result };
    } else if (result.result === "not found") {
      // File already deleted - this is NOT an error
      return { success: true, message: "File already deleted", result };
    } else {
      return {
        success: false,
        message: `Deletion failed: ${result.result}`,
        result,
      };
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error.message);
    return { success: false, message: error.message, error };
  }
};

// Helper: Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  try {
    // For video: http://res.cloudinary.com/dljypvori/video/upload/v1785384160/iggmbtnzlcgr9y2nypjd.mp4
    // For image: http://res.cloudinary.com/dljypvori/image/upload/v1785384167/yui8qunysevqdryajxhx.jpg

    // Remove the upload prefix and version
    const parts = url.split("/");
    // Find the index of 'upload' or 'video/upload' or 'image/upload'
    const uploadIndex = parts.findIndex((part) => part.includes("upload"));

    if (uploadIndex === -1) return null;

    // Get the filename (last part)
    let fileName = parts[parts.length - 1];
    // Remove file extension
    fileName = fileName.split(".")[0];

    // Sometimes Cloudinary has a version number, skip it
    // URL pattern: .../upload/v1234567890/public_id.mp4
    // Or: .../upload/public_id.mp4

    // Find the public ID (it's the part after the last upload path)
    // For simplicity, just return the filename without extension
    return fileName;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };

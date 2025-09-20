// utils/cloudinaryUpload.js
import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = (fileBuffer, folder = "employees") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

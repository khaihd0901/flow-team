// src/middlewares/mediaMiddleware.js

import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../Configs/cloudinaryConfig.js";

// TEMP storage before uploading to cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/mov",
    "video/quicktime",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

// MULTER INSTANCE
export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB
  },
  fileFilter,
});

// CLOUDINARY SINGLE FILE UPLOAD
export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "auto",
        folder: "flowteam",
      }
    );

    // SAVE CLOUDINARY DATA
    req.cloudinaryFile = {
      url: result.secure_url,
      public_id: result.public_id,
      asset_id: result.asset_id,
      resource_type: result.resource_type,
    };

    // DELETE LOCAL FILE
    fs.unlinkSync(req.file.path);

    next();
  } catch (error) {
    next(error);
  }
};

// CLOUDINARY MULTIPLE FILES UPLOAD
export const uploadMultipleToCloudinary = async (
  req,
  res,
  next
) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        file.path,
        {
          resource_type: "auto",
          folder: "flowteam",
        }
      );

      uploadedFiles.push({
        url: result.secure_url,
        public_id: result.public_id,
        asset_id: result.asset_id,
        resource_type: result.resource_type,
      });

      fs.unlinkSync(file.path);
    }

    req.cloudinaryFiles = uploadedFiles;

    next();
  } catch (error) {
    next(error);
  }
};
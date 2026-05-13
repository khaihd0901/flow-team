// src/routes/upload.routes.js

import express from "express";
import {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} from "../middlewares/mediaMiddleware.js";
import { protectedRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// SINGLE FILE
router.post(
  "/single",
  upload.single("file"),
  uploadToCloudinary,
  (req, res) => {
    res.status(200).json({
      success: true,
      file: req.cloudinaryFile,
    });
  },
  protectedRoute
);

// MULTIPLE FILES
router.post(
  "/multiple",
  upload.array("files", 10),
  uploadMultipleToCloudinary,
  (req, res) => {
    res.status(200).json({
      success: true,
      files: req.cloudinaryFiles,
    });
  },
  protectedRoute
);

export default router;
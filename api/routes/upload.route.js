import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const upload = multer({ storage });
const router = express.Router();

router.post("/avatar", upload.single("image"), (req, res) => {
  try {
    return res.status(200).json({ url: req.file.path }); // Cloudinary URL
  } catch (err) {
    return res.status(500).json({ message: "Upload failed" });
  }
});

export default router;

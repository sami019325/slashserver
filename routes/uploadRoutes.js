import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Memory storage for multer - we'll forward the buffer to ImgBB
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ImgBB API Details
const IMGBB_API_KEY = process.env.Image_DB_API_Key || "8ea89743b0765137a823614c705f3501";
const IMGBB_URL = "https://api.imgbb.com/1/upload";

/**
 * @route POST /api/upload
 * @desc Upload image to ImgBB via proxy
 */
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Convert buffer to base64 as ImgBB expects simple base64 or multipart
        const formData = new FormData();
        formData.append("image", req.file.buffer.toString("base64"));

        console.log("Forwarding image to ImgBB...");

        const response = await axios.post(`${IMGBB_URL}?key=${IMGBB_API_KEY}`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        if (response.data && response.data.success) {
            console.log("✅ Image uploaded successfully:", response.data.data.url);
            return res.json({
                success: true,
                url: response.data.data.url,
                display_url: response.data.data.display_url,
                thumb: response.data.data.thumb?.url
            });
        } else {
            console.error("❌ ImgBB upload failed:", response.data);
            return res.status(500).json({ error: "Failed to upload image to hosting service" });
        }
    } catch (error) {
        console.error("❌ Image upload error:", error.message);
        res.status(500).json({ error: "Internal server error during upload" });
    }
});

export default router;

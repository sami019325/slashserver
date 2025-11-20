import express from "express";
import multer from "multer";
import { Card } from "../models/card.js";
import { isAdmin } from "./adminRoutes.js";
import dotenv from "dotenv";
import axios from "axios"; // ✅ Added axios import

dotenv.config();

const router = express.Router();

// Multer storage (store file in memory)
const upload = multer({ storage: multer.memoryStorage() });

// ===================================
// ✅ GET ROUTES (Sorted for correct routing)
// ===================================

// GET all
router.get("/", async (req, res) => {
    try {
        const products = await Card.find().sort({ _id: -1 }); // Newest first
        res.json(products);
    } catch (error) {
        console.error("Error fetching all cards:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// GET all products with pagination
router.get("/limit", async (req, res) => {
    try {
        // Parse query params or set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch products with pagination and sort by newest first
        const products = await Card.find().skip(skip).limit(limit).sort({ _id: -1 });

        // Count total for frontend pagination controls
        const total = await Card.countDocuments();

        res.json({
            products,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        console.error("Error fetching paginated cards:", err);
        res.status(500).json({ error: "Server error while fetching cards" });
    }
});

// GET product by name (MUST COME BEFORE /:id)
router.get("/name/:name", async (req, res) => {
    try {
        const name = req.params.name.trim();
        // Search by name, case-insensitive, and sort by newest first
        const products = await Card.find({ name: { $regex: name, $options: "i" } }).sort({ _id: -1 });

        res.json(products);
    } catch (error) {
        console.error("Error fetching card by name:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET product by category (MUST COME BEFORE /:id)
router.get("/ctgry/:ctgry", async (req, res) => {
    try {
        const ctgry = req.params.ctgry.trim();
        // Search by category, case-insensitive, and sort by newest first
        const Category = await Card.find({ category: { $regex: ctgry, $options: "i" } }).sort({ _id: -1 });

        res.json(Category);
    } catch (error) {
        console.error("Error fetching Category by name:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET one by ID (MUST COME LAST to avoid conflicts)
router.get("/:id", async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.json(card);
    } catch (error) {
        console.error("Error fetching card by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ===================================
// ✅ POST / PUT / DELETE ROUTES
// ===================================

// CREATE card (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);

        let imgUrl = null;

        if (req.file) {
            const base64Image = req.file.buffer.toString("base64");
            imgUrl = await uploadImageToImgBB(base64Image);
        }

        const tempCard = {
            img1: imgUrl,
            name: req.body.name,
            category: req.body.category,
            price: null,
            details1: req.body.note,
            details2: "No details provided.",
            details3: "No details provided.",
            C_Number: req.body.phone,
            C_Location: req.body.location,
            available: "available",
            Search: `${req.body.name} ${req.body.note} ${req.body.location}`,
            reply: [],
        };

        const newCard = new Card(tempCard);

        await newCard.save();
        console.log("New card created:", newCard);
        res.status(201).json(newCard);

    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// UPDATE card by ID (Protected by isAdmin)
router.put("/:id", isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;

        // Find existing card
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Handle Image Update
        let imgUrl = card.img1; // Keep existing image by default
        if (req.file) {
            const base64Image = req.file.buffer.toString("base64");
            imgUrl = await uploadImageToImgBB(base64Image);
        }

        // Update fields (use existing values if not provided in body)
        card.name = req.body.name || card.name;
        card.category = req.body.category || card.category;
        card.details1 = req.body.note || card.details1;
        card.C_Number = req.body.phone || card.C_Number;
        card.C_Location = req.body.location || card.C_Location;
        card.img1 = imgUrl;

        // Rebuild the Search string to keep it in sync with data changes
        card.Search = `${card.name} ${card.details1} ${card.C_Location}`;

        const updatedCard = await card.save();
        res.json(updatedCard);

    } catch (error) {
        console.error("Error updating card:", error);
        res.status(500).json({ error: "Server error during update" });
    }
});

// DELETE card by ID (Protected by isAdmin)
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await Card.findByIdAndDelete(id);

        if (!deletedCard) {
            return res.status(404).json({ message: "Card not found" });
        }

        res.json({ message: "Card deleted successfully", id });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ error: "Server error during deletion" });
    }
});


// ===================================
// ✅ HELPER FUNCTIONS (Now uses Axios for robustness)
// ===================================

// Function to upload image to ImgBB
async function uploadImageToImgBB(base64Image) {
    const apiKey = process.env.Image_DB_API_Key;
    const url = `https://api.imgbb.com/1/upload`;

    // Axios prefers URL parameters or form data for uploads. 
    // We can use a direct GET-style parameter for the base64 image along with the API key.

    // Create URLSearchParams for a robust body payload
    const formData = new URLSearchParams();
    formData.append("image", base64Image);


    try {
        // Use axios post for reliability, sending the base64 string directly
        const response = await axios.post(
            `${url}?key=${apiKey}`, // Pass the API key as a query param
            formData
        );

        // Axios uses .data property for the response body
        if (response.data && response.data.data && response.data.data.url) {
            return response.data.data.url;
        } else {
            console.error("ImgBB Response Missing URL:", response.data);
            throw new Error("Image upload failed: Invalid response structure from ImgBB");
        }
    } catch (e) {
        // Axios error handling often provides a response property for server errors
        const errorDetails = e.response ? JSON.stringify(e.response.data) : e.message;
        console.error("Image upload function failed (Axios):", errorDetails);
        throw new Error("Image upload failed: ImgBB connection or API error.");
    }
}

export default router;
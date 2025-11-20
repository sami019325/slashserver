import express from "express";
import multer from "multer";
import { Card } from "../models/card.js";
import { isAdmin } from "./adminRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Multer storage (store file in memory)
const upload = multer({ storage: multer.memoryStorage() });





// GET all
router.get("/", async (req, res) => {
    const products = await Card.find(); res.json(products);
});
// GET all products with pagination // ✅ Get paginated products
router.get("/limit", async (req, res) => {
    try {
        // Parse query params or set defaults
        const page = parseInt(req.query.page) || 1; const limit = parseInt(req.query.limit) || 10; const skip = (page - 1) * limit;
        // Fetch products with pagination
        const products = await Card.find().skip(skip).limit(limit).sort({ _id: -1 });
        // newest first // Count total for frontend pagination controls
        const total = await Card.countDocuments();
        res.json({ products, page, totalPages: Math.ceil(total / limit), total, });
    }
    catch (err) {
        console.error("Error fetching paginated products:", err);
        res.status(500).json({ error: "Server error while fetching products" });
    }
});
// GET product by name
router.get("/name/:name", async (req, res) => {
    try {
        const name = req.params.name.trim();
        const product = await Card.find({ name: { $regex: name, $options: "i" } });
        if (!product) {
            return res.status(404).json({ message: "Card not found" });
        } res.json(product);
    } catch (error) {
        console.error("Error fetching product by name:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// GET product by category
router.get("/ctgry/:ctgry", async (req, res) => {
    try {
        const ctgry = req.params.ctgry.trim();
        const Category = await Card.find({ category: { $regex: ctgry, $options: "i" } });
        if (!Category) { return res.status(404).json({ message: "Card not found" }); }
        res.json(Category);
    } catch (error) { console.error("Error fetching Category by name:", error); res.status(500).json({ message: "Server error" }); }
});
// GET one
router.get("/:id", async (req, res) => {
    const products = await Card.findById(req.params.id);
    res.json(products);
});





// CREATE card (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);

        // 1. Default imgUrl to null
        let imgUrl = null;

        // 2. Only process image if the file exists
        if (req.file) {
            // Convert image to Base64
            const base64Image = req.file.buffer.toString("base64");

            // Upload to ImgBB
            imgUrl = await uploadImageToImgBB(base64Image);
        }

        // 3. imgUrl is now either a valid link OR null
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
        console.log(newCard);
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


// Function to upload image to ImgBB
async function uploadImageToImgBB(base64Image) {
    const apiKey = process.env.Image_DB_API_Key;

    const formData = new URLSearchParams();
    formData.append("image", base64Image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const json = await res.json();
    return json.data.url;
}

export default router;

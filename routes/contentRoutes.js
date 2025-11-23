import express from "express";
import { ContentBlock } from "../models/ContentBlock.js";
import { isAdmin } from "./adminRoutes.js";

const router = express.Router();

// GET all content blocks
router.get("/", async (req, res) => {
    const blocks = await ContentBlock.find();
    res.json(blocks);
});



// CREATE content block
router.post("/", async (req, res) => {
    try {
        const { img, heading, subHeading, details, productId } = req.body;

        console.log("📥 Incoming content data:", req.body);

        // Default values if missing
        const newContent = new ContentBlock({
            img: img || "https://default-image-link.com/default.jpg",
            heading: heading || "Untitled",
            subHeading: subHeading || "Untitled Subheading",
            details: details || "No details provided.",
            productId: productId || null
        });

        const saved = await newContent.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("❌ Error creating content:", err);
        res.status(500).json({ message: "Server error while adding content" });
    }
});


// get by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    // 1. Check if the ID parameter exists in the request
    if (!id) {
        return res.status(400).json({
            message: "Missing ID parameter in the request URL."
        });
    }

    // basic check for a 24-char hex string (Mongoose handles the full validation, 
    // but this prevents reaching Mongoose if the ID is clearly invalid, like 'abc')
    // This uses a regular expression to check for 24 hexadecimal characters.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: "Invalid ID format."
        });
    }

    try {
        const blocks = await ContentBlock.findById(id);

        // 2. Check if a block was found
        if (!blocks) {
            return res.status(404).json({
                message: "Content block not found."
            });
        }

        res.json(blocks);
    } catch (error) {
        // This catch block handles the CastError if it somehow still occurs, 
        // or other database errors.
        console.error("Database error:", error);
        res.status(500).json({
            message: "Server error while fetching content block.",
            error: error.message
        });
    }
});

// 🔍 SEARCH by subHeading (partial match)
router.get("/search/subheading", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: "Query 'q' is required" });
        }

        const results = await ContentBlock.find({
            search_Key: { $regex: q, $options: "i" } // partial, case-insensitive
        });

        res.json(results);
    } catch (err) {
        console.error("❌ Error searching subHeading:", err);
        res.status(500).json({ message: "Server error while searching" });
    }
});



// UPDATE
router.put("/:id", isAdmin, async (req, res) => {
    const updated = await ContentBlock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// DELETE
router.delete("/:id", isAdmin, async (req, res) => {
    await ContentBlock.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

export default router;

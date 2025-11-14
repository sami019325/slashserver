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
            productId: productId || 'null'
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
    const blocks = await ContentBlock.findById(req.params.id);
    res.json(blocks);
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

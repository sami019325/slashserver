import express from "express";
import { pageItem } from "../models/pageItem.js";
import { isAdmin } from "./adminRoutes.js";

const router = express.Router();

// GET all content blocks
router.get("/", async (req, res) => {
    const blocks = await pageItem.find();
    res.json(blocks);
});


// ✅ Get paginated content
router.get("/limit", async (req, res) => {
    try {
        // Parse query params or set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await pageItem.find()
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 }); // newest first

        // Count total for frontend pagination controls
        const total = await pageItem.countDocuments();
        res.json({
            products,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        console.error("Error fetching paginated products:", err);
        res.status(500).json({ error: "Server error while fetching products" });
    }
});


// ✅ Search content by heading
router.get("/search/:search", async (req, res) => {
    try {
        const search = req.params.search.trim();
        const product = await pageItem.findOne({ search: search });

        if (!product) {
            return res.status(404).json({ message: "pageItem not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product by search:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// GET content by ID
router.get("/:id", async (req, res) => {
    const blocks = await pageItem.findById(req.params.id);
    res.json(blocks);
});



// CREATE
router.post("/", isAdmin, async (req, res) => {
    const block = new pageItem(req.body);
    await block.save();
    res.status(201).json(block);
});

// UPDATE
router.put("/:id", isAdmin, async (req, res) => {
    const updated = await pageItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// DELETE
router.delete("/:id", isAdmin, async (req, res) => {
    await pageItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

export default router;

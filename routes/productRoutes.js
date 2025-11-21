import express from "express";
import { Product } from "../models/Product.js";
import { isAdmin } from "./adminRoutes.js";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});


// GET all products with pagination
// ✅ Get paginated products
router.get("/limit", async (req, res) => {
    try {
        // Parse query params or set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 }); // newest first

        // Count total for frontend pagination controls
        const total = await Product.countDocuments();
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




// GET product by name
router.get("/name/:name", async (req, res) => {
    try {
        const name = req.params.name.trim();
        const product = await Product.find({ name: { $regex: name, $options: "i" } });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product by name:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// GET product by category
router.get("/ctgry/:ctgry", async (req, res) => {
    try {
        const ctgry = req.params.ctgry.trim();
        const Category = await Product.find({ category: ctgry });

        if (!Category) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(Category);
    } catch (error) {
        console.error("Error fetching Category by name:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET one
router.get("/:id", async (req, res) => {
    const products = await Product.findById(req.params.id);
    res.json(products);
});

// CREATE
router.post("/", isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        console.log(newProduct); // Keep console.log if you like
        res.status(201).json(newProduct); // Correct response
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
});

// UPDATE
router.put("/:id", isAdmin, async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// DELETE
router.delete("/:id", isAdmin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
});



export default router;

import express from "express";
import { Product } from "../models/Product.js";
import { OrderData } from "../models/orderdb.js";
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
// GET product by category with advanced filtering
router.get("/ctgry/:ctgry", async (req, res) => {
    try {
        const ctgry = req.params.ctgry.trim();
        let query = { category: ctgry };

        // Advanced Filtering Logic (Query Params)
        const { type, blend, origin, grind } = req.query;

        // 1. Filter by Type (e.g., "Whole Bean", "Ground Bean")
        // Checks name or details since specific field might not exist
        if (type && type !== 'undefined' && type !== 'null') {
            query.$or = [
                { name: { $regex: type, $options: "i" } },
                { details1: { $regex: type, $options: "i" } }
            ];
        }

        // 2. Filter by Blend (e.g., "Premium Blend")
        if (blend && blend !== 'undefined' && blend !== 'null') {
            // Create a new $and condition if $or already exists, or merge
            // For simplicity, we'll iterate and add to an $and array if multiple complex conditions
            if (!query.$and) query.$and = [];
            query.$and.push({
                $or: [
                    { name: { $regex: blend, $options: "i" } },
                    { details1: { $regex: blend, $options: "i" } }
                ]
            });
        }

        // 3. Filter by Origin (e.g., "Brazil", "Colombia")
        if (origin && origin !== 'undefined' && origin !== 'null') {
            const originKey = origin.split(' ')[0]; // Extract "Brazil" from "Brazil (Arabica)"
            if (!query.$and) query.$and = [];
            query.$and.push({
                $or: [
                    { name: { $regex: originKey, $options: "i" } },
                    { menufactured_country: { $regex: originKey, $options: "i" } },
                    { details1: { $regex: originKey, $options: "i" } }
                ]
            });
        }

        // 4. Filter by Grind (e.g., "Espresso", "Moka Pot")
        if (grind && grind !== 'undefined' && grind !== 'null') {
            if (!query.$and) query.$and = [];
            query.$and.push({
                $or: [
                    { name: { $regex: grind, $options: "i" } },
                    { details1: { $regex: grind, $options: "i" } }
                ]
            });
        }

        // Clean up empty $and if it wasn't used
        if (query.$and && query.$and.length === 0) delete query.$and;

        console.log("Filtered Query:", JSON.stringify(query)); // Debug

        const products = await Product.find(query);

        if (!products || products.length === 0) {
            // Return empty array instead of 404 to handle "no results found" gracefully on frontend
            return res.status(200).json([]);
        }
        res.json(products);
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

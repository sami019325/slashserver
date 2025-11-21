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



// =============================
// ✅ ORDER MANAGEMENT ROUTES
// =============================

// GET all orders
router.get("/orders", async (req, res) => {
    try {
        const orders = await OrderData.find().sort({ tran_date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});

// UPDATE order
router.put("/orders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { Status, Order_note } = req.body;

        const order = await OrderData.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        let updatedNote = Order_note;
        if (order.Order_note && Order_note) {
            // Append only if there's a new note and an old note
            updatedNote = order.Order_note + " " + Order_note;
        } else if (order.Order_note) {
            // Keep old note if no new note provided (though usually one is provided)
            updatedNote = order.Order_note;
        }

        // If Status is provided, update it
        if (Status) order.Status = Status;
        // If Order_note is provided (even empty string to clear, but logic above preserves), update it.
        // The logic above assumes we are appending. If we want to strictly follow the "append" logic from before:
        if (Order_note) order.Order_note = updatedNote;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});

// DELETE order
router.delete("/orders/:id", async (req, res) => {
    try {
        await OrderData.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});


export default router;

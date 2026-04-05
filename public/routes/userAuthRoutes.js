import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

const router = express.Router();

/**
 * Register a new student
 * POST /api/user/register
 */
router.post("/register", async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        console.log("📝 Attempting registration for:", phone);

        if (!name || !phone || !password) {
            console.warn("⚠️ Registration failed: Missing fields");
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            console.warn("⚠️ Registration failed: User exists", phone);
            return res.status(400).json({ error: "User with this phone number already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            typeOfUser: "student",
            status: "pending"
        });

        await newUser.save();
        console.log("✅ User registered successfully:", phone);

        // Create session
        req.session.user = { id: newUser._id, role: newUser.typeOfUser, name: newUser.name };

        res.status(201).json({ message: "Registration successful", user: req.session.user });
    } catch (err) {
        console.error("❌ Registration error detail:", err);
        res.status(500).json({ error: "Server error during registration: " + err.message });
    }
});

/**
 * Student Login
 * POST /api/user/login
 */
router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;
        console.log("🔑 Attempting login for:", phone);

        if (!phone || !password) {
            return res.status(400).json({ error: "Missing phone or password" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            console.warn("⚠️ Login failed: User not found", phone);
            return res.status(401).json({ error: "User not found with this phone number" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("⚠️ Login failed: Password mismatch", phone);
            return res.status(401).json({ error: "Incorrect password" });
        }

        // Create session
        req.session.user = { id: user._id, role: user.typeOfUser, name: user.name };
        console.log("✅ Login successful for:", phone);

        res.json({ message: "Login successful", user: req.session.user });
    } catch (err) {
        console.error("❌ Login error detail:", err);
        res.status(500).json({ error: "Server error during login" });
    }
});

/**
 * Get current session user
 * GET /api/user/me
 */
router.get("/me", (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});

/**
 * Logout
 * POST /api/user/logout
 */
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

export default router;

import express from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ error: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

        req.session.user = { id: admin._id, role: admin.role };
        res.json({ message: "Login successful", user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

// Middleware for protection
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") next();
    else res.status(401).json({ error: "Unauthorized" });
}

export { isAdmin };
export default router;

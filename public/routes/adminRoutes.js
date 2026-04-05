import express from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";
import { User } from "../models/user.js";
import { CertificateViewer } from "../models/certificateViewer.js";
import { Course } from "../models/course.js";

const router = express.Router();

// Middleware for protection
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") next();
    else res.status(401).json({ error: "Unauthorized" });
}

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
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out" });
    });
});

// CHECK AUTH
router.get("/check-auth", isAdmin, (req, res) => {
    res.json({ message: "Authenticated", user: req.session.user });
});

// =============================
// ✅ USER MANAGEMENT ROUTES
// =============================

// GET all users (with optional filtering by name/phone)
router.get("/users", isAdmin, async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } }
                ]
            };
        }
        const users = await User.find(query).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE user
router.post("/users", isAdmin, async (req, res) => {
    try {
        const userData = { ...req.body };
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE user
router.put("/users/:id", isAdmin, async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE user
router.delete("/users/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================
// ✅ COURSE MANAGEMENT ROUTES
// =============================

// GET all courses
router.get("/courses", isAdmin, async (req, res) => {
    try {
        const courses = await Course.find().sort({ serial: 1, createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE course
router.post("/courses", isAdmin, async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE course
router.put("/courses/:id", isAdmin, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, updatedAt: Date.now() }, 
            { new: true }
        );
        if (!updatedCourse) return res.status(404).json({ error: "Course not found" });
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE course
router.delete("/courses/:id", isAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all certificate viewers
router.get("/certificate-viewers", isAdmin, async (req, res) => {
    try {
        const viewers = await CertificateViewer.find().sort({ date: -1 });
        res.json(viewers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export { isAdmin };
export default router;

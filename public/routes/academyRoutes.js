import express from "express";
import { GuestUser } from "../models/guestUsers.js";
import { User } from "../models/user.js";
import { Course } from "../models/course.js";
import { isAdmin } from "./adminRoutes.js";

const router = express.Router();

/**
 * Sync Guest Progress
 * POST /api/academy/guest-sync
 */
router.post("/guest-sync", async (req, res) => {
    try {
        const { guestId, name, progress, visited } = req.body;

        if (!guestId) {
            return res.status(400).json({ error: "guestId is required" });
        }

        let guest = await GuestUser.findOne({ guestId });

        if (guest) {
            // Update existing guest
            guest.progress = progress !== undefined ? progress : guest.progress;
            guest.visited = visited !== undefined ? visited : guest.visited;
            if (req.body.completedItems) {
                guest.completedItems = req.body.completedItems;
            }
            guest.updatedAt = Date.now();
            await guest.save();
            return res.json({ message: "Sync successful", data: guest });
        } else {
            // Create new guest
            guest = new GuestUser({
                guestId,
                name: name || "Guest Student",
                progress: progress || 0,
                visited: visited || 0,
                completedItems: req.body.completedItems || []
            });
            await guest.save();
            return res.status(201).json({ message: "Guest created and synced", data: guest });
        }
    } catch (err) {
        console.error("Guest sync error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Get Authenticated User Data
 * GET /api/academy/user-data
 */
router.get("/user-data", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "Not logged in" });
        }

        const user = await User.findById(req.session.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get All Courses (Publicly Accessible with filtering)
 * GET /api/academy/courses
 */
router.get("/courses", async (req, res) => {
    try {
        const { lang } = req.query;
        let query = { type: { $in: ["public"] } };

        if (lang) {
            // English is our default, so we include records where language is not set
            query.language = lang === "English" ? { $in: ["English", null, undefined] } : "Bangla";
        }

        if (req.session.user) {
            const user = await User.findById(req.session.user.id);
            if (user) {
                if (user.typeOfUser === "admin") {
                    // Admins see everything, but can filter by language
                    query = lang ? { language: lang === "English" ? { $in: ["English", null, undefined] } : "Bangla" } : {};
                } else if (user.status === "approved" || user.status === "completed") {
                    const userTypeForCourse = user.typeOfUser === "staff" ? "stuff" : user.typeOfUser;
                    // For approved users, show only their specific category
                    query.type = userTypeForCourse;
                }
            }
        }

        const courses = await Course.find(query).sort({ serial: 1, createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get Specific Course (Publicly Accessible with filtering)
 * GET /api/academy/courses/:id
 */
router.get("/courses/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        // Security Check
        if (!course.type.includes("public")) {
            if (!req.session.user) {
                return res.status(403).json({ error: "Authentication required for this course" });
            }

            const user = await User.findById(req.session.user.id);
            if (!user) return res.status(401).json({ error: "User not found" });

            if (user.typeOfUser !== "admin") {
                if (user.status !== "approved" && user.status !== "completed") {
                    return res.status(403).json({ error: "Your account is not approved yet" });
                }

                const userTypeForCourse = user.typeOfUser === "staff" ? "stuff" : user.typeOfUser;
                if (!course.type.includes(userTypeForCourse)) {
                    return res.status(403).json({ error: "Access denied for your user type" });
                }
            }
        }

        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update Authenticated User Progress
 * POST /api/academy/update-progress
 */
router.post("/update-progress", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "Not logged in" });
        }

        const { progress, completedItems } = req.body;
        const updateFields = { updatedAt: Date.now() };
        if (progress !== undefined) updateFields.progress = progress;
        if (completedItems) updateFields.completedItems = completedItems;

        const user = await User.findByIdAndUpdate(
            req.session.user.id,
            updateFields,
            { new: true }
        ).select("-password");

        res.json({ message: "Progress updated", data: user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

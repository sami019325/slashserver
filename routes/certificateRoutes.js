import express from "express";
import { User } from "../models/user.js";
import { CertificateViewer } from "../models/certificateViewer.js";

const router = express.Router();

/**
 * @route   POST /api/certificate/verify
 * @desc    Verify a certificate by serial number and log the viewer
 * @access  Public
 */
router.post("/verify", async (req, res) => {
    try {
        const { serial, viewerName, organization } = req.body;

        // Find user with this certificate
        const user = await User.findOne({ certificateId: serial.toUpperCase(), status: "completed" })
            .select("name course certificateId Image createdAt");

        // Log the viewer interaction regardless of success
        const viewerLog = new CertificateViewer({
            serial: serial.toUpperCase(),
            name: viewerName || "Unknown Viewer",
            organization: organization || "self",
            date: new Date()
        });
        await viewerLog.save();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No valid certificate found with this serial number."
            });
        }

        res.json({
            success: true,
            data: {
                name: user.name,
                course: user.course,
                serial: user.certificateId,
                image: user.Image,
                date: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;

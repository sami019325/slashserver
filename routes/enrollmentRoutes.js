import express from 'express';
import { Enrollment } from '../models/Enrollment.js';

const router = express.Router();

router.post('/enroll', async (req, res) => {
    try {
        const { C_Name, C_Phone1, C_Phone2, C_Email, C_S_Location, itemName, message, order_id } = req.body;

        if (!C_Name || !C_Phone1 || !C_Email || !C_S_Location || !itemName || !order_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEnrollment = new Enrollment({
            C_Name,
            C_Phone1,
            C_Phone2,
            C_Email,
            C_S_Location,
            itemName,
            message,
            order_id
        });

        await newEnrollment.save();

        res.status(201).json({ message: 'Enrollment successful', enrollment: newEnrollment });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Server error during enrollment' });
    }
});

// GET all enrollments (for admin dashboard)
router.get('/', async (req, res) => {
    try {
        const enrollments = await Enrollment.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: enrollments });
    } catch (error) {
        console.error('Fetch enrollments error:', error);
        res.status(500).json({ error: 'Server error fetching enrollments' });
    }
});

export default router;

import express from "express";
import { OrderData } from "../models/orderdb.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const { limit, date, phone, page } = req.query;
        const query = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.tran_date = { $gte: startOfDay, $lte: endOfDay };
        }

        if (phone) {
            query.cus_phone = phone;
        }

        const pageNum = parseInt(page) || 1;
        const limitValue = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitValue;

        const total = await OrderData.countDocuments(query);
        const blocks = await OrderData.find(query)
            .sort({ tran_date: -1 }) // Sort by date descending
            .skip(skip)
            .limit(limitValue);

        res.json({
            data: blocks,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitValue)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});

router.put("/update", async (req, res) => {
    try {
        const { id, Status, Order_note } = req.body;

        const order = await OrderData.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        let updatedNote = Order_note;
        if (order.Order_note) {
            updatedNote = order.Order_note + " " + Order_note;
        }

        order.Status = Status;
        order.Order_note = updatedNote;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});

export default router;

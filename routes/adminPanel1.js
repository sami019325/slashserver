import express from "express";
import { OrderData } from "../models/orderdb.js";

const router = express.Router();


router.get("/", async (req, res) => {
    const blocks = await OrderData.find();
    res.json(blocks);
});

export default router;

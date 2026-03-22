import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
    C_Name: { type: String, required: true },
    C_Phone1: { type: String, required: true },
    C_Phone2: { type: String },
    C_Email: { type: String, required: true },
    C_S_Location: { type: String, required: true },
    itemName: { type: String, required: true },
    message: { type: String },
    order_id: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now }
});

export const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    image: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    course: { type: String, default: "", required: true },
    date: { type: String, default: "", required: true },
    note: { type: String, default: "", required: true },
    uniqueID: { type: String, default: "", unique: true, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Certificate = mongoose.model("Certificate", certificateSchema);
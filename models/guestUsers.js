import mongoose from "mongoose";

const guestUserSchema = new mongoose.Schema({
    guestId: { type: String, unique: true, sparse: true },
    name: { type: String, default: "", required: true },
    progress: { type: Number, default: 0 },
    visited: { type: Number, default: 0 },
    completedItems: { type: [String], default: [] }, // Track completed items
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const GuestUser = mongoose.model("GuestUser", guestUserSchema);
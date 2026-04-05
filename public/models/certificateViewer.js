import mongoose from "mongoose";

const certificateViewerSchema = new mongoose.Schema({
    serial: { type: String, default: "" }, // Store as string for easier search tracking
    name: { type: String, default: "" },
    organization: { type: String, default: "self" },
    date: { type: Date, default: Date.now },
});

export const CertificateViewer = mongoose.model("CertificateViewer", certificateViewerSchema);
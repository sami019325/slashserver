import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, default: "Unnamed User", required: true },
    phone: { type: String, default: "", required: true },
    Image: { type: String, default: "" },
    address: { type: String, default: "" },
    course: { type: String, default: "" },
    progress: { type: Number, default: 0 },
    password: { type: String, default: "" }, 
    payment: { type: String, default: "" },
    typeOfUser: { type: String, enum: ["student", "customer", "admin", "staff", "owner"], default: "student", required: true },
    invoice: { type: String, default: "" },
    certificateId: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected", "completed", "cancelled"], default: "pending" },
    enrolledCourses: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" },
    completedItems: { type: [String], default: [] }, // Track completed course_lesson_class or course_lesson_quiz
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
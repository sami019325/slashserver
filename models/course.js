import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    topic: { type: String, default: "General", required: true }, // Repurposed as Category
    courseName: { type: String, default: "", required: true }, // The specific title
    image: { type: String, default: "", },
    type: { type: [String], default: ["student"] },
    language: { type: String, default: "English", enum: ["English", "Bangla"] },
    serial: { type: Number, default: 0 },
    lessons: {
        type: Array, default: [
            {
                class: [
                    {
                        title: { type: String, default: "", required: true },
                        video: { type: String, default: "", },
                        image: { type: String, default: "", },
                        image2: { type: String, default: "", },
                        image3: { type: String, default: "", },
                        image4: { type: String, default: "", },
                        audio: { type: String, default: "", },
                        audio2: { type: String, default: "", },
                        audio3: { type: String, default: "", },
                        audio4: { type: String, default: "", },
                        pdf: { type: String, default: "", },
                        text1: { type: String, default: "", },
                        text2: { type: String, default: "", },
                        text3: { type: String, default: "", },
                        text4: { type: String, default: "", },
                        text5: { type: String, default: "", },

                    }
                ],
                quiz: [
                    {
                        question: { type: String, default: "", required: true },
                        image: { type: String, default: "", },
                        image2: { type: String, default: "", },
                        options: {
                            type: Array, default: [
                                { option: "", correct: false },
                                { option: "", correct: false },
                                { option: "", correct: false },
                                { option: "", correct: false },
                            ], required: true
                        },
                        answer: { type: String, default: "", required: true },
                        explanation: { type: String, default: "", required: true },

                    }
                ]
            }
        ], required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Course = mongoose.model("Course", courseSchema);
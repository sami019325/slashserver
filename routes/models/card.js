import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    img1: { type: String, default: "https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=" },
    name: { type: String, default: "Unnamed Card" },
    category: { type: String, default: "uncategorized" },
    price: { type: Number, default: 0 },
    details1: { type: String, default: "No details provided." },
    details2: { type: String, default: "No details provided." },
    details3: { type: String, default: "No details provided." },
    C_Number: { type: String, default: "No details provided." },
    C_Location: { type: String, default: "No details provided." },
    available: { type: String, default: "available" },
    Search: { type: String, default: "no search" },
    reply: { type: Array, default: [] }
});


export const Card = mongoose.model("Card", cardSchema);



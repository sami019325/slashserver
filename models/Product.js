import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    img1: { type: String, default: "https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=" },
    img2: { type: String, default: "https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=" },
    img3: { type: String, default: "https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=" },
    name: { type: String, default: "Unnamed Product" },
    category: { type: String, default: "uncategorized" },
    price: { type: Number, default: 0 },
    details1: { type: String, default: "No details provided." },
    details2: { type: String, default: "No details provided." },
    details3: { type: String, default: "No details provided." },
    menufacturer: { type: String, default: "No details provided." },
    menufactured_country: { type: String, default: "No details provided." },
    key_points1: { type: String, default: "No details provided." },
    key_points2: { type: String, default: "No details provided." },
    key_points3: { type: String, default: "No details provided." },
    key_points4: { type: String, default: "No details provided." },
    key_points5: { type: String, default: "No details provided." },
    available: { type: String, default: "available" }
});


export const Product = mongoose.model("Product", productSchema);



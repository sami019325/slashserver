import mongoose from "mongoose";

const pageItemSchema = new mongoose.Schema({
    image: String,
    heading: String,
    subheading: String,
    text: String,
    input: String,
});

export const pageItem = mongoose.model("pageItem", pageItemSchema);
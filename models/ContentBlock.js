import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
    img: String,
    heading: String,
    subHeading: String,
    search_Key: String,
    details: String,
    productId: String,
});

export const ContentBlock = mongoose.model("ContentBlock", contentBlockSchema);

import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: { type: String, default: "", required: true },
    description: { type: String, default: "", required: true },
    level: [
        { images: [String], }
    ],
    allLevelComplete: { type: Boolean, default: false },
    allLevelTime: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Game = mongoose.model("Game", gameSchema);
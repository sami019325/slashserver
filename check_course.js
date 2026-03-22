import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "./models/course.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { family: 4 })
    .then(async () => {
        const course = await Course.findOne();
        console.log(JSON.stringify(course, null, 2));
        mongoose.connection.close();
    })
    .catch(err => console.error(err));

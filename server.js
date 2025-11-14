import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import pageItemRoutes from "./routes/pageContentRout.js";
import paymentGateway from "./routes/paymentGayeway.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// ✅ MIDDLEWARES
// =============================

// Parse incoming JSON
app.use(express.json());

// ✅ Configure allowed origins for CORS
const allowedOrigins = [
    "https://aajamnsami.com", // 🌐  frontend (deployed)
    "https://slashcoffeebd.com", // 🌐  frontend (deployed)
    "http://localhost:5000",          // 🧪 Local dev (Vite/React)
    "http://127.0.0.1:5500",
    // "null", // when opened from file:///
    // null
];

// ✅ CORS configuration
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // Allow non-browser requests
            if (allowedOrigins.includes(origin)) return callback(null, true);
            console.warn("❌ Blocked by CORS:", origin);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Vary", "Origin");
    next();
});


// ✅ Session setup (if needed)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set secure: true when using HTTPS
    })
);

// ✅ Serve static frontend files ( admin panel or static HTML)
app.use(express.static(path.join(__dirname, "public")));

// =============================
// ✅ ROUTES
// =============================
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/pageItem", pageItemRoutes);
app.use("/api/paymentpage", paymentGateway);

// ✅ 404 handler (for API routes)
app.use((req, res) => {
    res.status(404).json({ alert: "Route not found" });
});

// =============================
// ✅ DATABASE CONNECTION
// =============================
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// =============================
// ✅ SERVER START
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
);

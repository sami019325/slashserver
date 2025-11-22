import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import MongoStore from "connect-mongo";
// Routes
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import pageItemRoutes from "./routes/pageContentRout.js";
import paymentGateway from "./routes/paymentGayeway.js";
import adminPaneGetOnly from "./routes/adminPanel1.js";

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
    "https://slashserver.onrender.com",
    "http://admin.slashcoffeebd.com",
    "https://admin.slashcoffeebd.com"
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

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Vary", "Origin");
//     next();
// });

// =============================
// ✅ DATABASE CONNECTION (must be before session setup)
// =============================
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});

// session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: false,
        // ⬇️ Use MongoStore with existing mongoose connection ⬇️
        store: MongoStore.create({
            client: mongoose.connection.getClient(), // Reuse mongoose connection
            ttl: 14 * 24 * 60 * 60, // 14 days
            autoRemove: "interval",
            autoRemoveInterval: 10, // Check every 10 minutes
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Set to true only in production (if using HTTPS)
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
    })
);

// ✅ Serve static frontend files ( admin panel or static HTML)
app.use(express.static(path.join(__dirname, "public")));
app.use("/native_resources", express.static(path.join(__dirname, "native_resources")));

// =============================
// ✅ ROUTES
// =============================
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/pageItem", pageItemRoutes);
app.use("/api/paymentpage", paymentGateway);
app.use("/api/cards", cardRoutes);
app.use("/api/adminpanel1", adminPaneGetOnly);
// ✅ 404 handler (for API routes)
app.use((req, res) => {
    res.status(404).json({ alert: "Route not found" });
});

// =============================
// ✅ SERVER START
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
);

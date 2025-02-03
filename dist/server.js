"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import rateLimit from "express-rate-limit";
const connectDb_1 = require("./src/configs/connectDb");
const app_1 = __importDefault(require("./src/app"));
const server = (0, express_1.default)();
const PORT = 5000; // Server listening port
// Rate limiter configuration
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// Enable CORS for deployed frontend
server.use((0, cors_1.default)({
    origin: ["https://delivista-customer-page.vercel.app", true], // Your Vercel frontend
    credentials: true, // Allow cookies & sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Optional: Allow headers
}));
// Other security and parsing middleware
server.use((0, cookie_parser_1.default)());
server.use((0, helmet_1.default)());
server.use(express_1.default.json());
// server.use(limiter);
// Use app routes under /app
server.use("/app", app_1.default);
// Root route
server.get("/", (req, res) => {
    res.send("Welcome to Delivista!");
});
// Connect DB and start server
(0, connectDb_1.connectDb)()
    .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

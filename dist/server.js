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
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const connectDb_1 = require("./src/configs/connectDb");
const app_1 = __importDefault(require("./src/app"));
const server = (0, express_1.default)();
const PORT = 5000; // Server listening port
// Rate limiter configuration: limit each IP to 100 requests per 15 minutes
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requests per IP
    message: "Too many requests from this IP, please try again later.",
});
server.use(limiter); // Apply rate limiting middleware globally
// Enable CORS for specific origins and restrict allowed HTTP methods
server.use((0, cors_1.default)({
    origin: true, // Only allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
}));
server.use((0, cookie_parser_1.default)()); // Parse cookies attached to client requests
server.use((0, helmet_1.default)()); // Secure HTTP headers to protect against common vulnerabilities
server.use(express_1.default.json()); // Parse incoming JSON payloads into JavaScript objects
server.use("/app", app_1.default);
// Root route for server health check
server.get("/", (req, res) => {
    res.send("Welcome to Zippyzag!");
});
// Connect to MongoDB, then start the Express server
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

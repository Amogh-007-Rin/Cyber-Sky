"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const multer_1 = __importDefault(require("multer"));
const user_1 = __importDefault(require("./routes/user"));
const logs_1 = __importDefault(require("./routes/logs"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const upload = (0, multer_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
console.log("Starting server initialization...");
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow frontend
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/v1/users", user_1.default);
app.use("/api/v1/logs", logs_1.default);
app.get("/server/test", (req, res) => {
    res.json({ message: "Hello from the server!", test: true });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

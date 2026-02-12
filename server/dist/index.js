"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const multer_1 = __importDefault(require("multer"));
const user_1 = __importDefault(require("./routes/user"));
const upload = (0, multer_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/api/v1/users", user_1.default);
app.get("/server/test", (req, res) => {
    res.json({ message: "Hello from the server!", test: true });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

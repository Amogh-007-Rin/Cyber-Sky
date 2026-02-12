"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
require("dotenv/config");
const types_1 = require("../types/types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    const parsedData = types_1.UserSchema.safeParse({ fullName, email, password });
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsedData.error });
    }
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: parsedData.data.email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(parsedData.data.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                fullName: parsedData.data.fullName,
                email: parsedData.data.email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h"
        });
        res.json({
            message: "User created successfully",
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email }
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Error creating user",
            info: "Internal Server Error"
        });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h"
        });
        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email }
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/listusers", async (req, res) => {
    const users = await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
        }
    });
    res.json(users);
});
exports.default = router;

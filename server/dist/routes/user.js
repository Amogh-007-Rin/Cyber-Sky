"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
require("dotenv/config");
const types_1 = require("../types/types");
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    const parsedData = types_1.UserSchema.safeParse({ fullName, email, password });
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsedData.error });
    }
    try {
        const user = await prisma_1.prisma.user.create({
            data: {
                fullName: parsedData.data.fullName,
                email: parsedData.data.email,
                password: parsedData.data.password
            },
        });
        res.json({
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Error creating user",
            info: "User May Already Exists with the same email"
        });
    }
});
router.get("/listusers", async (req, res) => {
    const users = await prisma_1.prisma.user.findMany();
    res.json(users);
    console.log(users.map((user) => user.email));
});
exports.default = router;

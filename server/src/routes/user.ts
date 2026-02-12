import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import "dotenv/config";
import { UserSchema } from "../types/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/signup", async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const parsedData = UserSchema.safeParse({ fullName, email, password });
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsedData.error });
  }

  try {
    const existingUser = await prisma.user.findUnique({
        where: { email: parsedData.data.email }
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: parsedData.data.fullName,
        email: parsedData.data.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h"
    });

    res.json({
      message: "User created successfully",
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      info: "Internal Server Error"
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h"
        });

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email }
        });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/listusers", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
      select: {
          id: true,
          fullName: true,
          email: true,
      }
  });
  res.json(users);
});

export default router;

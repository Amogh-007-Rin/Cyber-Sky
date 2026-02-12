import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import "dotenv/config";
import { UserSchema } from "../types/types";

 const router = Router();


router.post("/signup", async (req: Request, res: Response, ) => {
  const { fullName, email, password } = req.body;
  const parsedData = UserSchema.safeParse({ fullName, email, password });
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsedData.error});
  }
  
  try {
  const user = await prisma.user.create({
    data: {
        fullName : parsedData.data.fullName,
        email : parsedData.data.email,
        password : parsedData.data.password
    },
  });
  res.json({
    message: "User created successfully",
    user,
  });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      message: "Error creating user",
      info: "User May Already Exists with the same email" });
  }
});

router.get("/listusers", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
  console.log(users.map((user) => user.email));
});

export default router;
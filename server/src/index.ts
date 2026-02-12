import express from "express";
import {Request, Response} from "express";  
import "dotenv/config";
import multer from "multer";
import  userRouter from "./routes/user";
const upload = multer();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/v1/users", userRouter);






app.get("/server/test", (req: Request, res: Response) => {
  res.json({ message: "Hello from the server!", test: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from "express";
import {Request, Response} from "express";  
import "dotenv/config";
import multer from "multer";
import userRouter from "./routes/user";
import logsRouter from "./routes/logs";
import helmet from "helmet";
import cors from "cors";

const upload = multer();


const app = express();
const PORT = process.env.PORT || 3000;

console.log("Starting server initialization...");

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow frontend
    credentials: true
}));

app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/logs", logsRouter);

app.get("/server/test", (req: Request, res: Response) => {
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

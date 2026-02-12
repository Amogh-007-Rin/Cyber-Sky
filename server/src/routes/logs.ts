import { Router, Request, Response } from "express";
import { CorrelationService } from "../services/correlationService";
import { prisma } from "../lib/prisma";

const router = Router();

// Ingest a new log
router.post("/", async (req: Request, res: Response) => {
    try {
        const { ip, eventType, details } = req.body;
        
        if (!ip || !eventType) {
            return res.status(400).json({ message: "Missing required fields: ip, eventType" });
        }

        const log = await CorrelationService.ingestLog({
            ip,
            eventType,
            details
        });

        res.status(201).json(log);
    } catch (error) {
        console.error("Error ingesting log:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get recent logs (visualization)
router.get("/", async (req: Request, res: Response) => {
    try {
        const logs = await prisma.log.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50 // Limit to last 50 for visualization performance
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Export all logs (dataset download)
router.get("/export", async (req: Request, res: Response) => {
    try {
        const logs = await prisma.log.findMany({
            orderBy: { timestamp: 'desc' }
        });
        
        // Return as downloadable JSON file
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=server_logs_dataset.json');
        res.json(logs);
    } catch (error) {
        console.error("Error exporting logs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Incidents (for Dashboard)
router.get("/incidents", async (req: Request, res: Response) => {
    try {
        const incidents = await prisma.incident.findMany({
            orderBy: { createdAt: 'desc' },
            include: { logs: true }
        });
        res.json(incidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Clear all incidents (Reset for demo)
router.delete("/incidents", async (req: Request, res: Response) => {
    try {
        await prisma.incident.deleteMany({});
        res.status(200).json({ message: "All incidents cleared" });
    } catch (error) {
        console.error("Error clearing incidents:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;

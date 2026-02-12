"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./lib/prisma");
async function main() {
    try {
        const count = await prisma_1.prisma.log.count();
        console.log(`Total logs in database: ${count}`);
        const logs = await prisma_1.prisma.log.findMany({ take: 5 });
        console.log("Recent logs:", JSON.stringify(logs, null, 2));
    }
    catch (error) {
        console.error("Error connecting to database:", error);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
main();

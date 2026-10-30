import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import app from "./app.js";

const server = app.listen(env.PORT, () => {
  console.info(`Portfolio API listening on port ${env.PORT}.`);
});

async function shutdown(signal: string): Promise<void> {
  console.info(`${signal} received; shutting down.`);
  server.close(async (error) => {
    if (error) {
      console.error("HTTP server shutdown failed:", error);
      process.exitCode = 1;
    }
    await prisma.$disconnect();
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

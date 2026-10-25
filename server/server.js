import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import logger from "./src/utils/logger.js";

dotenv.config();

let server;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
};

const shutdownServer = async () => {
  try {
    if (server) {
      server.close(() => {
        logger.info("Server Closed");
        process.exit(0);
      });
      return;
    }

    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Error during server shutdown");
    process.exit(1);
  }
};

process.on("SIGINT", shutdownServer);
process.on("SIGTERM", shutdownServer);

startServer();

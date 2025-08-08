/* eslint-disable no-console */
import mongoose from "mongoose";
import config from "./config";
import { app } from "./app";
import { Server } from "http";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const tourServer = async () => {
  try {
    if (!config.database_url) {
      throw new Error("Database URL is missing in environment variables.");
    }
    await mongoose.connect(config.database_url);
    console.log("Database connected successfully");
    server = app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

(async () => {
  await connectRedis();
  await tourServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("unHandle rejection detected... Server shutting down... ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("un caught exception detected... Server shutting down... ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

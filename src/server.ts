import mongoose from "mongoose";
import config from "./config";
import { app } from "./app";

const server = async () => {
  try {
    await mongoose.connect(config.database_url!);
    console.log("Database connected successfully");
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

server();

import express, { Request, Response } from "express";

import cors from "cors";
import routes from "./app/routes/routes";
export const app = express();

//middleware
app.use([express.json(), cors()]);

//routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "This is PH Tour Management API",
  });
});

import express, { Request, Response } from "express";

import cors from "cors";
import routes from "./app/routes/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
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

app.use(globalErrorHandler);
app.use(notFound);

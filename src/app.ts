import express, { Request, Response } from "express";
import routes from "./app/routes/routes";
import cors from "cors";
export const app = express();

//middleware
app.use([express.json(), cors()]);

//routes
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "This is PH Tour Management API",
  });
});

import express, { Request, Response } from "express";

export const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "This is PH Tour Management API",
  });
});

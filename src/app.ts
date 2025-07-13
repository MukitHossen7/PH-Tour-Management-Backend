import express, { Request, Response } from "express";

import cors from "cors";
import routes from "./app/routes/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
export const app = express();

//middleware
app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

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

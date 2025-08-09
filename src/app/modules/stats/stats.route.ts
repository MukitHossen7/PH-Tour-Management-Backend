import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const statsRoute = express.Router();

statsRoute.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getUserStats
);

statsRoute.get(
  "/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getBookingStats
);

statsRoute.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getTourStats
);
statsRoute.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getPaymentStats
);

export default statsRoute;

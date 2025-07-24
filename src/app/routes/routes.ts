import { Router } from "express";
import userRoute from "../modules/user/user.routes";
import authRoute from "../modules/auth/auth.routes";
import divisionRoute from "../modules/division/division.routes";
import tourRoute from "../modules/tour/tour.routes";
import bookingRoute from "../modules/booking/booking.route";

const routes = Router();

routes.use("/user", userRoute);
routes.use("/auth", authRoute);
routes.use("/division", divisionRoute);
routes.use("/tour", tourRoute);
routes.use("/booking", bookingRoute);

export default routes;

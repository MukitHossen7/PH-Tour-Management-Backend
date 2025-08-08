import { Router } from "express";
import userRoute from "../modules/user/user.routes";
import authRoute from "../modules/auth/auth.routes";
import divisionRoute from "../modules/division/division.routes";
import tourRoute from "../modules/tour/tour.routes";
import bookingRoute from "../modules/booking/booking.route";
import paymentRoute from "../modules/payment/payment.route";
import optRoute from "../modules/otp/otp.route";

const routes = Router();

routes.use("/user", userRoute);
routes.use("/auth", authRoute);
routes.use("/division", divisionRoute);
routes.use("/tour", tourRoute);
routes.use("/booking", bookingRoute);
routes.use("/payment", paymentRoute);
routes.use("/otp", optRoute);

export default routes;

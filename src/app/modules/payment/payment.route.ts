import express from "express";
import { PaymentController } from "./payment.controller";

const paymentRoute = express.Router();

paymentRoute.post("/success", PaymentController.successPayment);
paymentRoute.post("/fail", PaymentController.failPayment);
paymentRoute.post("/cancel", PaymentController.cancelPayment);
paymentRoute.post("/init-payment/:bookingId", PaymentController.initPayment);

export default paymentRoute;

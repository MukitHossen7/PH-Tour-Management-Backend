import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking Id is Required"],
      unique: true,
    },

    transactionId: {
      type: String,
      unique: true,
      required: [true, "Transaction Id is Required"],
    },
    amount: {
      type: Number,
      required: [true, "Transaction Id is Required"],
    },
    paymentGatewayData: {
      type: any,
    },
    invoiceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Payment = model<IPayment>("Payment", paymentSchema);

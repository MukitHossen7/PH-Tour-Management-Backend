/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

interface IInvoiceInfo {
  transactionId: string;
  bookingDate: string;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (invoiceInfo: IInvoiceInfo) => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const bookingDate = new Date(invoiceInfo.bookingDate);
      const formattedDate = bookingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", () => reject());

      //pdf

      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`Transaction ID: ${invoiceInfo.transactionId}`);
      doc.text(`Booking Date: ${formattedDate}`);
      doc.text(`Customer: ${invoiceInfo.userName}`);
      doc.moveDown();

      doc.text(`Tour: ${invoiceInfo.tourTitle}`);
      doc.text(`Guests: ${invoiceInfo.guestCount}`);
      doc.text(`Total Amount: ${invoiceInfo.totalAmount.toFixed(2)}`);
      doc.moveDown();
      doc.text("Thank you for booking with us!", { align: "center" });
      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Pdf creation error ${error.message}`);
  }
};

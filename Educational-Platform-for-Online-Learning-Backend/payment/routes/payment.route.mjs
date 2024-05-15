import PaymentController from "../controllers/payment.controller.mjs";
import express from "express";

const PaymentRouter = express.Router();

PaymentRouter.post("/", PaymentController.makePayment);
PaymentRouter.get("/:id", PaymentController.getById);
PaymentRouter.put("/:id/verify", PaymentController.verifyPayment);
PaymentRouter.get("/", PaymentController.getAllPayments);
PaymentRouter.get("/user/:userId", PaymentController.getPaymentsByUser);
PaymentRouter.post('/send-email/:email', PaymentController.sendPaymentSuccessEmail);

export default PaymentRouter;

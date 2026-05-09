import express from "express";
import authMiddleware from "../middleware/auth.js";
import { updateLocation } from "../controllers/orderController.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyPayment,
  getOrderById,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyPayment);
orderRouter.get("/userorders", authMiddleware, userOrders);
orderRouter.get("/track/:id", authMiddleware, getOrderById);
orderRouter.get("/list", listOrders);
orderRouter.put("/updateStatus", updateStatus);
orderRouter.post("/location", updateLocation);

// food processing, out for deliver ,delivered

export default orderRouter;

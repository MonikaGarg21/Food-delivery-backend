import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import { io } from "../server.js"; // 🔥 socket import

// 📦 Place Order
export const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.user,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: "Food Proccessing",
      location: {
        lat: 28.6139,
        lng: 77.209,
      },
    });

    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(req.user, { cartData: {} });

    // Razorpay order
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "order_" + newOrder._id,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: newOrder._id,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// 💳 Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment Verified" });
    } else {
      res.json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 User Orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Admin Orders
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// 🔄 Update Order Status (REAL-TIME)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false });
    }

    // 🔥 real-time update
    io.to(orderId).emit("orderUpdated", updatedOrder);

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// 📍 Update Delivery Location (LIVE GPS)
export const updateLocation = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { location: { lat, lng } },
      { new: true },
    );

    // 🔥 emit location
    io.to(orderId).emit("locationUpdated", updatedOrder.location);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// 📍 Get Single Order (Tracking)
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

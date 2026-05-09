import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = 4000;

// 🔥 create http server (IMPORTANT)
const server = http.createServer(app);

// 🔥 socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 socket connection
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // join specific order room
  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
    console.log(`User joined order room: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ export io (IMPORTANT for controller)
export { io };

// middleware
app.use(express.json());
app.use(cors());

// DB connect
connectDB();

// routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// ❗ IMPORTANT: use server.listen NOT app.listen
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

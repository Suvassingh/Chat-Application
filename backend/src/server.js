import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cors from "cors";
import {app,server} from "./lib/socket.js"


const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;
// ✅ CORS must come first
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
}));

// ✅ Allow larger payloads (for profile pics in Base64)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
// app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
server.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
  connectDB();
});








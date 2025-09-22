// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import { ENV } from "./env.js";
// import {socketAuthMiddleware} from "../middlewares/socket.auth.middleware.js"
// const app = express();

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });

// // apply authentication middleware to all socket connection

// io.use(socketAuthMiddleware)

// // for storing the online users

// const userSocketMap = {}; //{userId:socketId}

// io.on("connection",(socket)=>{
//   console.log("A user connected",socket.user.fullname)

//   const userId = socket.userId
//   userSocketMap[userId] = socket.id
//   // io.emit() is used to send events to all connected clients
//   io.emit("getOnlineUsers",Object.keys(userSocketMap));
// // with socket.on we listen for events from clients
//   socket.on("disconnect",()=>{
//     console.log("A user disconnected",socket.user.fullname)
//     delete userSocketMap[userId]
//     io.emit("getOnlineUsers",Object.keys(userSocketMap));

//   })
// })


// export {io,server,app}

import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  },
});

// Apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);
// check for testing whether the user is online or not
export function getReceiverSocketId(userId){
  return userSocketMap[userId]
}


// Store online users
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user.fullname);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // Emit online users safely
  try {
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } catch (err) {
    console.error("Error emitting online users:", err.message);
  }

  // Listen for client disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.user.fullname);
    delete userSocketMap[userId];
    try {
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } catch (err) {
      console.error("Error emitting online users:", err.message);
    }
  });
});

export { io, server, app };

import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleWare } from "../Middlewares/socketMiddleWare.js";
import { getUserConversationForSocketIo } from "../Controllers/conversationController.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleWare);

const onlineUsers = new Map();

io.on("connection", async (socket) => {
  const user = socket.user;

  console.log(
    `${user.fullName} online with socket id: ${socket.id}`
  );

  // join personal room
  socket.join(user._id.toString());

  console.log(
    "JOIN USER ROOM:",
    user._id.toString()
  );

  onlineUsers.set(user._id.toString(), socket.id);

  io.emit(
    "online-users",
    Array.from(onlineUsers.keys())
  );

  const conversationIds =
    await getUserConversationForSocketIo(user._id);

  conversationIds.forEach((id) => {
    socket.join(id.toString());
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());

    io.emit(
      "online-users",
      Array.from(onlineUsers.keys())
    );

    console.log(
      `${user.fullName} disconnected with socket id: ${socket.id}`
    );
  });
});

export { io, app, server };

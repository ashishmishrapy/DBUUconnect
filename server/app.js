import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlewares/auth.jwt.js';
import { login, logout, register } from './controllers/auth.controller.js';
import { Server } from "socket.io"
import { createServer } from "http"
import { Message } from "./models/message.model.js";


dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://dbuuconnect.vercel.app",
    credentials: true,
  },
});

app.use(cookieParser())
app.use(cors({
  origin: "https://dbuuconnect.vercel.app", 
  credentials: true
}));
app.use(express.json());

app.use("/room",verifyToken)

app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout)



io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // send room history
    const history = await Message.find({ roomId }).sort({ createdAt: 1 }).limit(50);
    socket.emit("roomHistory", history);
  });

  socket.on("sendMessage", async ({ roomId, text, sender }) => {
    const newMsg = new Message({ roomId, sender, text });
    await newMsg.save();

    io.to(roomId).emit("message", newMsg); 
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});


app.get("/check-auth", verifyToken, async (req, res) => {
  res.json({ success: true, user: req.user});
});


server.listen(process.env.PORT, ()=> console.log(`Server running on port ${process.env.PORT}`))


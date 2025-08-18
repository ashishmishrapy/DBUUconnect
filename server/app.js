import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlewares/auth.jwt.js';
import { login, logout, register } from './controllers/auth.controller.js';
import { Server } from "socket.io"
import { createServer } from "http"
import { User } from './models/user.model.js';


dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

app.use("/room",verifyToken)

app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout)




//io config



io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, text }) => {
    io.to(roomId).emit("message", text); // broadcast to room
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


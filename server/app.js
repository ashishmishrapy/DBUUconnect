import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import {User} from './models/user.model.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken"
import { verifyToken } from './middlewares/auth.jwt.js';

dotenv.config();
connectDB();


const app = express();
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      password: user.password
    },process.env.JWT_SECRET)

    res.cookie('token',token)
    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/check-auth", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});


app.listen(process.env.PORT, ()=> console.log(`Server running on port ${process.env.PORT}`))


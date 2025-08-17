import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlewares/auth.jwt.js';
import { login, register } from './controllers/auth.controller.js';

dotenv.config();
connectDB();


const app = express();
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

app.use("/user",verifyToken)

app.post('/register', register);
app.post('/login', login);


app.get("/check-auth", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});


app.listen(process.env.PORT, ()=> console.log(`Server running on port ${process.env.PORT}`))


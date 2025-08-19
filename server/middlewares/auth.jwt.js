import jwt from "jsonwebtoken";
// import { User } from "../models/user.model";

export const verifyToken =async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // const user = await User.findById(decoded.id).select("-password -email");
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

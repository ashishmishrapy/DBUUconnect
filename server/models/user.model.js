import mongoose from "mongoose";

const DISCORD_COLORS = [
  "#1ABC9C",
  "#11806A",
  "#2ECC71",
  "#1F8B4C",
  "#3498DB",
  "#206694",
  "#9B59B6",
  "#71368A",
  "#E91E63",
  "#AD1457",
  "#F1C40F",
  "#C27C0E",
  "#E67E22",
  "#A84300",
  "#E74C3C",
  "#992D22",
  "#95A5A6",
  "#607D8B",
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "co-admin", "user"],
      default: "user",
    },
    gender:{
        type: String,
        enum:["Male", "Female", "Not Specified"],
        default: "Not Specified"
    },
    color: {
      type: String,
      enum: DISCORD_COLORS,
      default: function(){
        return DISCORD_COLORS[Math.floor(Math.random() * DISCORD_COLORS.length)];
      }
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

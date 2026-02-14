import { MdMenuBook, MdOutlineLaptopChromebook } from "react-icons/md";
import { FaRegKissWinkHeart } from "react-icons/fa";

export const ROOM_DATA = [
  {
    id: 108,
    title: "Study Hall",
    icon: <MdMenuBook />,
    rules: [
      "Academic discussions and study groups",
      "Don't Spam.",
      "Only Study talks allowed.",
    ],
  },
  {
    id: 404,
    title: "Coding Zone",
    icon: <MdOutlineLaptopChromebook />,
    rules: [
      "Ask and answer coding questions",
      "Share resources and projects",
      "Respect other learners",
    ],
  },
  {
    id: 69,
    title: "Fun Lounge",
    icon: <FaRegKissWinkHeart />,
    rules: ["Casual chat and memes", "Keep it friendly", "Dont use abusing lang."],
  },
];

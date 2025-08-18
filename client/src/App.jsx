import Landing from './pages/Landing'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Room from './pages/Room'
import { MdMenuBook } from "react-icons/md";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { FaRegKissWinkHeart } from "react-icons/fa";
import { useState } from 'react'

const App = () => {
  
  const cardData = [
    {
      id: 108,
      title: "Study Hall",
      icon: <MdMenuBook />,
      online: 142,
      rules: [
        "Academic discussions and study groups",
        "Don't Spam.",
        "Only Study talks allowed."
      ]
    },
    {
      id: 404,
      title: "Coding Zone",
      icon: <MdOutlineLaptopChromebook />,
      online: 87,
      rules: [
        "Ask and answer coding questions",
        "Share resources and projects",
        "Respect other learners"
      ]
    },
    {
      id: 69,
      title: "Fun Lounge",
      icon: <FaRegKissWinkHeart />,
      online: 54,
      rules: [
        "Casual chat and memes",
        "Keep it friendly",
        "Flirting allowed"
      ]
    }
  ];
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  
  
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register form={form} setForm={setForm} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard cardData={cardData} />} />
      <Route path={"/room/:id"} element={<Room />} />
    </Routes>
    </>
  )
}

export default App
import React from 'react'
import Landing from './pages/Landing'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Room from './pages/Room'

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/room" element={<Room />} />
    </Routes>
    </>
  )
}

export default App
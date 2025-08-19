import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 3) {
      alert("Name must be at least 3 characters long");
      return;
    }

    if (form.email.length < 15) {
      alert("Email must be at least 15 characters long");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post("https://dbuuconnect-backend.onrender.com/register", form);

      if (response.data.success) {
        setForm({ name: "", email: "", password: "" });
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen max-h-screen overflow-hidden">
      <div className="bg-amber-600 rounded-full blur-3xl opacity-30 absolute md:w-[50vh] w-[30vh] h-[30vh]" />
      <div className="grid lg:grid-cols-2 gap-5 items-center h-screen justify-center">
        <img
          src="/img/landing.webp"
          alt="landing page image"
          className="hidden lg:inline-block max-h-screen w-full object-cover backdrop-blur-2xl shadow-amber-600"
        />
        <div className="text-center">
          <h1 className="text-white font-bold tracking-tighter text-[50px] md:text-[60px] leading-none">
            Welcome to <br />
            <span className="border-b-amber-600 border-b-3"> DBUUConnect </span>
          </h1>
          <p className="text-lg mt-5 text-zinc-600">
            Your one-stop solution to connect with your fellow DBUUians{" "}
          </p>
          <div className="mt-5">
            <input
              type="text"
              placeholder="Full name"
              required
              value={form.name}
              className="p-2 outline-none rounded bg-zinc-800 text-white w-[90%] mb-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              className="p-2 outline-none rounded bg-zinc-800 text-white w-[90%] mb-3"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              className="p-2 outline-none rounded bg-zinc-800 text-white w-[90%] mb-3"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              className="bg-amber-600 cursor-pointer text-white px-5 py-2 rounded hover:bg-amber-500 transition-all"
              onClick={handleSubmit}
            >
              Register
            </button>
          </div>
          <p className="text-sm mt-5 text-zinc-600">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

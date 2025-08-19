import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://dbuuconnect-backend.onrender.com/login",
        loginForm,
        { withCredentials: true }
      );

      if (res.data.success) {
        console.log("Login Success");
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <h1 className="text-white font-bold tracking-tighter text-[60px] leading-none">
            Welcome to <br />
            <span className="border-b-amber-600 border-b-3"> DBUUConnect </span>
          </h1>
          <p className="text-lg mt-5 text-zinc-600">
            Your one-stop solution to connect with your fellow DBUUians{" "}
          </p>

          {/* ✅ Wrap in form */}
          <form onSubmit={handleSubmit} className="mt-5">
            <input
              type="email"
              placeholder="Email"
              required
              value={loginForm.email}
              className="p-2 outline-none rounded bg-zinc-800 text-white w-[90%] mb-3"
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              className="p-2 outline-none rounded bg-zinc-800 text-white w-[90%] mb-3"
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 cursor-pointer text-white px-5 py-2 rounded hover:bg-amber-500 transition-all disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm mt-5 text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-amber-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

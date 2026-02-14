import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../firebase/auth";
import { getUserDocument, createUserDocument } from "../firebase/firestore";
import { useAuth } from "../hooks";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await loginUser(loginForm.email, loginForm.password);
      const user = userCredential.user;
      
      const userData = await getUserDocument(user.uid);
      login({ ...userData, uid: user.uid, email: user.email });
      
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      let userData = await getUserDocument(user.uid);
      
      if (!userData) {
        const username = user.email.split('@')[0];
        const colors = ["#A84300", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        await createUserDocument(user.uid, {
          name: user.displayName || "User",
          username: username,
          email: user.email,
          gender: "Not Specified",
          role: "user",
          isAlumni: false,
          avatar: user.photoURL || "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png",
          color: randomColor,
          about: "",
          course: "",
          year: null,
          dob: null,
          linkedinProfile: "",
        });
        
        userData = await getUserDocument(user.uid);
      }

      login({ ...userData, uid: user.uid, email: user.email });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen max-h-screen overflow-hidden">
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

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col justify-center items-center">
            <input
              type="email"
              placeholder="Email"
              required
              value={loginForm.email}
              className="p-2 outline-none rounded bg-white/5 backdrop-blur-xl w-[90%] text-white mb-3 border border-white/10"
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              className="p-2 outline-none rounded bg-white/5 backdrop-blur-xl w-[90%] text-white mb-3 border border-white/10"
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 cursor-pointer w-[90%] text-white px-5 py-2 rounded hover:bg-amber-500 transition-all disabled:opacity-50 mb-3"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center w-[90%] mb-3">
              <div className="flex-1 border-t border-zinc-600"></div>
              <span className="px-3 text-zinc-500 text-sm">OR</span>
              <div className="flex-1 border-t border-zinc-600"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="bg-white cursor-pointer text-zinc-800 px-5 py-2 rounded hover:bg-zinc-100 transition-all w-[90%] flex items-center justify-center gap-2 font-semibold"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
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

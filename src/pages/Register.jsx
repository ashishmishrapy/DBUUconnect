import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginWithGoogle } from "../firebase/auth";
import { createUserDocument, getUserDocument } from "../firebase/firestore";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 3) {
      setError("Name must be at least 3 characters long");
      return;
    }

    if (form.email.length < 15) {
      setError("Email must be at least 15 characters long");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);

    try {
      const userCredential = await registerUser(form.email, form.password);
      const user = userCredential.user;

      const username = form.email.split('@')[0];
      const colors = ["#A84300", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      await createUserDocument(user.uid, {
        name: form.name,
        username: username,
        email: form.email,
        gender: "Not Specified",
        role: "user",
        isAlumni: false,
        avatar: "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png",
        color: randomColor,
        about: "",
        course: "",
        year: null,
        dob: null,
        linkedinProfile: "",
      });

      setForm({ name: "", email: "", password: "" });
      alert('Registration successful! Please check your email to verify your account before logging in.');
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed");
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

      const existingUser = await getUserDocument(user.uid);
      
      if (!existingUser) {
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
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message || "Google sign-in failed");
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
          <div className="mt-5 flex flex-col items-center">
            <input
              type="text"
              placeholder="Full name"
              required
              value={form.name}
              className="p-2 outline-none rounded bg-white/5 backdrop-blur-xl text-white w-[90%] mb-3 border border-white/10"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              className="p-2 outline-none rounded bg-white/5 backdrop-blur-xl text-white w-[90%] mb-3 border border-white/10"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              className="p-2 outline-none rounded bg-white/5 backdrop-blur-xl text-white w-[90%] mb-3 border border-white/10"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error && <p className="text-red-500 mb-3 w-[90%]">{error}</p>}
            <button
              type="submit"
              className="bg-amber-600 cursor-pointer text-white px-5 py-2 rounded hover:bg-amber-500 transition-all w-[90%] mb-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
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

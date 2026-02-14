import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="bg-black min-h-screen max-h-screen overflow-hidden">
      <div className="bg-amber-600 rounded-full blur-3xl w opacity-30 absolute h-[30vh]" />
      <div className="grid lg:grid-cols-2 gap-5 items-center h-screen justify-center">
        <img
          src="/img/landing.webp"
          alt=""
          className="hidden lg:inline-block max-h-screen w-full object-cover "
        />
        <div className="text-center">
          <h1 className="text-white font-bold tracking-tighter md:text-[60px] text-[50px] leading-none">
            Welcome to <br />
            <span className="border-b-amber-600 border-b-3"> DBUUConnect </span>
          </h1>
          <p className="text-lg mt-5 text-zinc-600">
            Your one-stop solution to connect with your fellow DBUUians{" "}
          </p>
          <Link
            to="/register"
            className="bg-amber-600 text-white px-5 py-2 rounded mt-7 inline-block hover:bg-amber-500 transition-all"
          >
            Get Started
          </Link>
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

export default Landing;

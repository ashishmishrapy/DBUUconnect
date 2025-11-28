import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CgArrowLeft } from "react-icons/cg";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    gender: "",
    color: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/check-auth`,
          { headers: { Authorization: `Bearer ${token}` } },
          {
            withCredentials: true,
          }
        );
        
        if (!res.data.success) {
          navigate("/");
        } else {
          setProfile({
            name: res.data.user.name,
            email: res.data.user.email,
            gender: res.data.user.gender || "Not specified",
            color: res.data.user.color,
          });
        }
      } catch {
        navigate("/");
      }
    };
    checkLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-zinc-800 p-6 sm:p-10 rounded-2xl shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="p-1 cursor-pointer rounded-full bg-zinc-700"
          >
            <CgArrowLeft className="font-bold text-md md:text-xl" />
          </button>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              <div
              style={{ backgroundColor: profile.color }}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold`}>
                {profile.name ? profile.name[0] : "?"}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profile.name}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mb-4">
                {profile.email}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span className="text-zinc-400 font-medium">Gender:</span>
                  <span className="text-white font-semibold">
                    {profile.gender}
                  </span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span className="text-zinc-400 font-medium">Role:</span>
                  <span className="text-white font-semibold capitalize">
                    {profile.role || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition">
              Edit Profile
            </button>
            <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

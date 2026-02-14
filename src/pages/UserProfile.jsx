import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { CgArrowLeft } from "react-icons/cg";
import { FaLinkedin, FaBirthdayCake } from "react-icons/fa";
import { MdEmail, MdSchool } from "react-icons/md";
import { useState, useEffect } from "react";
import { getUserByUsername } from "../firebase/firestore";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserByUsername(username);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [username]);


  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-zinc-800 p-6 sm:p-10 rounded-2xl shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="p-2 cursor-pointer rounded-full bg-zinc-700 hover:bg-zinc-600 transition mb-6"
          >
            <CgArrowLeft className="text-white text-xl" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <img
              src={user?.avatar}
              alt={user?.name}
              style={{borderColor: user.color}}
              className="w-28 h-28 rounded-full border-4 object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
              <p style={{color: user.color}} className={`font-medium mb-2`}>@{user?.username}</p>
              {user?.isAlumni && (
                <span className="inline-block mt-3 px-3 py-1 bg-amber-600 text-white text-sm rounded-full">
                  Alumni
                </span>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg md:col-span-2 border border-white/10">
              <p className="text-zinc-400 text-sm mb-1">About</p>
              <p className="text-white font-semibold">{user?.about || "N/A"}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-zinc-400 text-sm mb-1">Role</p>
              <p className="text-white font-semibold capitalize">{user?.role}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-zinc-400 text-sm mb-1">Gender</p>
              <p className="text-white font-semibold">{user?.gender}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-zinc-400 text-sm mb-1 flex items-center gap-2">
                <MdSchool /> Course
              </p>
              <p className="text-white font-semibold uppercase">{user?.course || "N/A"}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-zinc-400 text-sm mb-1">Year</p>
              <p className="text-white font-semibold">{user?.year || "N/A"}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-zinc-400 text-sm mb-1 flex items-center gap-2">
                <FaBirthdayCake /> Date of Birth
              </p>
              <p className="text-white font-semibold">
                {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-zinc-400 text-sm mb-1 flex items-center gap-2">
                <FaLinkedin /> LinkedIn
              </p>
              {user?.linkedinProfile ? (
                <a
                  href={user.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline font-semibold"
                >
                  View Profile
                </a>
              ) : (
                <p className="text-white font-semibold">N/A</p>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-zinc-700 p-4 rounded-lg mb-6">
            <p className="text-zinc-400 text-sm mb-2">Member Since</p>
            <p className="text-white font-semibold">
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

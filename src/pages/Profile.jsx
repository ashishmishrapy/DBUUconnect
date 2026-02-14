import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { CgArrowLeft } from "react-icons/cg";
import { FaLinkedin, FaUserGraduate, FaBirthdayCake } from "react-icons/fa";
import { MdEmail, MdSchool, MdEdit } from "react-icons/md";
import { useAuth } from "../hooks";
import { useState, useEffect } from "react";
import { getUserDocument, updateUserDocument } from "../firebase/firestore";
import { logoutUser } from "../firebase/auth";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [authUser]);

  const fetchUserProfile = async () => {
    if (!authUser?.uid) return;
    try {
      const userData = await getUserDocument(authUser.uid);
      setUser(userData);
      setFormData({
        about: userData.about || "",
        gender: userData.gender || "",
        course: userData.course || "",
        year: userData.year || "",
        dob: userData.dob || "",
        linkedinProfile: userData.linkedinProfile || "",
        isAlumni: userData.isAlumni || false,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        about: user?.about || "",
        gender: user?.gender || "",
        course: user?.course || "",
        year: user?.year || "",
        dob: user?.dob || "",
        linkedinProfile: user?.linkedinProfile || "",
        isAlumni: user?.isAlumni || false,
      });
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // Validate LinkedIn URL
      if (formData.linkedinProfile && formData.linkedinProfile.trim()) {
        try {
          new URL(formData.linkedinProfile);
        } catch {
          alert('Please enter a valid LinkedIn URL');
          setSaving(false);
          return;
        }
      }
      
      await updateUserDocument(authUser.uid, formData);
      await fetchUserProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const logOutHandle = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

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
  

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-lg border border-white/10">
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
              className="w-28 h-28 rounded-full border-4 border-amber-600 object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-amber-600 font-medium mb-2">@{user?.username}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-400">
                <MdEmail />
                <span>{user?.email}</span>
              </div>
              {user?.isAlumni && (
                <span className="inline-block mt-3 px-3 py-1 bg-amber-600 text-white text-sm rounded-full">
                  Alumni
                </span>
              )}
            </div>
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition flex items-center gap-2"
            >
              <MdEdit /> {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-700 p-4 rounded-lg md:col-span-2">
              <p className="text-zinc-400 text-sm mb-1">About</p>
              {isEditing ? (
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full bg-zinc-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 min-h-[80px]"
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="text-white font-semibold">{user?.about || "N/A"}</p>
              )}
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm mb-1">Role</p>
              <p className="text-white font-semibold capitalize">{user?.role}</p>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm mb-1">Gender</p>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-zinc-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-white font-semibold">{user?.gender}</p>
              )}
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm mb-1 flex items-center gap-2">
                <MdSchool /> Course
              </p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value.slice(0, 5).toUpperCase() })}
                  className="w-full bg-zinc-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  placeholder="Enter course"
                  maxLength={5}
                />
              ) : (
                <p className="text-white font-semibold uppercase">{user?.course?.slice(0, 5) || "N/A"}</p>
              )}
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm mb-1">Year</p>
              {isEditing ? (
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-zinc-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              ) : (
                <p className="text-white font-semibold">{user?.year || "N/A"}</p>
              )}
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm mb-1 flex items-center gap-2">
                <FaBirthdayCake /> Date of Birth
              </p>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-zinc-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              ) : (
                <p className="text-white font-semibold">
                  {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                </p>
              )}
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm mb-1 flex items-center gap-2">
                <FaLinkedin /> LinkedIn
              </p>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.linkedinProfile}
                  onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value.slice(0, 100) })}
                  className="w-full bg-zinc-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  placeholder="LinkedIn URL"
                  maxLength={100}
                />
              ) : user?.linkedinProfile ? (
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

          {/* Alumni Toggle */}
          {isEditing && (
            <div className="bg-zinc-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <p className="text-zinc-400 text-sm">Alumni Status</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAlumni}
                    onChange={(e) => setFormData({ ...formData, isAlumni: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>
          )}

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

          {/* Actions */}
          <div className="flex gap-4">
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-500 transition font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={logOutHandle}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-500 transition font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

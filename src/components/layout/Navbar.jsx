import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdDashboard, MdChat, MdLogout, MdInstallMobile } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install this app:\n\n1. On Android: Tap browser menu (⋮) → "Add to Home screen" or "Install app"\n2. On iOS: Tap Share button → "Add to Home Screen"\n3. On Desktop: Look for install icon (⊕) in address bar');
    }
  };

  const logOutHandle = () => {
    setSidebarOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex flex-col group">
              <h1 className="text-2xl font-black tracking-tight text-amber-600 leading-none">
                DBUU
              </h1>
              <span className="text-zinc-400 text-xs font-light">connect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg transition-all ${
                  location.pathname === "/dashboard"
                    ? "bg-amber-600 text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/chat"
                className={`px-4 py-2 rounded-lg transition-all ${
                  location.pathname === "/chat"
                    ? "bg-amber-600 text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                Chat
              </Link>
              <Link
                to="/students"
                className={`px-4 py-2 rounded-lg transition-all ${
                  location.pathname === "/students"
                    ? "bg-amber-600 text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                Students
              </Link>
            </div>

            {/* User Profile & Menu */}
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-amber-600"
                  loading="lazy"
                />
                <span className="text-white font-medium">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <HiMenuAlt3 />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <h2 className="text-white font-bold text-xl">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl hover:bg-white/20 p-1 rounded-lg transition-all"
          >
            <IoClose />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-12 h-12 rounded-full border-2 border-amber-600"
              loading="lazy"
            />
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-zinc-400 text-sm">@{user?.username}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === "/profile"
                ? "bg-amber-600 text-white shadow-lg"
                : "text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <CgProfile className="text-xl" />
            <span className="font-medium">Profile</span>
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === "/dashboard"
                ? "bg-amber-600 text-white shadow-lg"
                : "text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MdDashboard className="text-xl" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/chat"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === "/chat"
                ? "bg-amber-600 text-white shadow-lg"
                : "text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MdChat className="text-xl" />
            <span className="font-medium">Chat</span>
          </Link>
          <Link
            to="/students"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === "/students"
                ? "bg-amber-600 text-white shadow-lg"
                : "text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <PiStudentBold className="text-xl" />
            <span className="font-medium">Students</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-all font-medium"
          >
            <MdInstallMobile className="text-xl" />
            {isInstallable ? 'Install App' : 'Install Instructions'}
          </button>
          <button
            onClick={logOutHandle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all font-medium"
          >
            <MdLogout className="text-xl" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Share2, TrainFront, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navTabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/documents", label: "Documents" },
    { path: "/search", label: "Search" },
    { path: "/saved", label: "Saved" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PaperPilot",
          text: "Check out PaperPilot!",
          url: window.location.origin,
        });
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">

      {/* Brand */}
      <div className="flex items-center gap-3 px-6">
        <div className="w-10 h-10 bg-[#E5BA73]/10 rounded-lg flex items-center justify-center text-[#E5BA73]">
          <TrainFront className="w-6 h-6" />
        </div>

        <span className="text-[#17048f] font-sanserif text-2xl font-medium tracking-wide">
          Paper<span className="text-[#E5BA73]">Pilot</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-3">
        {navTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-5 mr-10">

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[#0B1B33] hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        {/* Profile */}
        <div ref={dropdownRef} className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 bg-[#0B1B33] hover:bg-[#162a4a] text-white font-semibold text-sm rounded-full flex items-center justify-center transition-colors"
          >
            PD
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">

              {/* My Profile */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                My Profile
              </button>

              <div className="border-t border-slate-100" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

            </div>
          )}

        </div>
      </div>

    </header>
  );
}
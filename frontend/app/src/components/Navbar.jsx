import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrainFront, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">

      {/* Brand */}
      <div className="flex items-center gap-3 px-6">
        <div className="w-10 h-10 bg-[#E5BA73]/10 rounded-lg flex items-center justify-center text-[#E5BA73]">
          <TrainFront className="w-6 h-6" />
        </div>

        <span className="text-[#17048f] font-sans text-2xl font-medium tracking-wide">
          Paper<span className="text-[#E5BA73]">Pilot</span>
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5 mr-10">

        {/* Profile */}
        <div ref={dropdownRef} className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 bg-[#0B1B33] hover:bg-[#162a4a] text-white font-semibold text-sm rounded-full flex items-center justify-center transition-colors"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Profile Dropdown */}
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
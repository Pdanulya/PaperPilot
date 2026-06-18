import React from 'react';
import { NavLink } from "react-router-dom";
import { UploadCloud, TrainFront } from 'lucide-react';

export default function Navbar() {
  const navTabs = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/documents", label: "Documents" },
  { path: "/search", label: "Search" },
  { path: "/saved", label: "Saved" },
];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">

    {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-[#E5BA73]/10 rounded-lg flex items-center justify-center text-[#E5BA73]">
          <TrainFront className="w-5 h-5" />
        </div>
        <span className="text-[#17048f] font-serif text-xl font-medium tracking-wide">
          Paper<span className="text-[#E5BA73]">Pilot</span>
        </span>
      </div>

  {/* Center - Navigation */}
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

  {/* Right - Actions */}
  <div className="flex items-center gap-4 min-w-[180px] justify-end">
    <NavLink
      to="/upload"
      className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <UploadCloud className="w-4 h-4 text-slate-500" />
      <span>Upload</span>
    </NavLink>

    <button className="w-9 h-9 bg-slate-900 text-white font-semibold text-sm rounded-full flex items-center justify-center">
      JD
    </button>
  </div>

</header>
  );
}
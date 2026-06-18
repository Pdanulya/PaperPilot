import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  Files,
  Search,
  Bookmark,
  Clock,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "WORKSPACE",
      links: [
        {
          path: "/dashboard",
          title: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          path: "/upload",
          title: "Upload Document",
          icon: UploadCloud,
        },
      ],
    },
    {
      label: "LIBRARY",
      links: [
        {
          path: "/documents",
          title: "All Documents",
          icon: Files,
        },
        {
          path: "/search",
          title: "Search",
          icon: Search,
        },
        {
          path: "/saved",
          title: "Saved Items",
          icon: Bookmark,
        },
      ],
    },
  ];

  const recents = [
    {
      id: 1,
      title: "Annual Report 2024",
    },
    {
      id: 2,
      title: "Contract_NDA.pdf",
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1B33] text-white flex flex-col h-screen sticky top-0">

      <div className="flex-1 overflow-y-auto p-4">

        {menuItems.map((section) => (
          <div key={section.label} className="mb-6">

            <p className="px-4 mb-2 text-xs font-semibold tracking-widest text-slate-400">
              {section.label}
            </p>

            <div className="space-y-1">

              {section.links.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      active
                        ? "bg-[#E5BA73]/10 text-[#E5BA73]"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </button>
                );
              })}

            </div>

          </div>
        ))}

        {/* Recent */}
        <div className="mt-6">

          <p className="px-4 mb-2 text-xs font-semibold tracking-widest text-slate-400">
            RECENT
          </p>

          <div className="space-y-1">
            {recents.map((doc) => (
              <button
                key={doc.id}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <Clock className="w-4 h-4" />
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>

        </div>

      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => navigate("/upload")}
          className="w-full bg-[#f6f5f3] hover:bg-[#E5BA73] text-[#0B1B33] font-semibold py-3 rounded-xl transition"
        >
          + New Upload
        </button>
      </div>

    </aside>
  );
}
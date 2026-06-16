import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Documents", path: "/documents" },
  { label: "Saved", path: "/saved" },
];

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials for avatar
  const initials = user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <nav className="bg-white border-b border-[var(--border)] flex items-center justify-between px-10 h-[62px] sticky top-0 z-50">
      {/* Brand */}
      <a
        href="/dashboard"
        className="flex items-center gap-2.5 no-underline"
        onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}
      >
        <div className="w-[34px] h-[34px] bg-[var(--navy)] rounded-lg flex items-center justify-center">
          <i className="ti ti-files text-[var(--gold-light)] text-lg" />
        </div>
        <span
          className="font-[var(--font-display)] font-medium text-xl text-[var(--navy)] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Docu<span className="text-[var(--accent)]">AI</span>
        </span>
      </a>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`
                px-3.5 py-1.5 rounded-[10px] text-sm cursor-pointer transition-all duration-150 border-0 font-[var(--font-body)]
                ${active
                  ? "text-[var(--accent)] bg-[var(--accent-muted)] font-medium"
                  : "text-[var(--text-muted)] bg-transparent hover:text-[var(--text)] hover:bg-[var(--surface)]"
                }
              `}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        {/* Avatar with dropdown hint */}
        <div className="relative group">
          <div className="w-[34px] h-[34px] rounded-full bg-[var(--navy-light)] flex items-center justify-center text-xs font-medium text-[#B8D4F0] cursor-pointer select-none">
            {initials}
          </div>
          {/* Logout on hover */}
          <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded-[10px] shadow-[var(--shadow)] p-1 min-w-[140px] hidden group-hover:block z-50">
            <div className="px-3 py-1.5 text-xs text-[var(--text-light)] truncate border-b border-[var(--border)] mb-1">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <i className="ti ti-logout mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
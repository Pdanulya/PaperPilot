import { useNavigate, useLocation } from "react-router-dom";

const sections = [
  {
    label: "Workspace",
    items: [
      { icon: "ti-layout-dashboard", label: "Dashboard", path: "/dashboard" },
      { icon: "ti-files", label: "All Documents", path: "/documents" },
      { icon: "ti-bookmark", label: "Saved", path: "/saved" },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: "ti-clock-hour-4", label: "Recent", path: "/recent" },
      { icon: "ti-search", label: "Search", path: "/search" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-[248px] min-w-[248px] bg-white border-r border-[var(--border)] py-6 px-4 flex flex-col gap-1 overflow-y-auto">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-[11px] font-medium text-[var(--text-light)] tracking-widest uppercase px-2.5 pt-3.5 pb-1.5">
            {section.label}
          </p>
          {section.items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm cursor-pointer transition-all duration-150 border-0 font-[var(--font-body)] text-left
                  ${active
                    ? "bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-muted)] bg-transparent hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  }
                `}
              >
                <i className={`ti ${item.icon} text-base`} />
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
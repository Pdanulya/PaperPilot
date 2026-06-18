// import { useNavigate, useLocation } from "react-router-dom";

// const sections = [
//   {
//     label: "Workspace",
//     items: [
//       { icon: "ti-layout-dashboard", label: "Dashboard", path: "/dashboard" },
//       { icon: "ti-files", label: "All Documents", path: "/documents" },
//       { icon: "ti-bookmark", label: "Saved", path: "/saved" },
//     ],
//   },
//   {
//     label: "Tools",
//     items: [
//       { icon: "ti-clock-hour-4", label: "Recent", path: "/recent" },
//       { icon: "ti-search", label: "Search", path: "/search" },
//     ],
//   },
// ];

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <aside className="w-[248px] min-w-[248px] bg-white border-r border-[var(--border)] py-6 px-4 flex flex-col gap-1 overflow-y-auto">
//       {sections.map((section) => (
//         <div key={section.label}>
//           <p className="text-[11px] font-medium text-[var(--text-light)] tracking-widest uppercase px-2.5 pt-3.5 pb-1.5">
//             {section.label}
//           </p>
//           {section.items.map((item) => {
//             const active = location.pathname === item.path;
//             return (
//               <button
//                 key={item.path}
//                 onClick={() => navigate(item.path)}
//                 className={`
//                   w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm cursor-pointer transition-all duration-150 border-0 font-[var(--font-body)] text-left
//                   ${active
//                     ? "bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
//                     : "text-[var(--text-muted)] bg-transparent hover:bg-[var(--surface)] hover:text-[var(--text)]"
//                   }
//                 `}
//               >
//                 <i className={`ti ${item.icon} text-base`} />
//                 {item.label}
//               </button>
//             );
//           })}
//         </div>
//       ))}
//     </aside>
//   );
// }

import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Files, 
  Search, 
  Bookmark,
  FileText,
  Clock
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'WORKSPACE' },
    { id: 'upload', label: 'Upload Document', icon: UploadCloud, section: 'WORKSPACE' },
    { id: 'documents', label: 'All Documents', icon: Files, section: 'LIBRARY' },
    { id: 'search', label: 'Search', icon: Search, section: 'LIBRARY' },
    { id: 'saved', label: 'Saved Items', icon: Bookmark, section: 'LIBRARY' },
  ];

  const recents = [
    { id: 'annual-report', label: 'Annual Report 2024' },
    { id: 'contract-nda', label: 'Contract_NDA.pdf' }
  ];

  const renderGroup = (sectionName) => (
    <div className="mb-6">
      <p className="px-4 text-xs font-semibold text-slate-400 tracking-wider mb-2">{sectionName}</p>
      <ul className="space-y-1">
        {menuItems
          .filter(item => item.section === sectionName)
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#E5BA73]/10 text-[#E5BA73]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );

  return (
    <aside className="w-64 bg-[#0B1B33] text-white flex flex-col h-screen sticky top-0 z-20 shadow-xl">
      {/* Brand Header
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-[#E5BA73]/10 rounded-lg flex items-center justify-center text-[#E5BA73]">
          <Files className="w-4 h-4" />
        </div>
        <span className="font-serif text-xl font-medium tracking-wide">
          Docu<span className="text-[#E5BA73]">AI</span>
        </span>
      </div> */}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderGroup('WORKSPACE')}
        {renderGroup('LIBRARY')}

        {/* Recent Items Shortcuts */}
        <div className="mt-4">
          <p className="px-4 text-xs font-semibold text-slate-400 tracking-wider mb-2">RECENT</p>
          <ul className="space-y-1">
            {recents.map((doc) => (
              <li key={doc.id}>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg text-left truncate">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                  <span className="truncate">{doc.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Primary Sidebar Quick-Action */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setCurrentPage('upload')}
          className="w-full bg-[#E5BA73] hover:bg-[#d4a962] text-[#0B1B33] font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <span>+ New Upload</span>
        </button>
      </div>
    </aside>
  );
}
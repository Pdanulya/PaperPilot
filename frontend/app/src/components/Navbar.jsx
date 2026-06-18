import React from 'react';
import { UploadCloud, Files } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'documents', label: 'Documents' },
    { id: 'search', label: 'Search' },
    { id: 'saved', label: 'Saved' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">

    {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-[#E5BA73]/10 rounded-lg flex items-center justify-center text-[#E5BA73]">
          <Files className="w-4 h-4" />
        </div>
        <span className="text-[#17048f] font-serif text-xl font-medium tracking-wide">
          Docu<span className="text-[#E5BA73]">AI</span>
        </span>
      </div>

  {/* Center - Navigation */}
  <nav className="flex items-center gap-3">
    {navTabs.map((tab) => {
      const isActive = currentPage === tab.id;

      return (
        <button
          key={tab.id}
          onClick={() => setCurrentPage(tab.id)}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            isActive
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>

  {/* Right - Actions */}
  <div className="flex items-center gap-4 min-w-[180px] justify-end">
    <button
      onClick={() => setCurrentPage("upload")}
      className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <UploadCloud className="w-4 h-4 text-slate-500" />
      <span>Upload</span>
    </button>

    <button className="w-9 h-9 bg-slate-900 text-white font-semibold text-sm rounded-full flex items-center justify-center">
      JD
    </button>
  </div>

</header>
  );
}
import React from 'react';
import { Bookmark, Clipboard, Calendar, Trash2 } from 'lucide-react';
// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function SavedItems() {
  const savedSnippets = [
    { 
      source: 'Legal_NDA_Final.pdf', 
      scope: 'Clause 4.2', 
      snippet: 'The receiving counterparty will maintain categorical security protocols over confidential insight pipelines for up to three calendar years following termination...', 
      date: 'Jun 14, 2026' 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      {/* <Navbar /> */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10">
          
          <div className="space-y-6 animate-fade-in">
            {/* Unified Page Header Layout */}
            <div className="flex items-center justify-between">
              <div>
                <h1 
                  className="text-[26px] font-medium text-[#0B1B33] font-serif" 
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Saved Notebook Extracts
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Review saved text blocks and annotations.
                </p>
              </div>
            </div>

            {/* Dynamic Grid View Container matching document collection widths */}
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
            >
              {savedSnippets.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0B1B33] truncate max-w-[65%]">
                        {item.source}
                      </span>
                      <span className="bg-[#E5BA73]/15 text-[#bfa065] font-semibold px-2.5 py-0.5 rounded-md tracking-wide">
                        {item.scope}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{item.snippet}"
                    </p>
                  </div>

                  {/* Card Actions & Meta Footer Section */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#E5BA73]" /> 
                      {item.date}
                    </span>
                    <button 
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                      title="Delete Extract"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
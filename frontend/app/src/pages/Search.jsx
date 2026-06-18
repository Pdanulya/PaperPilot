import React from 'react';
import { Search, Sparkles } from 'lucide-react';
// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function SearchDocuments() {
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
                  Semantic Document Search
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Query semantic matches or look up plain phrases across entire books.
                </p>
              </div>
            </div>

            {/* Premium Search Control Console Area */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  defaultValue="revenue targets Q3 2026 guidelines"
                  placeholder="Enter question, concept phrasing or string..." 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 shadow-[0_2px_4px_rgba(0,0,0,0.01)] text-[#0B1B33] transition-all"
                />
              </div>
              <button className="bg-[#0B1B33] hover:bg-[#162a4a] text-white px-6 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors flex-shrink-0 shadow-sm cursor-pointer">
                <Sparkles className="w-4 h-4 text-[#E5BA73]" />
                <span>Search</span>
              </button>
            </div>

            {/* Structured Results Stack Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Extracted Context Matches
              </h3>
              
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#0B1B33] hover:underline cursor-pointer">
                    Quarterly_Report_Draft.pdf
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="bg-[#F4F6F8] px-2 py-0.5 rounded text-slate-500 font-medium border border-slate-200/40">
                    Page 14
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  "...Adjusted outlook indices confirm{" "}
                  <mark className="bg-[#E5BA73]/20 text-[#0B1B33] px-1 font-semibold rounded">
                    revenue targets Q3 2026 guidelines
                  </mark>{" "}
                  remain safely within the 14% margins, surpassing early thresholds set during the internal audit phase..."
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
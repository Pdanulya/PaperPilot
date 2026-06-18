import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Loader2 } from 'lucide-react';
// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function UploadDocument() {
  const [dragActive, setDragActive] = useState(false);
  
  // Simulated tracking state for files being processed
  const [tasks] = useState([
    { name: 'Financial_Statement_Q2.pdf', progress: 100, done: true },
    { name: 'Vendor_Agreement_Draft.docx', progress: 45, done: false }
  ]);

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
                  Upload Documents
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Import knowledge assets to feed your AI context matrix.
                </p>
              </div>
            </div>

            {/* Premium Interactive Drag & Drop Box Area */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] cursor-pointer ${
                dragActive ? 'border-[#E5BA73] bg-[#E5BA73]/5' : 'border-slate-200/80 hover:border-[#0B1B33]'
              }`}
            >
              <div className="w-12 h-12 bg-[#0B1B33]/5 text-[#0B1B33] rounded-xl flex items-center justify-center mb-4 transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-[#0B1B33]">Drag and drop your file assets here</h3>
              <p className="text-sm text-slate-400 mt-1">Accepts document structures up to 25MB each</p>

              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                {['PDF', 'DOCX', 'TXT'].map(ext => (
                  <span 
                    key={ext} 
                    className="text-[10px] font-bold px-2.5 py-1 bg-[#F4F6F8] text-slate-600 rounded-md tracking-wider border border-slate-200/40"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            {/* Pipeline Upload Status Row Monitor tracking box */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Active Processing Pipeline
              </h3>
              <div className="space-y-4">
                {tasks.map((task, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-[#0B1B33] truncate">{task.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-slate-500">{task.progress}%</span>
                        {task.done ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-[#E5BA73] animate-spin" />
                        )}
                      </div>
                    </div>
                    {/* Unified progress track bar components */}
                    <div className="w-full bg-[#F4F6F8] h-1.5 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          task.done ? 'bg-emerald-500' : 'bg-[#0B1B33]'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
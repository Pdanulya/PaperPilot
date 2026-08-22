import React, { useRef, useState } from 'react';
import { documentsAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { UploadCloud } from 'lucide-react';
import Sidebar from "../components/Sidebar";

export default function UploadDocument() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef(null);
  const { showToast } = useApp();

  const handleFile = (file) => {
  if (!file) return;

  const allowed = [".pdf", ".docx", ".txt"];
  const ext = "." + file.name.split(".").pop().toLowerCase();

  if (!allowed.includes(ext)) {
    showToast("Only PDF, DOCX, and TXT files are allowed.", "error");
    return;
  }

  if (file.size > 25 * 1024 * 1024) {
    showToast("File size must be less than 25MB.", "error");
    return;
  }

  setFile(file);
};

const handleDrop = (e) => {
  e.preventDefault();
  setDragActive(false);
  handleFile(e.dataTransfer.files[0]);
};

const handleUpload = async () => {
  if (!file || uploading) return;

  setUploading(true);

  try {
    await documentsAPI.upload(file);

    showToast("Document uploaded successfully!", "success");
    setFile(null);
  } catch (err) {
    showToast(err.message || "Upload failed.", "error");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
   
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

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {/* Premium Interactive Drag & Drop Box Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] cursor-pointer ${
                  dragActive ? 'border-[#E5BA73] bg-[#E5BA73]/5' : 'border-slate-200/80 hover:border-[#0B1B33]'
                }`}
              >
            
            
              <div className="w-12 h-12 bg-[#0B1B33]/5 text-[#0B1B33] rounded-xl flex items-center justify-center mb-4 transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              {file ? (
                <>
                  <h3 className="text-base font-medium text-[#0B1B33]">
                    {file.name}
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    {file.name.split(".").pop().toUpperCase()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-medium text-[#0B1B33]">
                    Drag and drop your file assets here
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Accepts document structures up to 25MB each
                  </p>
                </>
              )}
              
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

            {/* Upload Button */}
            {file && (
              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-[#0B1B33] hover:bg-[#162a4a] text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            )}
            </div>

           

        </main>
      </div>
    </div>
  );
}
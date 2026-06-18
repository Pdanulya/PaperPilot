import { useState, useRef } from "react";
import { documentsAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import Button from "./Button";

export default function UploadModal({ onClose, onSuccess }) {
  const { showToast } = useApp();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    const allowed = [".pdf", ".docx", ".txt"];
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      showToast("Only PDF, DOCX, and TXT allowed", "error");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await documentsAPI.upload(file);
      showToast("Document uploaded successfully!", "success");
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    /* Backdrop overlay */
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-[#0B1B33] font-serif">
            Upload Document
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 border-0 bg-transparent cursor-pointer transition-colors"
          >
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        {/* Drop zone styled to match premium theme metrics */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 mb-5
            ${dragging
              ? "border-[#E5BA73] bg-[#E5BA73]/5"
              : "border-slate-200 hover:border-[#0B1B33] hover:bg-slate-50/50"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          <i className={`ti ti-cloud-upload text-4xl mb-3 block transition-colors ${file ? 'text-[#E5BA73]' : 'text-slate-300'}`} />
          
          {file ? (
            <div>
              <p className="text-sm font-semibold text-[#0B1B33] truncate max-w-xs mx-auto">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500">
                Drag & drop or <span className="text-[#0B1B33] font-semibold underline decoration-[#E5BA73] decoration-2">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1.5">PDF, DOCX, TXT up to 25MB</p>
            </div>
          )}
        </div>

        {/* Action Controls Cluster */}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 font-medium text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!file}
            loading={uploading}
            icon="ti-upload"
            className="bg-[#0B1B33] hover:bg-[#162a4a] text-white rounded-xl font-medium px-4 text-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
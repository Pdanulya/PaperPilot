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
    // Backdrop
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-[var(--shadow-lg)] w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-[var(--font-display)] text-lg font-medium text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
            Upload Document
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface)] text-[var(--text-light)] border-0 bg-transparent cursor-pointer"
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 mb-4
            ${dragging
              ? "border-[var(--accent)] bg-[var(--accent-muted)]"
              : "border-[var(--border-strong)] hover:border-[var(--accent)] hover:bg-[var(--surface)]"
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
          <i className="ti ti-cloud-upload text-4xl text-[var(--text-light)] mb-3 block" />
          {file ? (
            <div>
              <p className="text-sm font-medium text-[var(--accent)]">{file.name}</p>
              <p className="text-xs text-[var(--text-light)] mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[var(--text-muted)]">
                Drag & drop or <span className="text-[var(--accent)] font-medium">browse</span>
              </p>
              <p className="text-xs text-[var(--text-light)] mt-1">PDF, DOCX, TXT supported</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!file}
            loading={uploading}
            icon="ti-upload"
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { FileText, Loader2, Eye } from "lucide-react";
import { useParams } from "react-router-dom";
import { documentsAPI } from "../services/api";
import Markdown from "../components/Markdown";

export default function SharedDocument() {
  const { token } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSharedDocument();
  }, [token]);

  const loadSharedDocument = async () => {
    try {
      const data = await documentsAPI.getShared(token);
      setDocument(data);
    } catch (err) {
      console.error("Failed to load shared document:", err);
      setError(
        err.response?.data?.detail || "This shared document could not be found."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-[#E5BA73]" />
          Loading shared document...
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-[#0B1B33]">
            Document unavailable
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {error || "This shared document is no longer available."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#E5BA73]" />
            <div>
              <h1 className="text-xl font-semibold text-[#0B1B33]">
                PaperPilot
              </h1>
              <p className="text-xs text-slate-400">
                Shared Document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Eye className="w-4 h-4" />
            View only
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Document information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5BA73]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#bfa065]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0B1B33]">
                {document.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {document.file_type?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Document */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0B1B33] mb-4">
            Document
          </h2>
          <div className="text-sm text-slate-700 leading-7">
            {document.raw_text || "No document text available."}
          </div>
        </div>

        {/* Summary */}
        {document.summary && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B33] mb-4">
              AI Summary
            </h2>
            <Markdown content={document.summary} />
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-400">
        Shared securely through PaperPilot
      </footer>
    </div>
  );
}
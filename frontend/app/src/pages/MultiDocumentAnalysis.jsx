import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";import {
  Search,
  FileText,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { documentsAPI } from "../services/api";
import Markdown from "../components/Markdown";

export default function MultiDocumentAnalysis() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparison, setComparison] = useState("");
  const [query, setQuery] = useState("");
  const [showAllDocs, setShowAllDocs] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await documentsAPI.getAll();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id)
        ? prev.filter((docId) => docId !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev
    );
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  // Show only 5 unless user chooses to view all
  const visibleDocuments = showAllDocs
    ? filteredDocuments
    : filteredDocuments.slice(0, 5);

  const handleCompare = async () => {
    if (selectedDocs.length < 2 || !query.trim()) return;

    setComparing(true);
    setComparison("");

    try {
      const data = await documentsAPI.compare(selectedDocs, query);

      console.log("Comparison response:", data);

      // Backend returns { answer: ... }
      setComparison(data.answer);
    } catch (err) {
      console.error("Comparison failed:", err);
      setComparison(
        "Sorry, I couldn't compare the selected documents. Please try again."
      );
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-10">
          <div className="space-y-6 animate-fade-in">

            {/* ================= HEADER ================= */}
            <div>
              <h1
                className="text-[26px] font-medium text-[#0B1B33] font-serif"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Multi-Document Analysis
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Select multiple documents and analyze them together.
              </p>
            </div>

            {/* ================= DOCUMENT SELECTION ================= */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">

              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#0B1B33]">
                    Select Documents
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Select up to 5 documents for analysis.
                  </p>
                </div>

                <span className="text-xs font-medium text-slate-500">
                  {selectedDocs.length}/5 selected
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search documents…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-sm text-[#0B1B33] outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
                />
              </div>

              {/* DOCUMENT SCROLL AREA */}
              <div
                className={`space-y-2 ${
                  showAllDocs
                    ? "max-h-[420px]"
                    : "max-h-[300px]"
                } overflow-y-auto pr-1`}
              >
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-[#E5BA73]" />
                  </div>
                ) : visibleDocuments.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    No documents found.
                  </div>
                ) : (
                  visibleDocuments.map((doc) => {
                    const selected = selectedDocs.includes(doc.id);

                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleDocument(doc.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? "border-[#E5BA73] bg-[#E5BA73]/5"
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selected
                              ? "bg-[#E5BA73]/10 text-[#bfa065]"
                              : "bg-[#0B1B33]/5 text-[#0B1B33]"
                          }`}
                        >
                          {selected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>

                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0B1B33] truncate">
                            {doc.title}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            {doc.file_type?.toUpperCase()}
                          </p>
                        </div>

                        {/* Selected indicator */}
                        {selected && (
                          <span className="text-[10px] font-semibold text-[#bfa065]">
                            SELECTED
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* VIEW MORE */}
              {!loading &&
                filteredDocuments.length > 5 && (
                  <button
                    onClick={() => setShowAllDocs(!showAllDocs)}
                    className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-[#0B1B33] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    {showAllDocs ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View More Documents
                      </>
                    )}
                  </button>
                )}
            </div>

            {/* ================= QUESTION ================= */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">

              <label className="text-sm font-semibold text-[#0B1B33]">
                What would you like to know?
              </label>

              <p className="text-xs text-slate-400 mt-1">
                Ask a question about the selected documents.
              </p>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Compare the main objectives, technologies, and methodologies of these documents..."
                rows={4}
                className="w-full mt-4 px-4 py-3 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-sm text-[#0B1B33] outline-none resize-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
              />

              {/* Compare Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCompare}
                  disabled={
                    selectedDocs.length < 2 ||
                    !query.trim() ||
                    comparing
                  }
                  className="bg-[#0B1B33] hover:bg-[#162a4a] text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 transition-all"
                >
                  {comparing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Comparing...
                    </span>
                  ) : (
                    "Compare Documents"
                  )}
                </button>
              </div>
            </div>

            {/* ================= COMPARISON RESULT ================= */}
            {comparison && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#0B1B33]">
                    Comparison Result
                  </h2>

                  <span className="text-xs text-slate-400">
                    {selectedDocs.length} documents analyzed
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <Markdown content={comparison} /> 
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
import React from 'react';
import { Bookmark, Clipboard, Calendar, Trash2 } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { libraryAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function SavedItems() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const data = await libraryAPI.getSaved();

      console.log(data);

      setSavedDocuments(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (documentId) => {
    try {
      await libraryAPI.unsave(documentId);

      showToast("Removed from saved", "success");

      fetchSaved(); // Refresh the page
    } catch (err) {
      showToast(err.message, "error");
    }
  };

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
                  Saved Documents
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Review saved ..................
                </p>
              </div>
            </div>

            {/* Dynamic Grid View Container matching document collection widths */}
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
            >
              {loading ? (
                <p className="text-slate-500">Loading...</p>
              ) : savedDocuments.length === 0 ? (
                <p className="text-slate-500">No saved documents yet.</p>
              ) : (
                savedDocuments.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/document/${item.document_id}`)}
                    className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0B1B33] truncate max-w-[65%]">
                          {item.document_title}
                        </span>

                        <span className="bg-[#E5BA73]/15 text-[#bfa065] font-semibold px-2.5 py-0.5 rounded-md tracking-wide">
                          {item.document_file_type}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                        {item.document_preview}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-5">
                      <span className="text-xs text-slate-400">
                        {new Date(item.saved_at).toLocaleDateString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnsave(item.document_id);
                        }}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Unsave
                      </button>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
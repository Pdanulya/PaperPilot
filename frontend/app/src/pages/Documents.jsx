import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DocCard from "../components/DocCard";
import Button from "../components/Button";
import { documentsAPI, libraryAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { Search } from "lucide-react";

export default function Documents() {
  const { showToast, openUpload } = useApp();
  const [documents, setDocuments] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  // const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [docs, saved] = await Promise.all([
        documentsAPI.getAll(),
        libraryAPI.getSaved(),
      ]);
      setDocuments(docs);
      setSavedIds(new Set(saved.map((s) => s.document_id)));
    } catch (err) {
      showToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;

    try {
      await documentsAPI.delete(id);

      // ✅ remove from UI instantly (optimistic update)
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));

      // also update saved IDs if needed
      setSavedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      showToast("Document deleted", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSave = async (id, isSaved) => {
    try {
      if (isSaved) {
        await libraryAPI.unsave(id);

        // update local state instantly
        setSavedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        showToast("Removed from saved", "success");
      } else {
        await libraryAPI.save(id);

        setSavedIds((prev) => new Set(prev).add(id));

        showToast("Saved!", "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Client-side filter by title
  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

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
                  Documents
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {documents.length} document{documents.length !== 1 ? "s" : ""} in your workspace
                </p>
              </div>
              
            </div>

            {/* Styled Dynamic Search Bar */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-sm text-[#0B1B33] outline-none shadow-[0_2px_4px_rgba(0,0,0,0.01)] focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
              />
            </div>

            {/* Grid View & Pipeline Fallbacks */}
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <div className="spinner" style={{ borderColor: "rgba(11,27,51,0.1)", borderTopColor: "#0B1B33" }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <i className="ti ti-file-off text-4xl text-slate-300 mb-3 block" />
                <p className="text-sm font-medium text-slate-600">
                  {search ? "No documents match your search query" : "No documents yet"}
                </p>
                {!search && (
                  <Button
                    variant="primary"
                    className="mt-4 bg-[#0B1B33] hover:bg-[#162a4a] text-white"
                    onClick={() => setShowUpload(true)}
                    icon="ti-upload"
                  >
                    Upload your first document
                  </Button>
                )}
              </div>
            ) : (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
              >
                {filtered.map((doc) => (
                  <DocCard
                    key={doc.id}
                    doc={doc}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    isSaved={savedIds.has(doc.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DocCard from "../components/DocCard";
import UploadModal from "../components/UploadModal";
import Button from "../components/Button";
import { documentsAPI, libraryAPI } from "../services/api";
import { useApp } from "../context/AppContext";

export default function Documents() {
  const { showToast } = useApp();
  const [documents, setDocuments] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [showUpload, setShowUpload] = useState(false);
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
      showToast("Document deleted", "success");
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSave = async (id, isSaved) => {
    try {
      if (isSaved) await libraryAPI.unsave(id);
      else await libraryAPI.save(id);
      showToast(isSaved ? "Removed from saved" : "Saved!", "success");
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Client-side filter by title
  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-2xl font-medium text-[var(--text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Documents
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {documents.length} document{documents.length !== 1 ? "s" : ""} in your workspace
              </p>
            </div>
            <Button variant="primary" icon="ti-plus" onClick={() => setShowUpload(true)}>
              Upload
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 max-w-sm">
            <i className="ti ti-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="Search documents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-[10px] border border-[var(--border-strong)] text-sm bg-white placeholder:text-[var(--text-light)] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner" style={{ borderColor: "var(--border-strong)", borderTopColor: "var(--accent)" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-2xl">
              <i className="ti ti-file-off text-4xl text-[var(--text-light)] mb-3 block" />
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {search ? "No documents match your search" : "No documents yet"}
              </p>
              {!search && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setShowUpload(true)}
                  icon="ti-upload"
                >
                  Upload your first document
                </Button>
              )}
            </div>
          ) : (
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
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
        </main>
      </div>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchData} />
      )}
    </div>
  );
}
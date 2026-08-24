import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DocCard from "../components/DocCard";
import Button from "../components/Button";
import { documentsAPI, libraryAPI } from "../services/api";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { user, showToast, openUpload } = useApp();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total_documents: 0, total_saved: 0, total_chats_sent: 0, recently_opened: [] });
  const [documents, setDocuments] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dash, docs, saved] = await Promise.all([
        libraryAPI.getDashboard(),
        documentsAPI.getAll(),
        libraryAPI.getSaved(),
      ]);
      setStats(dash);
      setDocuments(docs);
      setSavedIds(new Set(saved.map((s) => s.document_id)));
    } catch (err) {
      showToast("Failed to load data", "error");
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
      if (isSaved) {
        await libraryAPI.unsave(id);
        showToast("Removed from saved", "success");
      } else {
        await libraryAPI.save(id);
        showToast("Saved!", "success");
      }
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };
  // console.log("Current user:", user);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      {/* <Navbar /> */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10">

          {/* Hero Banner matched perfectly to Left Login Panel */}
          <div className="bg-[#0B1B33] rounded-2xl p-9 mb-8 relative overflow-hidden shadow-sm">

            <p className="text-[13px] text-slate-400 uppercase tracking-wider mb-1.5 relative font-semibold">
              {greeting()}, {user?.name}
            </p>
            <h1
              className="text-[28px] font-normal text-white leading-tight mb-2 relative font-serif"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your <span className="italic text-[#E5BA73]">document intelligence</span> workspace
            </h1>
            <p className="text-sm text-slate-400 mb-6 relative">
              Upload, analyse, chat - everything in one place.
            </p>

            {/* Stats row */}
            <div className="flex gap-12 relative border-t border-slate-800/60 pt-5">
              {[
                { num: stats.total_documents, label: "Documents" },
                { num: stats.total_saved, label: "Saved" },
                { num: stats.total_chats_sent, label: "Chats sent" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-[26px] font-light text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.num}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent section */}
          {stats.recently_opened?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-[16px] font-medium text-[#0B1B33]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Recently opened
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {stats.recently_opened.map((r) => (
                  <button
                    key={r.document_id}
                    onClick={() => navigate(`/document/${r.document_id}`)}
                    className="flex items-center gap-2.5 bg-white border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:border-[#0B1B33] hover:text-[#0B1B33] transition-all whitespace-nowrap cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
                  >
                    <i className="ti ti-clock-hour-4 text-[#E5BA73] text-base" />
                    {r.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Documents */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[17px] font-medium text-[#0B1B33] font-serif"
                style={{ fontFamily: "var(--font-display)" }}
              >
                All documents
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <div className="spinner" style={{ borderColor: "var(--border-strong)", borderTopColor: "#0B1B33" }} />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <i className="ti ti-file-plus text-4xl text-slate-300 mb-3 block" />
                <p className="text-sm font-medium text-slate-600">No documents yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Upload a PDF, DOCX, or TXT to get started</p>
                <Button 
                  variant="primary" 
                  onClick={openUpload} 
                  icon="ti-upload"
                  className="bg-[#0B1B33] hover:bg-[#162a4a] text-white"
                >
                  Upload your first document
                </Button>
              </div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {documents.map((doc) => (
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
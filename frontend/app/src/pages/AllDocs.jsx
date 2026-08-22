import React from 'react';
import { FileText, Filter, UploadCloud } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import { documentsAPI } from "../services/api";

export default function AllDocuments({ setCurrentPage }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const data = await documentsAPI.getAll();

      console.log("Documents:", data);

      setDocuments(data);

    } catch (err) {
      console.error("Failed to load documents:", err);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
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
                  All Documents
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {documents.length} document{documents.length !== 1 ? "s" : ""} in your workspace
                </p>
              </div>
              
              {/* Premium Dynamic Toolbar Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 border border-slate-200 bg-white hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span>Filter</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('upload')}
                  className="flex items-center gap-2 bg-[#0B1B33] hover:bg-[#162a4a] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Premium Document Cards Grid list layout */}
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
            >
              {documents.map((doc, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-xl p-5 relative hover:border-[#0B1B33] hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all cursor-pointer group"
                >
                  {/* Styled Icon Wrapper Box using Identity Color */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#0B1B33]/5 text-[#0B1B33] border border-slate-100/50 transition-colors group-hover:bg-[#E5BA73]/10 group-hover:text-[#E5BA73]">
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  {/* Dynamic Status Tags matching Workspace System Design */}
                  {doc.tag && (
                    <span className={`absolute top-5 right-5 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider border ${
                      doc.tag === 'New' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {doc.tag.toUpperCase()}
                    </span>
                  )}
                  
                  <h3 className="font-medium text-[#0B1B33] text-sm mb-1 truncate group-hover:text-[#E5BA73] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{doc.size} · {doc.pages}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
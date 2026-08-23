import React, {useState, useEffect} from "react";
import {FileText, ArrowLeft} from "lucide-react";
import Sidebar from "../components/Sidebar";
import {useParams, useNavigate} from "react-router-dom";

import { documentsAPI } from "../services/api";

import DocumentSummary from "../components/DocumentSummary";
import DocumentSearch from "../components/DocumentSearch";
import DocumentChat from "../components/DocumentChat";

export default function DocumentWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const data =
        await documentsAPI.getOne(id);
      console.log(data);
      setDocument(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Document not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 p-10">
          {/* ================= HEADER ================= */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() =>
                navigate("/documents")
              }
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <FileText className="text-[#E5BA73]" />
              <div>
                <h1 className="text-2xl font-serif">
                  {document.title}
                </h1>
                <p className="text-sm text-slate-500">
                  {document.file_type.toUpperCase()}
                  {" • "}
                  Uploaded{" "}
                  {new Date(
                    document.uploaded_at
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex-1 flex flex-col gap-6 min-h-0">
            {/* DOCUMENT VIEWER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0B1B33] mb-4">
                Document
              </h2>

              <div
                className={`${
                  expanded
                    ? ""
                    : "max-h-[450px]"
                } overflow-hidden`}
              >
                <pre className="whitespace-pre-wrap leading-7 text-sm text-slate-700 font-sans">
                  {document.raw_text ||
                    "No text extracted from this document."}

                </pre>

              </div>

              <div className="flex justify-center mt-5">

                <button
                  onClick={() =>
                    setExpanded(!expanded)
                  }
                  className="text-[#0B1B33] font-medium hover:underline"
                >
                  {expanded
                    ? "Show Less"
                    : "Read More"}
                </button>
              </div>
            </div>
            {/* SEARCH */}
            <DocumentSearch
              documentId={id}
            />

            {/* SUMMARY */}
            <DocumentSummary
              documentId={id}
            />

            {/* CHAT + DOWNLOAD HISTORY */}
            <DocumentChat
              documentId={id}
              documentTitle={document.title}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
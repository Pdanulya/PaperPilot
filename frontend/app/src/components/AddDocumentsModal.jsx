import React, { useEffect, useState } from "react";
import { X,Search,FileText,Check,Loader2,} from "lucide-react";

import { documentsAPI, workspacesAPI } from "../services/api";

export default function AddDocumentsModal({
  workspaceId,
  existingDocuments = [],
  onClose,
  onAdded,
}) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await documentsAPI.getAll();

      // Get IDs of documents already inside this workspace
      const existingIds = existingDocuments.map((doc) => doc.id);

      // Only show documents that are NOT already in workspace
      const availableDocuments = data.filter(
        (doc) => !existingIds.includes(doc.id)
      );

      setDocuments(availableDocuments);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = (documentId) => {
    setSelectedDocs((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDocuments = async () => {
    if (selectedDocs.length === 0) return;

    setAdding(true);

    try {
      // Add all selected documents to workspace
      await Promise.all(
        selectedDocs.map((documentId) =>
          workspacesAPI.addDocument(
            workspaceId,
            documentId
          )
        )
      );

      // Tell parent component to reload workspace
      await onAdded();
      onClose();
    } catch (err) {
      console.error("Failed to add documents:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-[#0B1B33]">
              Add Documents
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Select documents to add to this workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={adding}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-5 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your documents..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0B1B33] outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="max-h-[400px] overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#E5BA73]" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-3" />

              <p className="text-sm text-slate-500">
                No available documents found.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => {
                const selected = selectedDocs.includes(doc.id);

                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toggleDocument(doc.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                      ${
                        selected
                          ? "border-[#E5BA73] bg-[#E5BA73]/5"
                          : "border-slate-100 hover:border-slate-300"
                      }
                    `}
                  >

                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                        ${
                          selected
                            ? "bg-[#E5BA73]/15 text-[#bfa065]"
                            : "bg-[#0B1B33]/5 text-[#0B1B33]"
                        }
                      `}
                    >
                      {selected ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-[#0B1B33] truncate">
                        {doc.title}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {doc.file_type?.toUpperCase()}
                      </p>
                    </div>

                    {selected && (
                      <span className="text-[10px] font-semibold text-[#bfa065]">
                        SELECTED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {selectedDocs.length} document
            {selectedDocs.length !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={adding}
              className="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleAddDocuments}
              disabled={selectedDocs.length === 0 || adding}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1B33] text-white text-sm font-medium hover:bg-[#162a4a] disabled:opacity-40 transition-all"
            >
              {adding && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Add Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
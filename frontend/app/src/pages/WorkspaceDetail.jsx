import React, { useEffect, useState } from "react";
import {ArrowLeft,Folder,FileText,Loader2,Plus,Trash2,MoreVertical,Edit3,} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { workspacesAPI } from "../services/api";
import AddDocumentsModal from "../components/AddDocumentsModal";

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDocuments, setShowAddDocuments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  const loadWorkspace = async () => {
    try {
      const data = await workspacesAPI.getDocuments(id);
      setWorkspace(data);
    } catch (err) {
      console.error("Failed to load workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDocument = async (documentId) => {
    const confirmed = window.confirm(
        "Remove this document from the workspace?"
    );

    if (!confirmed) return;

    try {
        await workspacesAPI.removeDocument(
        workspace.id,
        documentId
        );

        // Remove immediately from UI
        setWorkspace((prev) => ({
        ...prev,
        documents: prev.documents.filter(
            (doc) => doc.id !== documentId
        ),
        }));

    } catch (err) {
        console.error(
        "Failed to remove document from workspace:",
        err
        );
    }
    };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F4F6F8]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#E5BA73]" />
        </main>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen bg-[#F4F6F8]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">
            Workspace not found.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      <Sidebar />
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/workspaces")}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Folder className="w-6 h-6 text-[#E5BA73]" />
              <div>

                <h1
                  className="text-[26px] font-medium text-[#0B1B33]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {workspace.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {workspace.description || "No description"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddDocuments(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B33]
            text-white text-sm font-medium hover:bg-[#162a4a]"
          >
            <Plus className="w-4 h-4" />
            Add Documents
          </button>
          <div className="relative">

          <button
            onClick={() => setShowActions(!showActions)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200
                      flex items-center justify-center
                      hover:bg-slate-50 transition-all"
          >
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </button>

          {showActions && (

            <div
              className="absolute right-0 top-12 w-44 bg-white
                        border border-slate-200 rounded-xl shadow-lg
                        overflow-hidden z-20"
            >

              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3
                          text-sm text-[#0B1B33]
                          hover:bg-slate-50 text-left"
              >
                <Edit3 className="w-4 h-4" />
                Edit Workspace
              </button>

              <button
                onClick={handleDeleteWorkspace}
                className="w-full flex items-center gap-2 px-4 py-3
                          text-sm text-red-500
                          hover:bg-red-50 text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete Workspace
              </button>

            </div>

          )}

        </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">

            <h2 className="text-base font-semibold text-[#0B1B33]">
              Documents
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {workspace.documents?.length || 0} documents in this workspace
            </p>
          </div>
          {workspace.documents?.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">
                No documents in this workspace yet.
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Add documents to start organizing your work.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {workspace.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0B1B33]/5 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#0B1B33]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0B1B33] truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {doc.file_type?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {showAddDocuments && (
        <AddDocumentsModal
            workspaceId={workspace.id}
            existingDocuments={workspace.documents || []}
            onClose={() => setShowAddDocuments(false)}
            onAdded={loadWorkspace}
        />
        )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import {
  Folder,
  Plus,
  Loader2,
  FileText,
  ArrowRight
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { workspacesAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";

export default function Workspaces() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await workspacesAPI.getAll(); // Fetch workspaces from the API
      setWorkspaces(data);
    } catch (err) {
      console.error("Failed to load workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      <Sidebar />
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-[26px] font-medium text-[#0B1B33]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Workspaces
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Organize your documents into separate projects and collections.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B33] text-white text-sm font-medium
                       hover:bg-[#162a4a] transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Workspace
          </button>
        </div>

        {/* Workspace list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#E5BA73]" />
          </div>
        ) : workspaces.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Folder className="w-10 h-10 mx-auto text-slate-300 mb-4" />
            <h2 className="text-base font-semibold text-[#0B1B33]">
              No workspaces yet
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Create your first workspace to organize your documents.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() =>
                  navigate(`/workspaces/${workspace.id}`)
                }
                className="bg-white border border-slate-200/80
                           rounded-2xl p-5 cursor-pointer
                           hover:border-[#E5BA73]
                           hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]
                           transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#E5BA73]/10 flex items-center justify-center"
                  >
                    <Folder className="w-5 h-5 text-[#bfa065]" />
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-slate-300 group-hover:text-[#0B1B33] transition-all"
                  />
                </div>
                <h2 className="mt-5 text-base font-semibold text-[#0B1B33]">
                  {workspace.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {workspace.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      {showCreateModal && (
        <CreateWorkspaceModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(workspace) => {
            setWorkspaces((prev) => [workspace, ...prev]);
            }}
        />
        )}
    </div>
  );
}
import React, { useState } from "react";
import { X, Folder, Loader2 } from "lucide-react";
import { workspacesAPI } from "../services/api";

export default function CreateWorkspaceModal({
  onClose,
  onCreated
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!name.trim()) return;
    setCreating(true);
    try {
      const workspace = await workspacesAPI.create({ // Call the API to create a new workspace
        name: name.trim(),
        description: description.trim() || null
      });
      onCreated(workspace);
      onClose();
    } catch (err) {
      console.error("Failed to create workspace:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5BA73]/10 flex items-center justify-center">
              <Folder className="w-4 h-4 text-[#bfa065]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1B33]">
                Create Workspace
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Organize related documents together.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-[#0B1B33]">
              Workspace Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Research"
              className="w-full mt-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm 
              text-[#0B1B33] outline-none focus:border-[#0B1B33]"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#0B1B33]">
              Description
              <span className="text-slate-400 font-normal">
                {" "} (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              rows={3}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 text-sm
              text-[#0B1B33] outline-none resize-none focus:border-[#0B1B33]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || creating}
              className="px-5 py-2.5 rounded-xl bg-[#0B1B33] text-white text-sm
              font-medium disabled:opacity-40 flex items-center gap-2"
            >
              {creating && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
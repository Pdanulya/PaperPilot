import React, { useState } from "react";
import { X, Loader2, Pencil } from "lucide-react";
import { workspacesAPI } from "../services/api";

export default function EditWorkspaceModal({
  workspace,
  onClose,
  onUpdated,
}) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);

    try {
      const updatedWorkspace =
        await workspacesAPI.update(workspace.id, {
          name: name.trim(),
          description: description.trim() || null,
        });

      onUpdated(updatedWorkspace);

      onClose();

    } catch (err) {
      console.error("Failed to update workspace:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5BA73]/10 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-[#bfa065]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0B1B33]">
                Edit Workspace
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Update your workspace details.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[#0B1B33]">
              Workspace Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm
              outline-none focus:border-[#0B1B33]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-[#0B1B33]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={3}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none focus:border-[#0B1B33]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1B33] text-white
              text-sm font-medium disabled:opacity-40"
            >
              {saving && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import { X, Mail, Share2, Loader2 } from "lucide-react";
import { documentsAPI } from "../services/api";

export default function ShareDocumentModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
}) {

  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
        const response = await documentsAPI.share(documentId, {
        recipient_email: email.trim(),
        });

        console.log("Document shared:", response);

        alert("Document shared successfully!");

        setEmail("");
        onClose();

    } catch (err) {
        console.error("Failed to share document:", err);

        alert(
        err?.response?.data?.detail ||
        "Failed to share document. Please try again."
        );
    }
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B33]/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-[#0B1B33]" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#0B1B33]">
                Share Document
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Share with someone by email
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">

          <p className="text-sm text-slate-600 mb-5">
            Enter the email address of the person you want to share this
            document with. They will receive a link with view-only access.
          </p>

          <label className="block text-sm font-medium text-[#0B1B33] mb-2">
            Recipient email
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0B1B33] placeholder:text-slate-400 outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!email.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#0B1B33] text-white text-sm font-medium hover:bg-[#293953] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </span>
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}


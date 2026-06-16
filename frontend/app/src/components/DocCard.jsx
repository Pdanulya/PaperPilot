import { useNavigate } from "react-router-dom";

// Maps file extension to icon + color classes
const typeConfig = {
  ".pdf":  { icon: "ti-file-type-pdf", bg: "bg-[#FEF0EB]", color: "text-[#D85A30]" },
  ".docx": { icon: "ti-file-type-doc", bg: "bg-[#E6F1FB]", color: "text-[#185FA5]" },
  ".txt":  { icon: "ti-file-text",     bg: "bg-[#EAF3DE]", color: "text-[#3B6D11]" },
};

export default function DocCard({ doc, onDelete, onSave, isSaved }) {
  const navigate = useNavigate();
  const cfg = typeConfig[doc.file_type] || typeConfig[".txt"];

  // Format date like "Jun 3, 2026"
  const date = new Date(doc.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/document/${doc.id}`)}
      className="bg-white border border-[var(--border)] rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] hover:-translate-y-px relative group"
    >
      {/* File type icon */}
      <div className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center mb-3.5 ${cfg.bg} ${cfg.color} text-xl`}>
        <i className={`ti ${cfg.icon}`} />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[var(--text)] mb-1 truncate pr-6">
        {doc.title}
      </p>
      <p className="text-[11px] text-[var(--text-light)]">{date}</p>

      {/* Action buttons — shown on hover */}
      <div
        className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()} // prevent card navigation
      >
        <button
          onClick={() => onSave(doc.id, isSaved)}
          title={isSaved ? "Unsave" : "Save"}
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors border-0
            ${isSaved
              ? "bg-[var(--accent-muted)] text-[var(--accent)]"
              : "bg-[var(--surface)] text-[var(--text-light)] hover:text-[var(--accent)]"
            }`}
        >
          <i className={`ti ${isSaved ? "ti-bookmark-filled" : "ti-bookmark"}`} />
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          title="Delete"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-[var(--surface)] text-[var(--text-light)] hover:text-red-500 hover:bg-red-50 transition-colors border-0"
        >
          <i className="ti ti-trash" />
        </button>
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Bookmark,
  BookmarkCheck,
  FileText,
  File,
  FileType2,
} from "lucide-react";

const typeConfig = {
  ".pdf": { icon: FileText, bg: "bg-red-50", color: "text-red-500" },
  ".docx": { icon: FileType2, bg: "bg-blue-50", color: "text-blue-600" },
  ".txt": { icon: File, bg: "bg-green-50", color: "text-green-600" },
};

export default function DocCard({ doc, onDelete, onSave, isSaved }) {
  const navigate = useNavigate();

  const cfg = typeConfig[doc.file_type] || typeConfig[".txt"];
  const Icon = cfg.icon;

  const date = new Date(
    doc.uploaded_at || doc.created_at
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/document/${doc.id}`)}
      className="
        bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer
        transition-all duration-200
        hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5
        relative
      "
    >
      {/* ICON */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 ${cfg.bg}`}
      >
        <Icon className={`w-5 h-5 ${cfg.color}`} />
      </div>

      {/* TITLE */}
      <p className="text-sm font-semibold text-gray-800 mb-1 truncate pr-6">
        {doc.title}
      </p>

      {/* DATE */}
      <p className="text-xs text-gray-400">{date}</p>

      {/* ACTION BUTTONS (ALWAYS VISIBLE) */}
      <div
        className="absolute top-3 right-3 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SAVE / UNSAVE */}
        <button
          onClick={() => onSave(doc.id, isSaved)}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center border
            transition-all
            ${
              isSaved
                ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                : "bg-green-50 text-green-300 border-green-200 hover:bg-green-50 hover:text-green-500 hover:border-green-400"
            }
          `}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* DELETE */}
        <button
          onClick={() => onDelete(doc.id)}
          className="
            w-8 h-8 rounded-lg flex items-center justify-center border
            bg-red-50 text-red-300 border-red-200
            hover:text-red-500 hover:border-red-400
            transition-all
          "
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { documentsAPI } from "../services/api";
import Markdown from "./Markdown";

export default function DocumentSummary({ documentId }) {
  const [summary, setSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);

    try {
      const data = await documentsAPI.summary(documentId);

      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-[#0B1B33]">
          Summary
        </h2>

        <button
          onClick={handleGenerateSummary}
          disabled={generatingSummary}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B33] text-white hover:bg-[#293953] disabled:opacity-50"
        >
          {generatingSummary ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#E5BA73]" />
          )}

          Generate Summary
        </button>
      </div>

      {summary ? (
        <Markdown content={summary} />
      ) : (
        <div className="text-center py-12 text-slate-400">
          Click "Generate Summary" to create an AI summary.
        </div>
      )}
    </div>
  );
}
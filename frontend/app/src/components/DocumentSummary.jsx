import { useState } from "react";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import { documentsAPI } from "../services/api";
import Markdown from "./Markdown";

export default function DocumentSummary({ documentId }) {
    const [summary, setSummary] = useState("");
    const [summaryType, setSummaryType] = useState("standard");
    const [generating, setGenerating] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const summaryOptions = {
        brief: "Brief",
        standard: "Standard",
        detailed: "Detailed"
    };

    const handleGenerateSummary = async () => {
        setGenerating(true);

        try {
            const data = await documentsAPI.summary(documentId, summaryType);
            setSummary(data.summary);
        } catch (err) {
            console.error("Failed to generate summary:", err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                {/* Summary Title */}
                <div>
                    <h2 className="text-lg font-semibold text-[#0B1B33]">
                        Summary
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Generate an AI-powered summary of this document.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">

                    {/* Summary Length */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            disabled={generating}
                            className="flex items-center justify-between gap-3 w-32 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-[#0B1B33] hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>
                            {summaryOptions[summaryType]}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              dropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown */}
                        {dropdownOpen && (
                          <div className="absolute right-0 top-12 w-32 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 animate-fade-in">
                            {Object.entries(summaryOptions).map(
                              ([value, label], index) => (
                                <div key={value}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSummaryType(value);
                                      setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                      summaryType === value
                                      ? "bg-slate-50 text-[#0B1B33] font-medium"
                                      : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                    >
                                    {label}
                                  </button>
                                  {index <
                                    Object.keys(summaryOptions)
                                    .length -
                                    1 && (
                                      <div className="border-t border-slate-100" />
                                    )}
                                </div>
                                )
                                )}
                          </div>
                          )}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateSummary}
                        disabled={generating}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1B33] text-white text-sm font-medium hover:bg-[#162a4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {generating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        {generating
                            ? "Generating..."
                            : "Generate Summary"}
                    </button>
                </div>
            </div>

            {/* Summary Result */}
            {summary ? (
                <div className="border-t border-slate-100 mt-6 pt-5">
                    <Markdown content={summary} />
                </div>
            ) : (
                <div className="border-t border-slate-100 mt-6 pt-6 text-center text-slate-400">
                    <p className="text-sm">
                        Select a summary type from the dropdown and generate your summary.
                    </p>
                </div>
            )}
        </div>
    );
}
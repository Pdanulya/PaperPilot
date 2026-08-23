import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { documentsAPI } from "../services/api";
import Markdown from "./Markdown";

export default function DocumentSearch({ documentId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setSearching(true);
    setResults([]);
    setHasSearched(true);

    try {
      const data = await documentsAPI.search(documentId, query);

      setResults(data.chunks || []);
    } catch (err) {
      console.error("Failed to search document:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#0B1B33]">
          Search Within Document
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Search for information using AI-powered semantic search.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for something in this document..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-sm text-[#0B1B33] outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!query.trim() || searching}
          className="px-5 py-2.5 rounded-xl bg-[#0B1B33] text-white text-sm font-medium hover:bg-[#293953] disabled:opacity-40 flex items-center gap-2"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}

          Search
        </button>
      </form>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-6">

          <p className="text-sm font-medium text-[#0B1B33] mb-3">
            Relevant Results
          </p>

          <div className="space-y-3">
            {results.map((chunk, index) => (
              <div
                key={chunk.id || index}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
              >
                <Markdown content={chunk.content} />
              </div>
            ))}
          </div>

        </div>
      )}

      {/* No Results */}
      {hasSearched && !searching && results.length === 0 && (
        <div className="text-sm text-slate-400 text-center py-6">
          No relevant results found.
        </div>
      )}

    </div>
  );
}
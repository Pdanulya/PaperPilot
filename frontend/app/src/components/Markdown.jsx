import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }) {
  if (!content) return null;

  return (
    <div className="text-sm text-slate-700 leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold text-[#0B1B33] mt-5 mb-3">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-[#0B1B33] mt-5 mb-3">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-[#0B1B33] mt-4 mb-2">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 leading-7">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-[#0B1B33]">
              {children}
            </strong>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-6">
              {children}
            </li>
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto my-5 rounded-xl border border-slate-200">
              <table className="w-full text-sm border-collapse">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-[#F4F6F8]">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-[#0B1B33] border-b border-slate-200 whitespace-nowrap">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-600 border-b border-slate-100 align-top">
              {children}
            </td>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#E5BA73] pl-4 my-4 text-slate-600 italic">
              {children}
            </blockquote>
          ),

          code: ({ children }) => (
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
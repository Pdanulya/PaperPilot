// Generic card wrapper used across dashboard and document views
export default function Card({ children, className = "", onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-[var(--border)] rounded-2xl p-5
        ${hover ? "cursor-pointer transition-all duration-200 hover:border-[var(--accent)] hover:shadow-[var(--shadow)] hover:-translate-y-px" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
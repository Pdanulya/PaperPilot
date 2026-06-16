// Reusable button with three visual variants matching the design system
// variant: 'primary' | 'ghost' | 'accent'
export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  icon,
}) {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer transition-all duration-150 whitespace-nowrap border-0 font-[var(--font-body)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[var(--navy)] text-white hover:bg-[var(--navy-light)]",
    ghost:
      "bg-transparent border border-[var(--border-strong)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]",
    accent: "bg-[var(--accent)] text-white hover:bg-[var(--accent-glow)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="spinner" />
      ) : (
        icon && <i className={`ti ${icon} text-base`} />
      )}
      {children}
    </button>
  );
}
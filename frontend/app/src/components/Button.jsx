import React from 'react';
import { Loader2 } from 'lucide-react';

// Reusable premium button matching the DocuAI design system
// variant: 'primary' | 'ghost' | 'accent' | 'danger'
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
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 whitespace-nowrap border disabled:opacity-50 disabled:pointer-events-none tracking-wide";

  const variants = {
    // Deep Navy Brand Action
    primary: "bg-[#0B1B33] border-[#0B1B33] text-white hover:bg-[#162a4a] hover:border-[#162a4a] shadow-xs",
    
    // Minimal Light Border Action
    ghost: "bg-white border-slate-200 text-slate-600 hover:border-[#0B1B33] hover:text-[#0B1B33] hover:bg-slate-50",
    
    // Premium Accent Gold Action
    accent: "bg-[#E5BA73]/10 border-[#E5BA73]/20 text-[#bfa065] hover:bg-[#E5BA73]/20 hover:text-[#a88b53]",
    
    // Operational Destructive Action
    danger: "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <i className={`ti ${icon} text-base`} />
      )}
      <span>{children}</span>
    </button>
  );
}
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useApp } from "../context/AppContext";
// import Button from "../components/Button";

// export default function Login() {
//   const { login, loading } = useApp();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const ok = await login(form.email, form.password);
//     if (ok) navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-4">
//       <div className="w-full max-w-sm">
//         {/* Brand */}
//         <div className="text-center mb-8">
//           <div className="w-12 h-12 bg-[var(--navy)] rounded-xl flex items-center justify-center mx-auto mb-4">
//             <i className="ti ti-files text-[var(--gold-light)] text-2xl" />
//           </div>
//           <h1
//             className="text-2xl font-medium text-[var(--navy)] tracking-tight"
//             style={{ fontFamily: "var(--font-display)" }}
//           >
//             Docu<span className="text-[var(--accent)]">AI</span>
//           </h1>
//           <p className="text-sm text-[var(--text-muted)] mt-1">
//             Sign in to your workspace
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-white border border-[var(--border)] rounded-2xl p-7 shadow-[var(--shadow)]">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 required
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 placeholder="you@example.com"
//                 className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-strong)] text-sm text-[var(--text)] bg-white placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 required
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 placeholder="••••••••"
//                 className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-strong)] text-sm text-[var(--text)] bg-white placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all"
//               />
//             </div>

//             <Button
//               type="submit"
//               variant="primary"
//               loading={loading}
//               className="w-full justify-center py-2.5 mt-2"
//             >
//               Sign in
//             </Button>
//           </form>

//           <p className="text-center text-sm text-[var(--text-muted)] mt-5">
//             No account?{" "}
//             <Link
//               to="/register"
//               className="text-[var(--accent)] font-medium hover:underline"
//             >
//               Create one
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { login, loading } = useApp();
  const navigate = useNavigate();
  
  // Controlled React state form bindings
  const [form, setForm] = useState({ email: '', password: '' });

  // Handle controlled state text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit and validate authentication credentials pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="flex min-h-screen font-sans antialiased text-[#0f172a]">
      {/* Left Panel - Branding & Marketing */}
      <div className="hidden w-[35%] flex-col justify-between bg-[#0B1B33] p-12 text-white lg:flex">
        {/* Header / Logo */}
        <div className="flex items-center gap-3">
          
          {/* <span className="text-xl font-semibold tracking-wide text-white">Docu<span className="text-[#E5BA73]">AI</span></span> */}
        </div>

        {/* Value Proposition */}
        <div className="my-auto max-w-md space-y-6">
          <h1 className="text-4xl font-normal leading-tight tracking-tight text-slate-100">
            Your documents, <br />
            <span className="italic text-[#E5BA73] font-serif">intelligently</span> <br />
            understood.
          </h1>
          <p className="text-sm leading-relaxed text-slate-400">
            Summarize, interrogate, and extract insights from any document — instantly, with AI that reads between the lines.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]">✦</span>
            <span>AI-powered summaries in seconds</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]">💬</span>
            <span>Ask questions in plain language</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]">✎</span>
            <span>Smart highlight & annotation</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]">🔍</span>
            <span>Cross-document semantic search</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex w-full items-center justify-center bg-[#F4F6F8] p-6 lg:w-[65%]">
        <div className="w-full max-w-[480px] rounded-2xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-medium text-[#0B1B33]">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to your DocuAI workspace</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-slate-300 text-[#0B1B33] focus:ring-[#0B1B33]"
                />
                Remember me
              </label>
              <a href="#forgot" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1B33] py-3.5 font-medium text-white transition-colors duration-200 hover:bg-[#162a4a]"
            >
              Sign in <span>→</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-slate-100"></div>
              <span className="absolute bg-white px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50"
            >
              {/* Google Brand Icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"
                />
              </svg>
              Google
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
              Create one free <span className="text-xs">→</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
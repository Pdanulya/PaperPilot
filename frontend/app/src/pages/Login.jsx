import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader2, Sparkles, MessageSquare, Highlighter, Search } from 'lucide-react';

export default function Login() {
  const { login, loading } = useApp();
  const navigate = useNavigate();
  
  // Controlled React state form bindings
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle controlled state text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit and validate authentication credentials pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(form.email, form.password);

      setSuccess("Login successful!");

      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Login failed");
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
            Summarize, compare and extract insights from any document - instantly, with AI that reads between the lines.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><Sparkles className="w-4 h-4" /></span>
            <span>Generate summaries in seconds</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><MessageSquare className="w-4 h-4" /></span>
            <span>Ask questions in plain language</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><Highlighter className="w-4 h-4" /></span>
            <span>Multi-document comparison</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><Search className="w-4 h-4" /></span>
            <span>Organize documents into workspaces</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex w-full items-center justify-center bg-[#F4F6F8] p-6 lg:w-[65%]">
        <div className="w-full max-w-[480px] rounded-2xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-medium text-[#0B1B33]">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to your PaperPilot workspace</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
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


            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1B33] py-3.5 font-medium text-white transition-colors duration-200 hover:bg-[#162a4a]"
            >
              Sign in <span>→</span>
            </button>

           
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
              Create one free <span className="text-xs">→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
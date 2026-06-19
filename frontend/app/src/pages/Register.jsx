import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader2, Sparkles, MessageSquare, Highlighter, Search } from 'lucide-react';

export default function Register() {
  const { register, loading } = useApp();
  const navigate = useNavigate();

  // Controlled state parameters matching layout input tags
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Controlled tracking modifier for state parameters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit and validate new registration application profiles
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form parameter validation criteria checks
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    try{ 
      await register(form.name, form.email, form.password);
      
      setSuccess('Registration successful! Please login.');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen font-sans antialiased text-[#0f172a]">
      {/* Left Panel - Branding & Marketing */}
      <div className="hidden w-[35%] flex-col justify-between bg-[#0B1B33] p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          {/* Logo container wrapper placeholder */}
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
            <span className="text-[#E5BA73]"><Sparkles className="w-4 h-4" /></span>
            <span>AI-powered summaries in seconds</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><MessageSquare className="w-4 h-4" /></span>
            <span>Ask questions in plain language</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><Highlighter className="w-4 h-4" /></span>
            <span>Smart highlight & annotation</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E5BA73]"><Search className="w-4 h-4" /></span>
            <span>Cross-document semantic search</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form Card Card */}
      <div className="flex w-full items-center justify-center bg-[#F4F6F8] p-6 lg:w-[65%]">
        <div className="w-full max-w-[480px] rounded-2xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-medium text-[#0B1B33]">Create an Account</h2>
            <p className="mt-1.5 text-sm text-slate-500">Register to your PaperPilot workspace</p>
          </div>

          {/* Form Content Hub */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
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
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-200"
              />
            </div>

            {success && (
              <div className="text-sm text-green-600">
                {success}
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1B33] py-3.5 font-medium text-white transition-colors duration-200 hover:bg-[#162a4a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign up</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Divider Line layout elements */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-slate-100"></div>
              <span className="absolute bg-white px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Google OAuth Button Block */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50"
            >
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

          {/* Footer Routing Navigation Links */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
              Login <span className="text-xs">→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
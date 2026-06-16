import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";

export default function Register() {
  const { register, loading } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const ok = await register(form.email, form.password);
    if (ok) navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[var(--navy)] rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-files text-[var(--gold-light)] text-2xl" />
          </div>
          <h1
            className="text-2xl font-medium text-[var(--navy)] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Docu<span className="text-[var(--accent)]">AI</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Create your workspace
          </p>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-2xl p-7 shadow-[var(--shadow)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-strong)] text-sm text-[var(--text)] bg-white placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-strong)] text-sm text-[var(--text)] bg-white placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-strong)] text-sm text-[var(--text)] bg-white placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center py-2.5 mt-2"
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--accent)] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
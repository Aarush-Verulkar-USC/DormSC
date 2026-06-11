import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-muted">{label}</label>
      {children}
    </div>
  );
}

export default function Signup() {
  const { currentUser, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/';

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  if (currentUser) { navigate(returnTo, { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed');
    } finally { setLoading(false); }
  };

  const inputCls = 'bg-white border border-line rounded-lg text-ink text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-faint w-full';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16 animate-fade-in">
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-center mb-10">
          <img src="/logo.png" alt="DormSC" className="w-10 h-10 object-contain" />
        </div>

        <div className="bg-white border border-line rounded-2xl p-7">
          <h1 className="text-lg font-semibold text-ink mb-6 text-center">Create a DormSC Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <input type="text" required autoFocus value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={inputCls} placeholder="Jane Doe" />
            </Field>
            <Field label="Email">
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={inputCls} placeholder="you@example.com" />
            </Field>
            <Field label="Password">
              <input type="password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className={inputCls} placeholder="Min 8 characters" />
            </Field>
            <Field label="Confirm Password">
              <input type="password" required value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className={inputCls} placeholder="••••••••" />
            </Field>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link to="/login" state={{ returnTo }}
              className="text-brand hover:text-ink transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

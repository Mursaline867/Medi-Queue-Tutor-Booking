'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success('Login successful!');
        window.location.href = '/';
      } else {
        toast.error(data.error || 'Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="panel w-full max-w-md p-8 sm:p-10">
        <span className="badge mb-4"><LogIn size={14} /> Secure access</span>
        <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-sm text-muted">Login to manage tutors, bookings, and class schedules.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account? <Link href="/register" className="font-bold text-primary">Register here</Link>
        </p>
      </div>
    </div>
  );
}
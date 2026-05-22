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

  const handleGoogleLogin = async () => {
    try {
      // Demo Google User (Real implementation এ এটা Google থেকে আসবে)
      const googleUser = {
        googleId: 'google_' + Date.now(),
        name: 'Google User',
        email: 'googleuser@gmail.com',
        photo: 'https://i.imgur.com/8Q9vZfL.png'
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Google Login successful!');
        window.location.href = '/';
      } else {
        toast.error('Google login failed');
      }
    } catch (error) {
      toast.error('Google login failed');
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

          <div className="text-right">
            <Link href="#" className="text-sm text-primary hover:underline">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-600 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.26 1.38-1.04 2.55-2.21 3.33v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.36z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account? <Link href="/register" className="font-bold text-primary">Register here</Link>
        </p>
      </div>
    </div>
  );
}
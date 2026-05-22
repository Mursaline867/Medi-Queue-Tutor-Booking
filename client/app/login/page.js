'use client';
import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error || 'Invalid email or password');
    } else {
      // ✅ Save userId in localStorage after successful login
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const userData = await userRes.json();
      
      if (userData.success) {
        localStorage.setItem('userId', userData.user.id);
        localStorage.setItem('token', userData.token);
      }
      
      toast.success('Login successful!');
      router.push('/');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-status`);
      const data = await res.json();

      if (!data.configured) {
        toast.error('Google OAuth credentials are missing');
        return;
      }

      await signIn('google', { callbackUrl: '/', redirectTo: '/' });
    } catch {
      toast.error('Google login setup check failed');
    } finally {
      setGoogleLoading(false);
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

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          <span className="px-4 text-sm text-muted">OR</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <button onClick={handleGoogleSignIn} disabled={googleLoading} className="btn-secondary w-full py-4">
          <Image src="https://www.google.com/favicon.ico" alt="Google logo" width={20} height={20} unoptimized />
          {googleLoading ? 'Checking Google setup...' : 'Continue with Google'}
        </button>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account? <Link href="/register" className="font-bold text-primary">Register here</Link>
        </p>
      </div>
    </div>
  );
}
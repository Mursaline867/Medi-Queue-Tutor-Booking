'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
      toast.error('Password must have uppercase, lowercase & 8+ characters');
      return;
    }

    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, photo }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Account created! Please login.');
      router.push('/login');
    } else {
      toast.error(data.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="panel w-full max-w-md p-8 sm:p-10">
        <span className="badge mb-4"><UserPlus size={14} /> New student</span>
        <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-muted">Create your profile and start booking trusted tutors.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="field" required />
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
          </div>

          <div>
            <label className="label">Photo URL (optional)</label>
            <input type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://i.imgur.com/xxx.jpg" className="field" />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" required />
            <p className="text-xs text-muted mt-1">Must have uppercase + lowercase + 8 characters</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-4">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
}
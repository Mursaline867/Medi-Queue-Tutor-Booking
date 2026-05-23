'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import GoogleAuthButton from '../../components/GoogleAuthButton';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password Validation
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)) {
      toast.error('Password must have uppercase + lowercase + minimum 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, photo }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created successfully!');
        router.push('/login');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    const user = data.user ?? data.session?.user ?? data.data?.user ?? {};
    const token = data.token ?? data.session?.token ?? data.data?.session?.token;

    const normalizedUser = {
      ...user,
      name: typeof user.name === 'string'
        ? user.name
        : user.name?.firstName
          ? `${user.name.firstName}${user.name?.lastName ? ` ${user.name.lastName}` : ''}`
          : user.name || user.email?.split('@')[0] || 'User',
      image: user.image || user.photo || user.picture || user.profile || user.avatar || '',
      photo: user.photo || user.image || user.picture || user.profile || user.avatar || '',
      email: user.email || user.profile?.email,
    };

    localStorage.setItem('userId', user.id || user.userId || '');
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));

    toast.success('Google Login successful!');
    window.location.href = '/';
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="panel w-full max-w-md p-8 sm:p-10">
        <span className="badge mb-4"><UserPlus size={14} /> New student</span>
        <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-muted">Join MediQueue and start booking trusted tutors.</p>

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
            <p className="text-xs text-muted mt-1">Must have uppercase + lowercase + 6+ characters</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-4">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <GoogleAuthButton
          buttonClassName="w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-600 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition font-semibold"
          buttonText="Continue with Google"
          onSuccess={handleGoogleSuccess}
        />

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="font-bold text-primary">Login here</Link>
        </p>
      </div>
    </div>
  );
}
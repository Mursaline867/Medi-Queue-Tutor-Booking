'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LogOut, Moon, PlusCircle, Sun } from 'lucide-react';

export default function Navbar({ toggleTheme, theme }) {
  const [user, setUser] = useState(null);

  // Check login status on every render
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    
    // Listen for storage changes (when login happens)
    window.addEventListener('storage', checkUser);
    
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full bg-white/86 dark:bg-slate-950/88 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xl z-50">
      <div className="page-shell py-3 flex flex-wrap gap-4 justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
            MediQueue
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">Home</Link>
          <Link href="/tutors" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">Tutors</Link>

          {user && (
            <>
              <Link href="/add-tutor" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">
                <PlusCircle size={16} /> Add Tutor
              </Link>
              <Link href="/my-tutors" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">My Tutors</Link>
              <Link href="/my-bookings" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">
                My Bookings
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={38}
                  height={38}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                  unoptimized
                />
              )}
              <button
                onClick={handleLogout}
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary px-5 py-2.5">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
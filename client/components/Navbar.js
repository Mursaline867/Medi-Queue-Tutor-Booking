'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LogOut, Moon, PlusCircle, Sun, User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    window.location.href = '/';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/86 dark:bg-slate-950/88 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xl z-50">
      <div className="page-shell py-3 flex flex-wrap gap-4 justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
            MQ
          </span>
          MediQueue
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
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-1 transition"
              >
                {user.image ? (
                  <Image src={user.image} alt={user.name} width={36} height={36} className="h-9 w-9 rounded-full border object-cover" unoptimized />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full text-left transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary px-5 py-2.5">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LogOut, Moon, PlusCircle, Sun, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = user ? (typeof user.name === 'string'
    ? user.name
    : user.name?.firstName
      ? `${user.name.firstName}${user.name?.lastName ? ` ${user.name.lastName}` : ''}`
      : user.name || user.email?.split('@')[0] || 'User') : '';
  const displayEmail = user?.email || user?.profile?.email || '';
  const displayImage = user?.image || user?.photo || user?.picture || user?.profile || user?.avatar || '';

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
      <div className="page-shell py-3 flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
            MQ
          </span>
          <span className="font-extrabold">MediQueue</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">Home</Link>
          <Link href="/tutors" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">Tutors</Link>

          {user && (
            <>
              <Link href="/add-tutor" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">
                <PlusCircle size={15} /> Add Tutor
              </Link>
              <Link href="/my-tutors" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">My Tutors</Link>
              <Link href="/my-bookings" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">
                My Bookings
              </Link>
            </>
          )}
        </div>

        {/* Common Toolbar Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-1 transition cursor-pointer"
                aria-expanded={showDropdown}
              >
                {displayImage ? (
                  <Image src={displayImage} alt={displayName} width={36} height={36} className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800 object-cover" unoptimized />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full text-left transition font-semibold cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary px-5 py-2.5 text-sm">Login</Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="page-shell py-4 flex flex-col gap-2">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                Home
              </Link>
              <Link 
                href="/tutors" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                Tutors
              </Link>

              {user && (
                <>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                  <Link 
                    href="/add-tutor" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    <PlusCircle size={18} className="text-slate-400" /> Add Tutor
                  </Link>
                  <Link 
                    href="/my-tutors" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    My Tutors
                  </Link>
                  <Link 
                    href="/my-bookings" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    My Bookings
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
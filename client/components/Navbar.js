'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { CalendarCheck, LogOut, Moon, PlusCircle, Stethoscope, Sun } from 'lucide-react';

export default function Navbar({ toggleTheme, theme }) {
  const { data: session } = useSession();
  const navLink = 'text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition';

  return (
    <nav className="fixed top-0 w-full bg-white/86 dark:bg-slate-950/88 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xl z-50">
      <div className="page-shell py-3 flex flex-wrap gap-4 justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 14px 28px color-mix(in srgb, var(--primary) 24%, transparent)' }}>
            <Stethoscope size={22} />
          </span>
          MediQueue
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className={navLink}>Home</Link>
          <Link href="/tutors" className={navLink}>Tutors</Link>
          {session && (
            <>
              <Link href="/add-tutor" className={`${navLink} hidden sm:inline-flex items-center gap-1`}>
                <PlusCircle size={16} /> Add Tutor
              </Link>
              <Link href="/my-tutors" className={navLink}>My Tutors</Link>
              <Link href="/my-bookings" className={`${navLink} hidden sm:inline-flex items-center gap-1`}>
                <CalendarCheck size={16} /> Bookings
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User avatar'}
                  width={38}
                  height={38}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
              )}
              <button
                onClick={() => signOut()}
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition"
                aria-label="Sign out"
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

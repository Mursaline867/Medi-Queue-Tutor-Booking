import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 py-12 text-slate-200">
      <div className="page-shell grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-2xl font-black" style={{ color: 'var(--primary)' }}>MediQueue</h3>
          <p className="max-w-sm leading-7 text-slate-400">
            A clean tutoring marketplace for finding trusted teachers and managing class bookings.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-slate-100">Quick Links</h4>
          <div className="space-y-2 text-slate-400">
            <Link href="/" className="block hover:text-primary">Home</Link>
            <Link href="/tutors" className="block hover:text-primary">Tutors</Link>
            <Link href="/add-tutor" className="block hover:text-primary">Add Tutor</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-slate-100">Contact</h4>
          <p className="text-slate-400">support@mediqueue.com</p>
          <p className="text-slate-400">+880 1234-567890</p>
        </div>
      </div>
      <div className="mt-12 text-center text-sm text-slate-500">
        2026 MediQueue. All rights reserved.
      </div>
    </footer>
  );
}

'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-shell py-20 text-center">
      <h1 className="text-7xl font-black text-primary">404</h1>
      <h2 className="text-3xl mt-4">Page Not Found</h2>
      <p className="mt-4 text-muted">The tutor or page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary mt-8 inline-block">
        Go Home
      </Link>
    </div>
  );
}
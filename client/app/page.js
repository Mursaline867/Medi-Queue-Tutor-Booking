'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, CalendarCheck, Clock, MapPin, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors?limit=6`)
    .then((res) => res.json())
    .then((data) => setTutors(data.tutors || []));
}, []);

  return (
    <div>
      <section className="hero-image min-h-[590px] text-white">
        <div className="page-shell flex min-h-[590px] items-center py-20">
          <div className="max-w-2xl pt-14">
            <span className="mb-5 inline-flex rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur">
              Trusted tutoring marketplace in Bangladesh
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Find the right tutor and book your next session faster.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-100">
              Compare teachers, schedules, seats, fees, and availability in one polished booking flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tutors" className="btn-primary">
                Browse Tutors <ArrowRight size={18} />
              </Link>
              <Link href="/add-tutor" className="btn-secondary bg-white/95 text-slate-950 hover:bg-white">
                List a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell -mt-12 grid gap-4 md:grid-cols-3">
        {[
          ['5k+', 'Students supported', Users],
          ['250+', 'Tutor profiles', ShieldCheck],
          ['24/7', 'Booking access', CalendarCheck],
        ].map(([value, label, Icon]) => (
          <div key={label} className="panel p-6">
            <Icon className="mb-4 text-primary" size={28} />
            <div className="text-3xl font-black">{value}</div>
            <p className="mt-1 text-sm font-medium text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="page-shell section-pad">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge mb-3">Available now</span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Featured Tutors</h2>
            <p className="mt-3 max-w-2xl text-muted">Shortlist tutors by subject, timing, seats, and price before you book.</p>
          </div>
          <Link href="/tutors" className="btn-secondary">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutors.length > 0 ? tutors.map((tutor) => (
            <article key={tutor._id} className="surface card-hover overflow-hidden rounded-3xl">
              <div className="relative h-56">
                <Image
                  src={tutor.photo}
                  alt={tutor.tutorName}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-sm font-bold text-slate-900">
                  BDT {tutor.hourlyFee}/hr
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black">{tutor.tutorName}</h3>
                    <p className="mt-1 font-semibold text-primary">{tutor.subject}</p>
                  </div>
                  <span className="badge">{tutor.teachingMode || 'Online'}</span>
                </div>
                <div className="mt-5 space-y-2 text-sm text-muted">
                  <p className="flex items-center gap-2"><Clock size={16} /> {tutor.timeSlot}</p>
                  <p className="flex items-center gap-2"><MapPin size={16} /> {tutor.location || 'Flexible location'}</p>
                </div>
                <Link href={`/tutors/${tutor._id}`} className="btn-primary mt-6 w-full">
                  View & Book
                </Link>
              </div>
            </article>
          )) : (
            <div className="panel col-span-full p-10 text-center text-muted">No tutors available right now.</div>
          )}
        </div>
      </section>

      <section className="surface-strong py-16">
        <div className="page-shell grid gap-6 md:grid-cols-3">
          {[
            [Users, 'Student-first discovery', 'Search and compare tutor options without visual clutter.'],
            [Award, 'Quality profile cards', 'Every card highlights subject, fee, schedule, location, and mode.'],
            [Clock, 'Fast booking flow', 'Students can move from browse to booking with fewer clicks.'],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="surface rounded-3xl p-8">
              <Icon className="mb-5 text-primary" size={34} />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

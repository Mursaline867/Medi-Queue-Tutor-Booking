'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Search } from 'lucide-react';

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTutors = async (query = '') => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    setTutors(data.tutors || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchTutors(value);
  };

  return (
    <div className="page-shell section-pad">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="badge mb-3">Tutor directory</span>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">All Tutors</h1>
          <p className="mt-3 max-w-2xl text-muted">Search by tutor name and compare the best fit for your schedule.</p>
        </div>
        
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearch}
            className="field pl-12"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200" style={{ borderBottomColor: 'var(--primary)' }}></div>
        </div>
      ) : tutors.length === 0 ? (
        <div className="panel p-12 text-center text-muted">No tutor matched your search.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <article key={tutor._id} className="surface card-hover overflow-hidden rounded-3xl">
              <div className="relative h-56">
                <Image src={tutor.photo} alt={tutor.tutorName} fill className="object-cover" unoptimized />
                <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/82 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                  {tutor.totalSlot} slots left
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{tutor.tutorName}</h3>
                    <p className="mt-1 font-semibold text-primary">{tutor.subject}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">BDT {tutor.hourlyFee}</div>
                    <div className="text-xs font-medium text-muted">per hour</div>
                  </div>
                </div>

                <div className="my-5 space-y-2 text-sm text-muted">
                  <p className="flex items-center gap-2"><Clock size={16} /> {tutor.availableDays} | {tutor.timeSlot}</p>
                  <p className="flex items-center gap-2"><MapPin size={16} /> {tutor.location || 'Flexible location'}</p>
                </div>

                <Link href={`/tutors/${tutor._id}`} className="btn-primary w-full">
                  View & Book
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
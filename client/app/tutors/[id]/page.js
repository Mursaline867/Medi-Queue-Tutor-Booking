'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Award, CalendarDays, Clock, GraduationCap, MapPin, Monitor, Phone, UserRound, Mail } from 'lucide-react';

export default function TutorDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ studentName: '', phone: '', studentEmail: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${id}`)
      .then((res) => res.json())
      .then((data) => setTutor(data.tutor))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error('Please login first');
      return;
    }

    setSubmitting(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: id,
        studentName: booking.studentName,
        phone: booking.phone,
        studentEmail: booking.studentEmail,
        bookedBy: session.user.id
      }),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success('Session booked successfully!');
      router.push('/my-bookings');
    } else {
      toast.error(data.error || 'Booking failed');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="page-shell py-20 text-center text-muted">Loading tutor...</div>;
  if (!tutor) return <div className="page-shell py-20 text-center text-muted">Tutor not found.</div>;

  return (
    <div className="page-shell section-pad">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel overflow-hidden">
          <div className="relative h-[360px]">
            <Image src={tutor.photo} alt={tutor.tutorName} fill className="object-cover" unoptimized />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/88 to-transparent p-8 text-white">
              <span className="mb-3 inline-flex rounded-full bg-white/16 px-3 py-1 text-sm font-bold backdrop-blur">{tutor.teachingMode || 'Online'}</span>
              <h1 className="text-4xl font-black tracking-tight">{tutor.tutorName}</h1>
              <p className="mt-2 text-lg font-semibold text-blue-100">{tutor.subject}</p>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Info icon={Clock} label="Time" value={tutor.timeSlot} />
            <Info icon={CalendarDays} label="Available Days" value={tutor.availableDays} />
            <Info icon={MapPin} label="Location" value={tutor.location || 'Flexible'} />
            <Info icon={Monitor} label="Mode" value={tutor.teachingMode || 'Online'} />
            <Info icon={GraduationCap} label="Institution" value={tutor.institution || 'Not specified'} />
            <Info icon={Award} label="Experience" value={tutor.experience || 'Not specified'} />
          </div>
        </section>

        <aside className="panel h-fit p-6 sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted">Session fee</p>
              <div className="mt-1 text-4xl font-black">BDT {tutor.hourlyFee}</div>
              <p className="text-sm text-muted">per hour</p>
            </div>
            <span className="badge">{tutor.totalSlot} slots left</span>
          </div>

          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="label">Student Name</label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  value={booking.studentName}
                  onChange={(e) => setBooking({ ...booking, studentName: e.target.value })}
                  className="field pl-12"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  value={booking.studentEmail}
                  onChange={(e) => setBooking({ ...booking, studentEmail: e.target.value })}
                  className="field pl-12"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  value={booking.phone}
                  onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  className="field pl-12"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={submitting || tutor.totalSlot <= 0} className="btn-primary w-full py-4">
              {submitting ? 'Booking...' : 'Book Session'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <Icon className="mb-3 text-primary" size={22} />
      <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

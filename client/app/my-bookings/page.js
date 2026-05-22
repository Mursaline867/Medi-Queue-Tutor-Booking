'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CalendarCheck, XCircle } from 'lucide-react';

export default function MyBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!session?.user?.id) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings?userId=${session.user.id}`
    );
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchBookings();
    }
  }, [session]);

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
      method: 'PATCH',
    });
    
    toast.success('Booking cancelled');
    fetchBookings();
  };

  if (loading) return <div className="page-shell py-20 text-center text-muted">Loading...</div>;

  return (
    <div className="page-shell section-pad">
      <div className="mb-10">
        <span className="badge mb-3"><CalendarCheck size={14} /> Session history</span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">My Booked Sessions</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="panel p-12 text-center">
          <p className="text-xl font-bold">No bookings yet.</p>
          <p className="mt-2 text-muted">Book a tutor session and it will appear here.</p>
        </div>
      ) : (
        <div className="panel table-wrap overflow-hidden">
          <table className="data-table">
            <thead className="surface-strong">
              <tr>
                <th>Tutor</th>
                <th>Student</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="font-bold">{b.tutor?.tutorName || 'N/A'}</td>
                  <td>{b.studentName}</td>
                  <td>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                      b.status === 'booked' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {b.status === 'booked' && (
                      <button 
                        onClick={() => cancelBooking(b._id)} 
                        className="inline-flex items-center gap-2 font-bold text-rose-600 hover:text-rose-700"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
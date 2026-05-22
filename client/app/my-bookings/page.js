'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CalendarX } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings?userId=${userId}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        toast.success('Booking cancelled successfully!');
        fetchBookings();
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="page-shell py-20 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="page-shell section-pad">
      <div className="mb-10">
        <span className="badge mb-3"><CalendarX size={14} /> My Bookings</span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">My Bookings</h1>
        <p className="mt-3 text-muted">Manage your scheduled sessions.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="panel p-12 text-center">
          <p className="text-muted">You don't have any bookings yet.</p>
          <Link href="/tutors" className="btn-primary mt-6 inline-block">Browse Tutors</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl">{booking.tutor?.tutorName}</h3>
                <p className="text-muted">{booking.tutor?.subject}</p>
                <p className="text-sm mt-1">Student: {booking.studentName} | Phone: {booking.phone}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-muted">Status</div>
                  <div className={`font-semibold ${booking.status === 'cancelled' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {booking.status}
                  </div>
                </div>

                {booking.status !== 'cancelled' && (
                  <button 
                    onClick={() => handleCancel(booking._id)}
                    className="btn-secondary text-sm px-4 py-2 text-rose-600 hover:bg-rose-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
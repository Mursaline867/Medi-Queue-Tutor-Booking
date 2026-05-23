'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarX, X } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBooking._id}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        toast.success('Booking cancelled successfully!');
        setShowModal(false);
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
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">My Booked Sessions</h1>
        <p className="mt-3 text-muted">View and manage your scheduled tutoring sessions.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="panel p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <CalendarX size={40} className="text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Bookings Yet</h3>
          <p className="text-muted max-w-md mx-auto">
            You haven't booked any sessions yet. Browse our tutors and book your first session!
          </p>
          <a href="/tutors" className="btn-primary mt-8 inline-block">Browse Tutors</a>
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-white dark:bg-slate-800">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Tutor Name</th>
                <th className="text-left py-4 px-6 font-semibold">Student Name</th>
                <th className="text-left py-4 px-6 font-semibold">Email</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6 font-medium">{booking.tutor?.tutorName || 'N/A'}</td>
                  <td className="py-4 px-6">{booking.studentName}</td>
                  <td className="py-4 px-6 text-sm text-muted">{booking.studentEmail || 'N/A'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'cancelled' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {booking.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleCancelClick(booking)}
                        className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center gap-1 ml-auto"
                      >
                        <X size={16} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                <X size={32} className="text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Cancel Booking?</h3>
              <p className="text-muted mb-6">
                Are you sure you want to cancel your session with <strong>{selectedBooking.tutor?.tutorName}</strong>?
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Keep Booking
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
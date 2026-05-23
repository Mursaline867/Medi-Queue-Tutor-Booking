'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TutorDetail({ params }) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const router = useRouter();
  const resolvedParams = React.use(params);
  const tutorId = resolvedParams?.id;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // if (!tutorId) {
    //   setError("Invalid Tutor ID");
    //   setLoading(false);
    //   return;
    // }

    const fetchTutor = async () => {
      try {
        const res = await fetch(`${apiBase}/api/tutors/${tutorId}`);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Tutor with ID ${tutorId} not found`);
        }

        const data = await res.json();
        if (data.tutor) {
          setTutor(data.tutor);
        } else {
          throw new Error('Tutor data not available');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        toast.error(err.message || 'Failed to load tutor details');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, apiBase]);

  const handleBookClick = () => {
    if (!tutor) return;

    if (tutor.totalSlot <= 0) {
      toast.error("This session is fully booked. You can't join at the moment.");
      return;
    }

    const today = new Date();
    const sessionDate = new Date(tutor.sessionStartDate);

    if (today < sessionDate) {
      toast.error("Booking is not available yet for this tutor.");
      return;
    }

    setShowBookingModal(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!studentName || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: tutorId,
          studentName,
          phone,
          studentEmail: user.email || '',
          bookedBy: user.id || localStorage.getItem('userId')
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Booking successful! 🎉');
        setShowBookingModal(false);
        router.push('/my-bookings');
      } else {
        toast.error(data.error || 'Booking failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="page-shell py-20 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted">Loading tutor details...</p>
      </div>
    );
  }

  // Error State
  if (error || !tutor) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-5xl font-black text-rose-600 mb-4">Tutor Not Found</h1>
        <p className="text-muted max-w-md mx-auto mb-8">
          {error || "The tutor you're looking for doesn't exist or has been removed."}
        </p>
        <Link href="/tutors" className="btn-primary inline-block">
          Browse All Tutors
        </Link>
      </div>
    );
  }

  const today = new Date();
  const sessionDate = new Date(tutor.sessionStartDate);
  const isBookingAvailable = tutor.totalSlot > 0 && today >= sessionDate;

  return (
    <div className="page-shell section-pad max-w-4xl">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img 
            src={tutor.photo} 
            alt={tutor.tutorName} 
            className="w-full rounded-3xl shadow-xl object-cover" 
          />
        </div>

        <div>
          <div className="badge mb-4">Available for booking</div>
          <h1 className="text-5xl font-black tracking-tight">{tutor.tutorName}</h1>
          <p className="text-2xl text-primary font-bold mt-2">{tutor.subject}</p>

          <div className="mt-8 space-y-4 text-lg">
            <p><strong>Fee:</strong> BDT {tutor.hourlyFee}/hr</p>
            <p><strong>Available:</strong> {tutor.availableDays} | {tutor.timeSlot}</p>
            <p><strong>Location:</strong> {tutor.location}</p>
            <p><strong>Mode:</strong> {tutor.teachingMode}</p>
            <p><strong>Slots Left:</strong> <span className="font-bold text-primary">{tutor.totalSlot}</span></p>
          </div>

          <button 
            onClick={handleBookClick}
            disabled={!isBookingAvailable}
            className={`btn-primary w-full mt-10 py-4 text-lg ${!isBookingAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tutor.totalSlot <= 0 
              ? "Fully Booked" 
              : today < sessionDate 
                ? "Booking Not Available Yet" 
                : "Book Session"}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Book Session</h2>

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="label text-white">Student Name</label>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  className="field" 
                  required 
                />
              </div>

              <div>
                <label className="label text-white">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="field" 
                  required 
                />
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                <p className="text-sm text-muted">Tutor</p>
                <p className="font-semibold text-white">{tutor.tutorName}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowBookingModal(false)} 
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={bookingLoading} 
                  className="btn-primary flex-1"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
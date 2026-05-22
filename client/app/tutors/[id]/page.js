'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function TutorDetail({ params }) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${params.id}`);
        const data = await res.json();
        setTutor(data.tutor);
      } catch (error) {
        toast.error('Failed to load tutor');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [params.id]);

  const handleBookClick = () => {
    if (!tutor) return;

    // Check if slots available
    if (tutor.totalSlot <= 0) {
      toast.error("This session is fully booked. You can't join at the moment.");
      return;
    }

    // Check session date
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
    setBookingLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: params.id,
          studentName,
          phone,
          studentEmail: user.email || '',
          bookedBy: user.id || localStorage.getItem('userId')
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Booking successful!');
        setShowBookingModal(false);
        router.push('/my-bookings');
      } else {
        toast.error(data.error || 'Booking failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="page-shell py-20 text-center">Loading...</div>;
  }

  if (!tutor) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-4xl font-black">Tutor not found</h1>
        <Link href="/tutors" className="btn-primary mt-6 inline-block">Browse Tutors</Link>
      </div>
    );
  }

  const today = new Date();
  const sessionDate = new Date(tutor.sessionStartDate);
  const isBookingAvailable = tutor.totalSlot > 0 && today >= sessionDate;

  return (
    <div className="page-shell section-pad max-w-4xl">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Tutor Info */}
        <div>
          <img src={tutor.photo} alt={tutor.tutorName} className="w-full rounded-3xl shadow-xl" />
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
            <h2 className="text-3xl font-bold mb-6">Book Session</h2>

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="label">Student Name</label>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  className="field" 
                  required 
                />
              </div>

              <div>
                <label className="label">Phone Number</label>
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
                <p className="font-semibold">{tutor.tutorName}</p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                <p className="text-sm text-muted">Your Email</p>
                <p className="font-semibold">{user.email || 'Not available'}</p>
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
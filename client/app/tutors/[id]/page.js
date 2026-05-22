'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TutorDetail({ params }) {
  const [tutor, setTutor] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  // Fetch tutor data
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${params.id}`);
        const data = await res.json();
        
        if (data.tutor) {
          setTutor(data.tutor);
        } else {
          toast.error('Tutor not found');
        }
      } catch (error) {
        toast.error('Failed to load tutor');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [params.id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    const userId = localStorage.getItem('userId');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: params.id,
        studentName,
        phone,
        studentEmail: '',
        bookedBy: userId
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Booking successful!');
      router.push('/my-bookings');
    } else {
      toast.error(data.error || 'Booking failed');
    }
    setBookingLoading(false);
  };

  if (loading) {
    return (
      <div className="page-shell py-20 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-4xl font-black">Tutor not found</h1>
        <Link href="/tutors" className="btn-primary mt-6 inline-block">Browse Tutors</Link>
      </div>
    );
  }

  return (
    <div className="page-shell section-pad max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black">Book Session</h1>
        <p className="text-muted mt-2">with {tutor.tutorName}</p>
      </div>

      <div className="panel p-8">
        <div className="mb-6">
          <h2 className="font-bold text-2xl">{tutor.tutorName}</h2>
          <p className="text-primary font-semibold">{tutor.subject}</p>
          <p className="text-3xl font-black mt-4">BDT {tutor.hourlyFee}/hr</p>
        </div>

        <form onSubmit={handleBook} className="space-y-6">
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

          <button type="submit" disabled={bookingLoading} className="btn-primary w-full py-4">
            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
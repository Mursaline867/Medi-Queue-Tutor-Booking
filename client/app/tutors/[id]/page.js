'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TutorDetail({ params }) {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userId');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: params.id,
        studentName,
        phone,
        studentEmail: '', // optional
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
    setLoading(false);
  };

  return (
    <div className="page-shell section-pad max-w-2xl">
      <h1 className="text-4xl font-black mb-8">Book Session</h1>

      <form onSubmit={handleBook} className="panel p-8 space-y-6">
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

        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
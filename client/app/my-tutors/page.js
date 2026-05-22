'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';

export default function MyTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTutors = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-tutors?userId=${userId}`);
      const data = await res.json();
      setTutors(data.tutors || []);
    } catch (error) {
      console.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleDelete = async (tutorId) => {
    if (!confirm('Are you sure you want to delete this tutor?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${tutorId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Tutor deleted successfully!');
        fetchTutors();
      } else {
        toast.error('Failed to delete tutor');
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
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="badge mb-3"><Users size={14} /> My Tutors</span>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">My Tutors</h1>
          <p className="mt-3 text-muted">Manage the tutors you have added.</p>
        </div>
        <Link href="/add-tutor" className="btn-primary">Add New Tutor</Link>
      </div>

      {tutors.length === 0 ? (
        <div className="panel p-12 text-center">
          <p className="text-muted">You haven't added any tutors yet.</p>
          <Link href="/add-tutor" className="btn-primary mt-6 inline-block">Add Your First Tutor</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="panel overflow-hidden">
              <div className="relative h-48">
                <img src={tutor.photo} alt={tutor.tutorName} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl">{tutor.tutorName}</h3>
                <p className="text-primary font-semibold">{tutor.subject}</p>
                
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p>Fee: BDT {tutor.hourlyFee}/hr</p>
                  <p>Slots Left: {tutor.totalSlot}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link 
                    href={`/tutors/${tutor._id}`} 
                    className="btn-secondary flex-1 text-center"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => handleDelete(tutor._id)}
                    className="btn-secondary flex-1 text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
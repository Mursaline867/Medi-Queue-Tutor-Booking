'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Trash2, Users } from 'lucide-react';

export default function MyTutors() {
  const { data: session } = useSession();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTutors = async () => {
    if (!session?.user?.id) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/my-tutors?userId=${session.user.id}`
    );
    const data = await res.json();
    setTutors(data.tutors || []);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyTutors();
    }
  }, [session]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this tutor?')) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${id}`, {
      method: 'DELETE',
    });
    
    toast.success('Tutor deleted');
    fetchMyTutors();
  };

  if (loading) return <div className="page-shell py-20 text-center text-muted">Loading...</div>;

  return (
    <div className="page-shell section-pad">
      <div className="mb-10">
        <span className="badge mb-3"><Users size={14} /> Tutor management</span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">My Tutors</h1>
      </div>

      {tutors.length === 0 ? (
        <div className="panel p-12 text-center">
          <p className="text-xl font-bold">You haven&apos;t added any tutors yet.</p>
          <p className="mt-2 text-muted">Add a tutor profile to start receiving bookings.</p>
        </div>
      ) : (
        <div className="panel table-wrap overflow-hidden">
          <table className="data-table">
            <thead className="surface-strong">
              <tr>
                <th>Tutor</th>
                <th>Subject</th>
                <th>Fee</th>
                <th>Slots Left</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor) => (
                <tr key={tutor._id}>
                  <td>
                    <div className="flex items-center gap-4">
                      <Image 
                        src={tutor.photo} 
                        alt={tutor.tutorName} 
                        width={56} 
                        height={56} 
                        className="h-14 w-14 rounded-2xl object-cover" 
                        unoptimized 
                      />
                      <div>
                        <div className="font-bold">{tutor.tutorName}</div>
                        <div className="text-sm text-muted">{tutor.location}</div>
                      </div>
                    </div>
                  </td>
                  <td>{tutor.subject}</td>
                  <td className="font-black">BDT {tutor.hourlyFee}</td>
                  <td><span className="badge">{tutor.totalSlot} left</span></td>
                  <td className="text-center">
                    <button 
                      onClick={() => handleDelete(tutor._id)} 
                      className="inline-flex items-center gap-2 font-bold text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
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
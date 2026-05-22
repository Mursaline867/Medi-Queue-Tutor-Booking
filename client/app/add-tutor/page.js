'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

export default function AddTutor() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    tutorName: '', photo: '', subject: '', availableDays: '', timeSlot: '',
    hourlyFee: '', totalSlot: 10, sessionStartDate: '', institution: '',
    experience: '', location: '', teachingMode: 'Online'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userId');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${id}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...booking,
      bookedBy: userId,  
      studentEmail: session?.user?.email
    }),
  });

    const data = await res.json();

    if (res.ok) {
      toast.success('Tutor added successfully!');
      router.push('/my-tutors');
    } else {
      toast.error(data.error || 'Failed to add tutor');
    }
    setLoading(false);
  };

  if (!session) return <div className="page-shell py-20 text-center text-muted">Please login first.</div>;

  return (
    <div className="page-shell section-pad max-w-4xl">
      <div className="mb-8">
        <span className="badge mb-3"><PlusCircle size={14} /> Tutor onboarding</span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Add New Tutor</h1>
        <p className="mt-3 text-muted">Add the teaching details students need before they book a session.</p>
      </div>

      <form onSubmit={handleSubmit} className="panel space-y-6 p-6 sm:p-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="label">Tutor Name</label>
            <input name="tutorName" value={form.tutorName} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="label">Photo URL</label>
            <input name="photo" value={form.photo} onChange={handleChange} className="field" required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="label">Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Mathematics, Physics..." className="field" required />
          </div>
          <div>
            <label className="label">Hourly Fee (BDT)</label>
            <input type="number" name="hourlyFee" value={form.hourlyFee} onChange={handleChange} className="field" required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="label">Available Days</label>
            <input name="availableDays" value={form.availableDays} onChange={handleChange} placeholder="Sun - Thu" className="field" required />
          </div>
          <div>
            <label className="label">Time Slot</label>
            <input name="timeSlot" value={form.timeSlot} onChange={handleChange} placeholder="5:00 PM - 8:00 PM" className="field" required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="label">Session Start Date</label>
            <input type="date" name="sessionStartDate" value={form.sessionStartDate} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="label">Total Slots</label>
            <input type="number" name="totalSlot" value={form.totalSlot} onChange={handleChange} className="field" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="label">Institution</label>
            <input name="institution" value={form.institution} onChange={handleChange} placeholder="Institution" className="field" />
          </div>
          <div>
            <label className="label">Experience</label>
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="5 years experience" className="field" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="label">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="label">Teaching Mode</label>
            <select name="teachingMode" value={form.teachingMode} onChange={handleChange} className="field">
              <option>Online</option>
              <option>Offline</option>
              <option>Both</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
          {loading ? 'Adding Tutor...' : 'Add Tutor'}
        </button>
      </form>
    </div>
  );
}

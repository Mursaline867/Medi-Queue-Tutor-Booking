'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

export default function AddTutor() {
  const router = useRouter();
  const [form, setForm] = useState({
    tutorName: '', photo: '', subject: 'Mathematics', availableDays: '', timeSlot: '',
    hourlyFee: '', totalSlot: 10, sessionStartDate: '', institution: '',
    experience: '', location: '', teachingMode: 'Online'
  });
  const [loading, setLoading] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'ICT', 'Accounting', 'Economics'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userId');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        hourlyFee: Number(form.hourlyFee),
        totalSlot: Number(form.totalSlot),
        createdBy: userId
      }),
    });

    if (res.ok) {
      toast.success('Tutor added successfully!');
      router.push('/my-tutors');
    } else {
      toast.error('Failed to add tutor');
    }
    setLoading(false);
  };

  return (
    <div className="page-shell section-pad max-w-4xl">
      <div className="mb-8">
        <span className="badge mb-3"><PlusCircle size={14} /> Tutor Onboarding</span>
        <h1 className="text-4xl font-black tracking-tight">Add New Tutor</h1>
      </div>

      <form onSubmit={handleSubmit} className="panel p-8 space-y-6 bg-blue-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Tutor Name</label>
            <input name="tutorName" value={form.tutorName} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="label">Photo URL (ImgBB / Postimages)</label>
            <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://i.imgur.com/xxx.jpg" className="field" required />
          </div>
          <div>
            <label className="label">Subject / Category</label>
            <select name="subject" value={form.subject} onChange={handleChange} className="field">
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Hourly Fee (BDT)</label>
            <input type="number" name="hourlyFee" value={form.hourlyFee} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="label">Available Days</label>
            <input name="availableDays" value={form.availableDays} onChange={handleChange} placeholder="Sun - Thu" className="field" required />
          </div>
          <div>
            <label className="label">Time Slot</label>
            <input name="timeSlot" value={form.timeSlot} onChange={handleChange} placeholder="5:00 PM - 8:00 PM" className="field" required />
          </div>
          <div>
            <label className="label">Total Slots</label>
            <input type="number" name="totalSlot" value={form.totalSlot} onChange={handleChange} className="field" />
          </div>
          <div>
            <label className="label">Session Start Date</label>
            <input type="date" name="sessionStartDate" value={form.sessionStartDate} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="label">Institution</label>
            <input name="institution" value={form.institution} onChange={handleChange} className="field" />
          </div>
          <div>
            <label className="label">Experience</label>
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="5 years" className="field" />
          </div>
          <div>
            <label className="label">Location (Area/City)</label>
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

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-6">
          {loading ? 'Adding Tutor...' : 'Add Tutor'}
        </button>
      </form>
    </div>
  );
}
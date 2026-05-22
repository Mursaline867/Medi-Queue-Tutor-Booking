'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Edit, Trash2, X } from 'lucide-react';

export default function MyTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [editForm, setEditForm] = useState({
    tutorName: '', photo: '', subject: '', availableDays: '', timeSlot: '',
    hourlyFee: '', totalSlot: 10, sessionStartDate: '', institution: '',
    experience: '', location: '', teachingMode: 'Online'
  });

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

  // Open Edit Modal
  const handleEdit = (tutor) => {
    setSelectedTutor(tutor);
    setEditForm({
      tutorName: tutor.tutorName || '',
      photo: tutor.photo || '',
      subject: tutor.subject || '',
      availableDays: tutor.availableDays || '',
      timeSlot: tutor.timeSlot || '',
      hourlyFee: tutor.hourlyFee || '',
      totalSlot: tutor.totalSlot || 10,
      sessionStartDate: tutor.sessionStartDate ? tutor.sessionStartDate.split('T')[0] : '',
      institution: tutor.institution || '',
      experience: tutor.experience || '',
      location: tutor.location || '',
      teachingMode: tutor.teachingMode || 'Online'
    });
    setShowEditModal(true);
  };

  // Handle Edit Form Change
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Update Tutor
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTutor) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${selectedTutor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          hourlyFee: Number(editForm.hourlyFee),
          totalSlot: Number(editForm.totalSlot)
        }),
      });

      if (res.ok) {
        toast.success('Tutor updated successfully!');
        setShowEditModal(false);
        fetchTutors();
      } else {
        toast.error('Failed to update tutor');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  // Open Delete Modal
  const handleDeleteClick = (tutor) => {
    setSelectedTutor(tutor);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!selectedTutor) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/${selectedTutor._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Tutor deleted successfully!');
        setShowDeleteModal(false);
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
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">My Tutors List</h1>
          <p className="mt-3 text-muted">Manage the tutors you have created.</p>
        </div>
      </div>

      {tutors.length === 0 ? (
        <div className="panel p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Users size={40} className="text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Tutors Yet</h3>
          <p className="text-muted max-w-md mx-auto mb-6">
            You haven't added any tutors yet. Start by adding your first tutor!
          </p>
          <a href="/add-tutor" className="btn-primary">Add Your First Tutor</a>
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Tutor Name</th>
                <th className="text-left py-4 px-6 font-semibold">Subject</th>
                <th className="text-left py-4 px-6 font-semibold">Fee</th>
                <th className="text-left py-4 px-6 font-semibold">Slots</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {tutors.map((tutor) => (
                <tr key={tutor._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6 font-medium">{tutor.tutorName}</td>
                  <td className="py-4 px-6">{tutor.subject}</td>
                  <td className="py-4 px-6">BDT {tutor.hourlyFee}</td>
                  <td className="py-4 px-6">{tutor.totalSlot}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(tutor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(tutor)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTutor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Edit Tutor</h3>
                <button onClick={() => setShowEditModal(false)}><X size={24} /></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Tutor Name</label>
                    <input name="tutorName" value={editForm.tutorName} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Photo URL</label>
                    <input name="photo" value={editForm.photo} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input name="subject" value={editForm.subject} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Hourly Fee (BDT)</label>
                    <input type="number" name="hourlyFee" value={editForm.hourlyFee} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Available Days</label>
                    <input name="availableDays" value={editForm.availableDays} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Time Slot</label>
                    <input name="timeSlot" value={editForm.timeSlot} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Total Slots</label>
                    <input type="number" name="totalSlot" value={editForm.totalSlot} onChange={handleEditChange} className="field" />
                  </div>
                  <div>
                    <label className="label">Session Start Date</label>
                    <input type="date" name="sessionStartDate" value={editForm.sessionStartDate} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Institution</label>
                    <input name="institution" value={editForm.institution} onChange={handleEditChange} className="field" />
                  </div>
                  <div>
                    <label className="label">Experience</label>
                    <input name="experience" value={editForm.experience} onChange={handleEditChange} className="field" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input name="location" value={editForm.location} onChange={handleEditChange} className="field" required />
                  </div>
                  <div>
                    <label className="label">Teaching Mode</label>
                    <select name="teachingMode" value={editForm.teachingMode} onChange={handleEditChange} className="field">
                      <option>Online</option>
                      <option>Offline</option>
                      <option>Both</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTutor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={32} className="text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Delete Tutor?</h3>
              <p className="text-muted mb-6">
                Are you sure you want to delete <strong>{selectedTutor.tutorName}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
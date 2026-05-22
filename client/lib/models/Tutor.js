import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  tutorName: String,
  photo: String,
  subject: String,
  availableDays: String,
  timeSlot: String,
  hourlyFee: Number,
  totalSlot: { type: Number, default: 10 },
  sessionStartDate: Date,
  institution: String,
  experience: String,
  location: String,
  teachingMode: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);
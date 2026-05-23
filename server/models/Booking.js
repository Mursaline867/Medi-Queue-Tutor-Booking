const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
  studentName: String,
  studentEmail: String,
  phone: String,
  status: { type: String, default: 'booked' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
 
module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
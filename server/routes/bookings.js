const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');

// POST book a session
router.post('/', async (req, res) => {
  try {
    const { tutorId, studentName, phone, studentEmail, bookedBy } = req.body;
    
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
    if (tutor.totalSlot <= 0) return res.status(400).json({ error: 'No slots left' });
    
    const booking = await Booking.create({
      tutor: tutorId,
      studentName,
      studentEmail,
      phone,
      bookedBy
    });
    
    await Tutor.findByIdAndUpdate(tutorId, { $inc: { totalSlot: -1 } });
    
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH cancel booking
router.patch('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    booking.status = 'cancelled';
    await booking.save();
    
    if (booking.tutor) {
      await Tutor.findByIdAndUpdate(booking.tutor, { $inc: { totalSlot: 1 } });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
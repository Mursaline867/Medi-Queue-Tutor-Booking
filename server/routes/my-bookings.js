const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET bookings of a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await Booking.find({ bookedBy: userId })
      .populate('tutor')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
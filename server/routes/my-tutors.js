const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');

// GET tutors created by user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; // frontend থেকে userId পাঠাবে
    const tutors = await Tutor.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json({ tutors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
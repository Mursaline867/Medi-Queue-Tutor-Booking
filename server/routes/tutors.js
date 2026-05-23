const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');
const { verifyToken } = require('../middleware/auth'); // পরে বানাব

// GET all tutors (with search)
router.get('/', async (req, res) => {
  try {
    const { search, limit } = req.query;
    let query = {};
    
    if (search) {
      query.tutorName = { $regex: search, $options: 'i' };
    }
    
    let tutors = await Tutor.find(query).sort({ createdAt: -1 });
    
    if (limit) tutors = tutors.slice(0, parseInt(limit));
    
    res.json({ tutors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new tutor
router.post('/', async (req, res) => {
  try {
    const tutor = await Tutor.create(req.body);
    res.json({ success: true, tutor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET single tutor
router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    res.json({ tutor });
  } catch (err) {
    res.status(400).json({ error: 'Invalid tutor ID' });
  }
});

// PUT update tutor
router.put('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, tutor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE tutor
router.delete('/:id', async (req, res) => {
  try {
    await Tutor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
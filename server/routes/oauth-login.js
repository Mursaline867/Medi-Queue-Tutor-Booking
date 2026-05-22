const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { googleId, name, email, photo } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        photo: photo || '',
        provider: 'google',
        googleId
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo
      }
    });
  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.status(500).json({ success: false, error: 'Google login failed' });
  }
});

module.exports = router;
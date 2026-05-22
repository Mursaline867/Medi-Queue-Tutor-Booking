const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const { name, email, image, provider, providerAccountId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user with provider info if not already set
      if (!user[`${provider}Id`]) {
        user[`${provider}Id`] = providerAccountId;
      }
      user.image = image || user.image;
      user.name = name || user.name;
      await user.save();
    } else {
      // Create new user from OAuth
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        image: image || 'https://i.imgur.com/8Q9vZfL.png',
        [`${provider}Id`]: providerAccountId,
        provider: provider,
      });
    }

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
        image: user.image,
      },
    });
  } catch (err) {
    console.error('OAuth login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

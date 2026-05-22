const express = require('express');
const router = express.Router();

// Check if Google OAuth credentials are configured
router.get('/google-status', (req, res) => {
  const hasGoogleConfig = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({
    configured: hasGoogleConfig,
    message: hasGoogleConfig ? 'Google OAuth configured' : 'Google OAuth not configured',
  });
});

module.exports = router;

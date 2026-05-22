const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  image: { type: String, default: 'https://i.imgur.com/8Q9vZfL.png' },
  password: String,
  provider: String,
  googleId: String,
  githubId: String,
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  password: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
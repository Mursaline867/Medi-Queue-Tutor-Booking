import mongoose from 'mongoose';

const connectDB = async () => {
  const connectionState = mongoose.connections[0].readyState;
  if (connectionState === 1) return;
  if (connectionState === 2) {
    await mongoose.connection.asPromise();
    return;
  }
  if (connectionState !== 0) {
    await mongoose.disconnect();
  }

  const uri = process.env.MONGODB_URI;
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    throw new Error('MONGODB_URI is not configured or is invalid. Set a valid MongoDB connection string in .env.local');
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB Connected');
};

export default connectDB;

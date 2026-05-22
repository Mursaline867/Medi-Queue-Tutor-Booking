import mongoose from 'mongoose';
import User from './models/User';

export async function resolveSessionUserId(session) {
  if (!session?.user?.email) return null;

  if (session.user.id && mongoose.Types.ObjectId.isValid(session.user.id)) {
    return session.user.id;
  }

  const email = session.user.email.toLowerCase().trim();
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: session.user.name || email.split('@')[0],
        email,
        image: session.user.image || 'https://i.imgur.com/8Q9vZfL.png',
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return user._id.toString();
}

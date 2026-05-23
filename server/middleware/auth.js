const jwt = require('jsonwebtoken');
const { getAuth } = require('../betterAuth');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // 1. Try custom JWT verification (for traditional login)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    // JWT verification failed, fall back to checking if it is a Better Auth bearer session token
  }

  // 2. Try Better Auth verification (for Google Login/Bearer Token)
  try {
    const auth = getAuth();
    if (auth) {
      const session = await auth.api.getSession({
        headers: req.headers,
      });
      if (session && session.user) {
        req.user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        };
        return next();
      }
    }
  } catch (err) {
    console.error('Better Auth verification error in middleware:', err);
  }

  return res.status(401).json({ error: 'Invalid token or session expired' });
};

module.exports = { verifyToken };

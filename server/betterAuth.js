const mongoose = require('mongoose');

async function initBetterAuth(app) {
  const { betterAuth } = await import('better-auth');
  const { toNodeHandler } = await import('better-auth/node');
  const { mongodbAdapter } = await import('@better-auth/mongo-adapter');

  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:5000/api/auth';
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is required for BetterAuth. Set it in server/.env');
  }

  const auth = betterAuth({
    secret,
    baseURL,
    trustedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
    database: mongodbAdapter(mongoose.connection.db),
    emailAndPassword: { enabled: true },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
  });

  const authHandler = toNodeHandler(auth);

  app.use('/api/auth', (req, res, next) => {
    authHandler(req, res).catch(next);
  });
}

module.exports = initBetterAuth;

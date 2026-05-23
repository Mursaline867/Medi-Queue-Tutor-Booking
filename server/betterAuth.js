const mongoose = require('mongoose');

let authInstance = null;

async function initBetterAuth(app) {
  const { betterAuth } = await import('better-auth');
  const { toNodeHandler } = await import('better-auth/node');
  const { mongodbAdapter } = await import('@better-auth/mongo-adapter');
  const { bearer } = await import('better-auth/plugins');

  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:5000/api/auth';
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is required for BetterAuth. Set it in server/.env');
  }

  const trustedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
  ];

  if (process.env.FRONTEND_URL) {
    trustedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
  }
  if (process.env.TRUSTED_ORIGINS) {
    const extraOrigins = process.env.TRUSTED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, ''));
    trustedOrigins.push(...extraOrigins);
  }

  const auth = betterAuth({
    secret,
    baseURL,
    trustedOrigins,
    database: mongodbAdapter(mongoose.connection.db),
    emailAndPassword: { enabled: true },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
    plugins: [bearer()],
  });

  authInstance = auth;

  const authHandler = toNodeHandler(auth);

  app.use('/api/auth', (req, res, next) => {
    authHandler(req, res).catch(next);
  });
}

function getAuth() {
  return authInstance;
}

module.exports = {
  initBetterAuth,
  getAuth,
};


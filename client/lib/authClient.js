import { createAuthClient } from 'better-auth/client';

const baseURL = process.env.NEXT_PUBLIC_AUTH_URL || `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

export const authClient = createAuthClient({ 
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
});

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { resolveSessionUserId } from '@/lib/authUser';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials.token) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: credentials.token }),
            });

            if (!response.ok) return null;

            const data = await response.json();
            return data.user;
          } catch (error) {
            console.error('Token verification failed:', error);
            return null;
          }
        }

        if (credentials.email && credentials.password) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });

            if (!response.ok) return null;

            const data = await response.json();
            if (data.user && data.token) {
              return {
                ...data.user,
                id: data.user.id,
                token: data.token,
              };
            }
          } catch (error) {
            console.error('Credentials login failed:', error);
            return null;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type === 'oauth') {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/oauth-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name || profile.name,
              email: user.email,
              image: user.image || profile.picture,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }),
          });

          if (!response.ok) return false;

          const data = await response.json();
          user.id = data.user.id;
          user.token = data.token;
          return true;
        } catch (error) {
          console.error('OAuth sign in failed:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.token = token.token;
      session.user.provider = token.provider;

      if (!session.user.id) {
        const userId = await resolveSessionUserId(session);
        if (userId) {
          session.user.id = userId;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
});

export { handler as GET, handler as POST };

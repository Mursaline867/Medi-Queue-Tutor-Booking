# 🔧 Setup Guide - Registration & Google Auth

## ✅ Registration Fix

The registration endpoint has been fixed with:
- ✓ Better error handling
- ✓ Email format validation
- ✓ Password strength validation
- ✓ Auto-login after registration
- ✓ JWT token generation
- ✓ Support for OAuth providers

**Endpoint:** `POST /api/register`

---

## 🔐 Google OAuth Setup

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web Application**
6. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/signin/google
   https://yourdomain.com/api/auth/callback/google
   https://yourdomain.com/api/auth/signin/google
   ```
7. Copy `Client ID` and `Client Secret`

### Step 2: Update Environment Variables

**Client (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

NEXTAUTH_SECRET=generate_with_openssl_rand_-base64_32
NEXTAUTH_URL=http://localhost:3000
```

**Server (.env):**
```env
MONGODB_URI=mongodb://...
JWT_SECRET=...
PORT=5000
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 3: Generate NEXTAUTH_SECRET

Run this in your terminal:
```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`

### Step 4: Test

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Visit `http://localhost:3000/register`
4. Try signing up with email or Google

---

## 📋 What's Fixed

### Registration (`/api/register`)
- ✅ Validates all fields
- ✅ Checks password strength
- ✅ Verifies unique email
- ✅ Hashes password securely
- ✅ Returns JWT token
- ✅ Auto-login support

### Google OAuth
- ✅ NextAuth configured with Google provider
- ✅ OAuth login route (`/api/oauth-login`)
- ✅ Token verification endpoint (`/api/verify-token`)
- ✅ User auto-creation on first login
- ✅ Session management

### UI Updates
- ✅ Register page supports Google sign-up
- ✅ Login page supports Google login
- ✅ Auto-login after registration
- ✅ Better error messages

---

## 🚀 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | Email/password login |
| POST | `/api/oauth-login` | OAuth provider login |
| POST | `/api/verify-token` | Verify JWT token |
| GET | `/api/auth/google-status` | Check if Google is configured |

---

## 🛠️ Troubleshooting

### "Google OAuth is not configured"
- Check if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env.local`
- Make sure `NEXTAUTH_SECRET` is set
- Restart the dev server

### Registration fails silently
- Check server logs for error messages
- Ensure MongoDB connection is working
- Verify `NEXT_PUBLIC_API_URL` is correct

### Can't login after registration
- Check if token is being saved to localStorage
- Verify JWT_SECRET is the same on server and client
- Check browser console for errors

---

## 📝 Notes

- User session expires in 7 days (configurable)
- Both email/password and OAuth logins are supported
- OAuth users can be linked to existing email accounts
- All passwords are hashed with bcryptjs

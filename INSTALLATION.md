# Installation Instructions

## Quick Start

### 1. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

**Server (.env):**
Already configured with MongoDB and JWT_SECRET

**Client (.env.local):**
Copy from `.env.local.example` and update with:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

### 3. Install Google OAuth Provider

The `next-auth` package is already installed, but ensure it's updated:

```bash
cd client
npm install next-auth@latest
```

### 4. Run the Application

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

Visit `http://localhost:3000`

---

## What Was Fixed

### ✅ Registration Issues Fixed
- Enhanced validation for email, password, and name
- Password strength validation (uppercase + lowercase + 8+ chars)
- Better error messages
- Auto-login after registration
- JWT token generation

### ✅ Google OAuth Setup
- NextAuth configuration with Google provider
- OAuth login handler
- User auto-creation on first OAuth login
- Proper session management
- Token verification endpoint

### ✅ UI Improvements
- Google sign-up button on register page
- Google login button on login page
- Auto-login after registration
- Better error handling and toast notifications

---

## Files Modified/Created

**Server:**
- `server/routes/register.js` - Enhanced registration
- `server/routes/oauth-login.js` - OAuth handler (NEW)
- `server/routes/verify-token.js` - Token verification (NEW)
- `server/routes/auth-status.js` - Auth configuration check (NEW)
- `server/models/User.js` - Added OAuth fields
- `server/index.js` - Added new routes

**Client:**
- `client/app/register/page.js` - Added Google signup
- `client/app/login/page.js` - Already has Google login
- `client/app/api/auth/[...nextauth]/route.js` - NextAuth config (NEW)
- `client/app/providers.js` - SessionProvider (NEW)
- `.env.local.example` - Environment template (NEW)

---

## Testing Checklist

- [ ] Email/password registration works
- [ ] Auto-login after registration works
- [ ] Email/password login works
- [ ] Google sign-up works
- [ ] Google login works
- [ ] JWT token is saved to localStorage
- [ ] Users can access protected pages after login
- [ ] Password strength validation works
- [ ] Duplicate email prevention works

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Google credentials not found" | Make sure `.env.local` has GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET |
| 401 Unauthorized errors | Check JWT_SECRET matches between server and client config |
| Can't redirect after login | Ensure NEXTAUTH_URL is set to http://localhost:3000 |
| NextAuth callback errors | Verify Google OAuth redirect URIs are configured correctly |


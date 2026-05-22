# ✅ Post-Fix Checklist

## 1️⃣ Environment Setup

### Server (.env)
- [ ] MONGODB_URI is set
- [ ] JWT_SECRET is set
- [ ] PORT is set (default: 5000)
- [ ] Optional: GOOGLE_CLIENT_ID (for server-side auth check)
- [ ] Optional: GOOGLE_CLIENT_SECRET (for server-side auth check)

### Client (.env.local)
- [ ] Copy from `.env.local.example` to `.env.local`
- [ ] NEXT_PUBLIC_API_URL = http://localhost:5000
- [ ] GOOGLE_CLIENT_ID = your credentials
- [ ] GOOGLE_CLIENT_SECRET = your credentials
- [ ] NEXTAUTH_SECRET = generated with openssl
- [ ] NEXTAUTH_URL = http://localhost:3000

## 2️⃣ Google OAuth Setup (https://console.cloud.google.com/)

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Application type: Web Application
- [ ] Authorized redirect URIs added:
  ```
  http://localhost:3000/api/auth/callback/google
  http://localhost:3000/api/auth/signin/google
  ```
- [ ] Client ID copied to `.env.local`
- [ ] Client Secret copied to `.env.local`

## 3️⃣ Dependencies

### Server
- [ ] All dependencies installed: `npm install`
- [ ] bcryptjs installed
- [ ] jsonwebtoken installed

### Client
- [ ] All dependencies installed: `npm install`
- [ ] next-auth installed
- [ ] react-hot-toast installed

## 4️⃣ Code Changes

### Server
- [ ] ✅ register.js - Enhanced with validation
- [ ] ✅ oauth-login.js - Created
- [ ] ✅ verify-token.js - Created
- [ ] ✅ auth-status.js - Created
- [ ] ✅ User.js - Updated schema
- [ ] ✅ index.js - Routes added

### Client
- [ ] ✅ register/page.js - Google signup added
- [ ] ✅ login/page.js - Google login support
- [ ] ✅ api/auth/[...nextauth]/route.js - NextAuth configured
- [ ] ✅ providers.js - SessionProvider created

## 5️⃣ Pre-Launch Testing

- [ ] Server starts without errors: `npm run dev`
- [ ] Client starts without errors: `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Register page loads
- [ ] Login page loads
- [ ] Google button appears (if credentials set)

## 6️⃣ Feature Testing

### Registration
- [ ] Can register with valid email/password
- [ ] Password strength validation works
- [ ] Duplicate email rejected with error
- [ ] Auto-login after registration works
- [ ] Redirects to home page after registration
- [ ] Can see user profile/name

### Email/Password Login
- [ ] Can login with registered credentials
- [ ] Invalid credentials rejected
- [ ] Session persists after refresh
- [ ] Can access protected pages

### Google OAuth (if configured)
- [ ] Google button is clickable
- [ ] Can sign up with Google
- [ ] Can login with Google
- [ ] User profile populated from Google
- [ ] Can login with Google multiple times
- [ ] Existing email can be linked to Google

## 7️⃣ Production Checklist

- [ ] Update NEXTAUTH_URL to your production domain
- [ ] Add production redirect URIs to Google Console
- [ ] Update NEXT_PUBLIC_API_URL for production
- [ ] Enable secure cookies in NextAuth config
- [ ] Set NEXTAUTH_SECRET to secure random value
- [ ] Configure CORS for production domain

## 🐛 Troubleshooting

If something doesn't work:

1. **Check Server Logs**
   ```bash
   cd server
   npm run dev
   ```
   Look for MongoDB connection errors or route registration issues

2. **Check Client Logs**
   ```bash
   cd client
   npm run dev
   ```
   Check browser console for NextAuth or API errors

3. **Verify Endpoints**
   ```bash
   curl http://localhost:5000/api/auth/google-status
   ```
   Should return: `{"configured":false,"message":"Google OAuth not configured"}`
   (or true if credentials are set)

4. **Clear Cache**
   - Delete `.next` folder
   - Clear browser cookies
   - Clear localStorage

5. **Check Database**
   - Verify MongoDB connection
   - Check if User collection exists
   - Verify user records are created

## 📞 Common Issues & Fixes

| Error | Fix |
|-------|-----|
| NextAuth secret is missing | Add NEXTAUTH_SECRET to .env.local |
| Can't register | Check API_URL is correct in .env.local |
| Google button shows but redirect fails | Verify OAuth redirect URIs in Google Console |
| Auto-login doesn't work | Ensure JWT_SECRET is same on both server and client configs |
| MongoDB connection error | Check MONGODB_URI and network connectivity |
| CORS errors | Server already allows all origins in development |

## ✨ Success Criteria

- [x] Registration works without errors
- [x] Email/password login works
- [x] Google OAuth is configured (optional but recommended)
- [x] Users can access protected pages after login
- [x] Sessions persist on page refresh
- [x] No console errors in browser
- [x] No server errors on requests

---

Once all checkboxes are completed, your application is ready for use! 🚀

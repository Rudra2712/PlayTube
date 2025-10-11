# PlayTube Deployment Instructions

## 🚀 Deployed URLs
- **Frontend**: https://play-tube-frontend-tau.vercel.app/
- **Backend**: https://play-tube-backend-flax.vercel.app/

## ✅ Configuration Changes Made

### Frontend Configuration
1. **Environment Variables Updated**:
   - `.env`: `VITE_API_BASE_URL=https://play-tube-backend-flax.vercel.app/api/v1`
   - `.env.production`: Same as above

2. **Code Updates**:
   - `axios.helper.js`: Now uses environment variable for base URL
   - `SignUp.jsx`: Updated to use relative API paths
   - `Channel.jsx`: Updated to use relative API paths  
   - `authSlice.js`: Updated to use relative API paths

3. **Vercel Configuration**:
   - Added `vercel.json` for SPA routing support
   - Configured CORS headers

### Backend Configuration
1. **Environment Variables Updated**:
   - `CORS_ORIGIN=https://play-tube-frontend-tau.vercel.app`

2. **CORS Configuration**:
   - Backend now accepts requests from the frontend domain
   - Credentials enabled for authentication

## 🔧 Environment Variables Setup

### Frontend (.env)
```
VITE_API_BASE_URL=https://play-tube-backend-flax.vercel.app/api/v1
```

### Backend (.env)
```
CORS_ORIGIN=https://play-tube-frontend-tau.vercel.app
PORT=8000
MONGODB_URI=mongodb+srv://rudramoradiya2712:newpassword1234@cluster0.apitfk4.mongodb.net
ACCESS_TOKEN_SECRET=6d7acf914d8d25c5c15a591617b785a0cd6e1eb3c927214985718fee79344b98
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=143db1544e7b7e1a57e3d7e3b6f477ba35a8dddd378d1f0fa4bd25327eb712f2
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=dmixra4bk
CLOUDINARY_API_KEY=851813235783557
CLOUDINARY_API_SECRET=d20WkM0H6-3SPYsx5cviW7K4czs
```

## 📝 Deployment Steps

### For Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Add environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL=https://play-tube-backend-flax.vercel.app/api/v1`

### For Backend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the build command: `npm install`
3. Add all environment variables in Vercel dashboard
4. Ensure the start script points to your main file

## 🔍 Testing Checklist
- [ ] Frontend loads correctly
- [ ] API calls work (check network tab)
- [ ] Authentication works (login/signup)
- [ ] File uploads work (videos, images)
- [ ] CORS errors are resolved
- [ ] All features functional

## 🚨 Important Notes
1. **CORS**: Make sure both domains are correctly configured
2. **Environment Variables**: Ensure all env vars are set in Vercel dashboard
3. **Database**: MongoDB connection should work from Vercel
4. **Cloudinary**: File uploads should work with provided credentials
5. **Authentication**: Cookies should work across domains

## 🔧 Troubleshooting
- If CORS errors occur, check the CORS_ORIGIN in backend
- If API calls fail, verify VITE_API_BASE_URL in frontend
- If authentication fails, check cookie settings and CORS credentials
- If builds fail, check environment variables in Vercel dashboard

Your PlayTube application is now configured for production deployment! 🎉
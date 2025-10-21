# Deployment Guide for EduExpress International

## Required Environment Variables

To fix the 404 NOT_FOUND errors, you need to set these environment variables in your Vercel dashboard:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/rakibnuists-projects/edxbd
- Go to Settings → Environment Variables

### 2. Add These Required Variables:

#### Database (CRITICAL - Required for app to work)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduexpressint?retryWrites=true&w=majority
```

#### Authentication (Required for admin features)
```
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Optional (for full functionality)
```
NEXT_PUBLIC_META_PIXEL_ID=1234567890
META_ACCESS_TOKEN=your-meta-access-token-here
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
INDEXNOW_API_KEY=your-indexnow-api-key
```

### 3. Redeploy After Adding Variables
- After adding environment variables, trigger a new deployment
- The app should work properly once MONGODB_URI is set

## Testing the Fix

1. **Test Health Endpoint**: https://www.eduexpressint.com/api/health
2. **Test Main Page**: https://www.eduexpressint.com/
3. **Test Test Page**: https://www.eduexpressint.com/test

## Common Issues

- **404 NOT_FOUND**: Usually caused by missing MONGODB_URI
- **Database Connection**: Make sure MongoDB URI is correct
- **Build Errors**: Check Vercel build logs for specific errors

## Support

If issues persist, check:
1. Vercel deployment logs
2. Environment variables are set correctly
3. MongoDB connection is working
4. All required variables are present

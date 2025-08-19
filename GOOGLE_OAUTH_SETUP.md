# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`

## Step 2: Update Environment Variables

Replace the placeholder values in your `.env` file:

```env
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

## Step 3: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/signin`
3. You should see both email/password login and "Sign in with Google" options
4. Click "Sign in with Google" to test OAuth flow

## Features Added

✅ **Google OAuth Provider**: Users can sign in with their Google accounts
✅ **Fallback to Credentials**: Existing email/password login still works
✅ **Proper Database Schema**: Updated to support multiple OAuth accounts per user
✅ **User Interface**: Clean integration with existing design
✅ **Error Handling**: Proper error messages for failed OAuth attempts

## Important Notes

- Users who sign up with Google will have a `null` password in the database
- Users can potentially link both Google OAuth and credentials to the same email
- The system will automatically create user accounts for new Google sign-ins
- User profile information (name, email, image) will be populated from Google

## Security Considerations

- Keep your `GOOGLE_CLIENT_SECRET` secure and never commit it to version control
- Use environment-specific callback URLs
- Consider implementing email verification for credential-based signups to match OAuth security
- The `AUTH_SECRET` should be a strong, randomly generated string

## Next Steps (Optional)

Consider adding:
- [ ] More OAuth providers (GitHub, Facebook, etc.)
- [ ] Account linking functionality
- [ ] Email verification for credential signups
- [ ] Profile management for OAuth users
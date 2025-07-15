# Database Setup Instructions

## Setting up User Profiles in Supabase

### 1. Create the user_profiles table

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-setup.sql` into the editor
4. Run the script

This will create:

- `user_profiles` table with proper relationships to `auth.users`
- Row Level Security (RLS) policies
- Automatic triggers to create user profiles on signup
- Admin and user role support

### 2. Verify the setup

After running the script, you should see:

- A new `user_profiles` table in your database
- RLS policies in the Authentication > Policies section
- Triggers in the Database > Functions section

### 3. Test the authentication flow

1. Try signing up with email/password
2. Try signing in with Google
3. Check that user profiles are created automatically

### 4. Set up an admin user (optional)

To make yourself an admin:

1. Sign up or sign in to your account
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user ID
4. Run this SQL in the SQL Editor:
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE id = 'your-user-id-here';
   ```

## Features Implemented

### Authentication

- ✅ Google OAuth sign-in
- ✅ Email/password sign-up
- ✅ Email/password sign-in
- ✅ Automatic user profile creation
- ✅ Role-based access control (admin/user)
- ✅ Toast notifications for success/error states
- ✅ Loading states during authentication
- ✅ Form validation

### User Profile Management

- ✅ Automatic profile creation on signup/signin
- ✅ Profile data from Google OAuth (name, avatar)
- ✅ Role assignment (default: user)
- ✅ Row Level Security policies
- ✅ Admin can manage all users

### UI/UX Improvements

- ✅ Responsive forms with validation
- ✅ Loading states and disabled buttons
- ✅ Success/error toast notifications
- ✅ Automatic redirects after authentication
- ✅ Form field validation

## Troubleshooting

### If user profiles aren't being created:

1. Check the Supabase logs in the Dashboard
2. Verify the `user_profiles` table exists
3. Check that RLS policies are enabled
4. Ensure the trigger function is working

### If Google OAuth isn't working:

1. Verify Google OAuth is configured in Supabase
2. Check the redirect URL settings
3. Ensure your domain is allowed in Google Console

### If forms aren't submitting:

1. Check browser console for errors
2. Verify all required fields are filled
3. Check network tab for API calls

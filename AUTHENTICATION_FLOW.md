# BizLevel Authentication Flow

## Registration

1. User navigates to /signup
2. User enters email, password, and profile information
3. System creates user record in Supabase Auth
4. System creates user profile record in Users table
5. User is redirected to onboarding or dashboard

## Login

1. User navigates to /signin
2. User enters email and password
3. System authenticates against Supabase Auth
4. System updates last_login timestamp
5. User is redirected to dashboard

...

# Supabase Setup Guide for ERIO Dashboard

This guide will help you set up Supabase for the ERIO Dashboard application.

## Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Your Supabase project URL and API key

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `erio-dashboard` (or your preferred name)
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Wait for the project to be created (takes a few minutes)

### 2. Get Your Project Credentials

1. Go to Project Settings > API
2. Copy your:
   - **Project URL**: `https://nazsvhwjaeeaugnqavwe.supabase.co`
   - **anon/public key**: `sb_publishable_pYnTOcoC0-CtX_5AyMJaIA_8snZ8HJH`

### 3. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the SQL
5. Verify that all tables were created:
   - `dashboard_stats`
   - `partner_universities`
   - `recent_activities`
   - `admin_users`

### 4. Seed Initial Data

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `supabase/seed-data.sql`
3. Click **Run** to insert all 76 partner universities
4. Verify the data was inserted by checking the `partner_universities` table

### 5. Configure Environment Variables

1. In your project root, create a `.env` file (if it doesn't exist):
   ```env
   VITE_SUPABASE_URL=https://nazsvhwjaeeaugnqavwe.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_pYnTOcoC0-CtX_5AyMJaIA_8snZ8HJH
   ```

2. **Important**: Add `.env` to your `.gitignore` file to keep credentials secure

### 6. Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` which is needed for Supabase integration.

### 7. Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the dashboard in your browser
3. Try logging in with admin credentials:
   - Email: `paung_230000001724@uic.edu.ph`
   - Password: `erio2026pass!`

## Database Tables

### `dashboard_stats`
Stores dashboard statistics (partner count, agreements, exchanges, etc.)

### `partner_universities`
Stores all 76 partner university information with coordinates

### `recent_activities`
Stores recent activity/news items

### `admin_users`
Stores admin user accounts for authentication

## Row Level Security (RLS)

The schema includes RLS policies:
- **Public Read Access**: Anyone can read dashboard stats, partners, and activities
- **Admin Write Access**: Only authenticated admins can create/update/delete data

**Note**: The current RLS policies allow all operations. In production, you should:
1. Implement proper authentication using Supabase Auth
2. Create more restrictive RLS policies
3. Use service role key for admin operations (never expose this in frontend)

## Security Recommendations

1. **Never commit `.env` file** - Keep it in `.gitignore`
2. **Use Environment Variables** - Store credentials in environment variables
3. **Enable RLS** - Row Level Security is already enabled
4. **Use Service Role Key** - For admin operations, consider using a backend API with service role key
5. **Hash Passwords** - Currently passwords are stored as plain text. In production, use proper password hashing (bcrypt) or Supabase Auth

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and API key are correct
- Check that your Supabase project is active
- Ensure RLS policies allow the operations you're trying to perform

### Authentication Issues
- Verify the admin user exists in `admin_users` table
- Check that the password matches exactly
- Ensure RLS policies allow admin operations

### Data Not Loading
- Check browser console for errors
- Verify tables exist in Supabase dashboard
- Check that seed data was inserted correctly

## Next Steps

1. **Set up proper authentication**: Consider using Supabase Auth for better security
2. **Add password hashing**: Implement bcrypt for password storage
3. **Create backend API**: For sensitive operations, create a backend API using Supabase service role key
4. **Set up backups**: Configure automatic backups in Supabase dashboard

## Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Review browser console for errors
3. Verify SQL queries executed successfully
4. Check RLS policies are configured correctly

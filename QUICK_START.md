# Quick Start Guide - Supabase Integration

## ✅ What's Been Done

1. ✅ Installed `@supabase/supabase-js` package
2. ✅ Created Supabase client configuration (`src/lib/supabase.js`)
3. ✅ Created new API service using Supabase (`src/services/supabaseApi.js`)
4. ✅ Updated all components to use Supabase API
5. ✅ Created database schema SQL files

## 🚀 Next Steps

### 1. Set Up Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://nazsvhwjaeeaugnqavwe.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_pYnTOcoC0-CtX_5AyMJaIA_8snZ8HJH
```

**Note**: Make sure this is the correct **anon/public key** from your Supabase dashboard (Settings > API > anon public key). The key you provided starts with `sb_publishable_` which is unusual - please verify it's the correct anon key.

### 2. Set Up Database in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste the contents of `supabase/schema.sql`
6. Click **Run** to create all tables
7. Create another query and run `supabase/seed-data.sql` to insert all 76 partner universities

### 3. Verify Admin User

The schema will create an admin user with:
- Email: `paung_230000001724@uic.edu.ph`
- Password: `erio2026pass!`

**Important**: Currently passwords are stored as plain text. In production, you should:
- Use Supabase Auth for proper authentication
- Or implement bcrypt password hashing

### 4. Test the Application

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Try logging in with admin credentials
3. Test creating/editing partners and activities
4. Verify data persists in Supabase dashboard

## 📋 Files Created/Modified

- `src/lib/supabase.js` - Supabase client configuration
- `src/services/supabaseApi.js` - All API functions using Supabase
- `supabase/schema.sql` - Database schema
- `supabase/seed-data.sql` - Initial partner data
- `SUPABASE_SETUP.md` - Detailed setup guide
- Updated all components to use `supabaseApi` instead of `api`

## 🔒 Security Notes

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Verify API Key** - Make sure you're using the anon/public key, not the service role key
3. **RLS Policies** - Currently set to allow all operations. In production, implement proper authentication
4. **Password Security** - Consider using Supabase Auth or proper password hashing

## 🐛 Troubleshooting

### "Invalid API key" error
- Verify your Supabase URL and anon key are correct
- Check that the key is the **anon/public** key, not service role key

### "Table doesn't exist" error
- Make sure you ran `supabase/schema.sql` in Supabase SQL Editor
- Check that all tables were created successfully

### Login not working
- Verify admin user exists in `admin_users` table
- Check that password matches exactly (currently plain text)
- Check browser console for errors

### Data not loading
- Check Supabase dashboard to verify data exists
- Check browser console for errors
- Verify RLS policies allow read access

## 📚 Documentation

- See `SUPABASE_SETUP.md` for detailed setup instructions
- Supabase Docs: https://supabase.com/docs

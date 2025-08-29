# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: `abrazo-west-trauma`
   - Database Password: (save this securely)
   - Region: Choose nearest to your location
4. Click "Create new project"

## 2. Run Database Migrations

1. Once project is created, go to SQL Editor in Supabase dashboard
2. Open `migrations/001_initial_setup.sql`
3. Copy the entire SQL content
4. Paste into SQL Editor
5. Click "Run" to execute

## 3. Get Your API Keys

1. Go to Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Update `.env.local` with these values

## 4. Verify Setup

After running migrations, verify:
- `files` table exists in Table Editor
- `guidelines` storage bucket exists in Storage
- RLS policies are enabled

## Database Schema

### Files Table
- `id` - UUID primary key
- `created_at` - Timestamp
- `title` - Document title
- `description` - Optional description
- `file_url` - URL to file in storage
- `category` - Enum: resident_guidelines, cpgs, trauma_policies, resources

### Storage
- Bucket: `guidelines` (public read access)
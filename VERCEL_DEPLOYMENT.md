# Vercel Deployment Instructions

## Quick Deploy Steps

1. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository: `UOchris1/awctrauma-website`
   - Choose the `main` branch

2. **Configure Environment Variables:**
   In Vercel dashboard, add these environment variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://umivnjhsafvlazjohqhj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaXZuamhzYWZ2bGF6am9ocWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzgzODYsImV4cCI6MjA3MjAxNDM4Nn0.VFN_CpyBOAC4AiSrKR0eo-QFgDCuOXeylCprs6nduug
   ADMIN_PASSWORD=#Mycomputer1!
   ```

3. **Configure Custom Domain:**
   - In Vercel project settings, go to "Domains"
   - Add `awctrauma.org`
   - Follow Vercel's instructions to update your Namecheap DNS settings:
     - Add CNAME record: `www` pointing to `cname.vercel-dns.com`
     - Add A record: `@` pointing to `76.76.21.21`

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

## Post-Deployment Setup

### 1. Set up Supabase Tables
If not already done, run the migration script in your Supabase dashboard:
- Go to SQL Editor in Supabase
- Run the script from `supabase/migrations/001_initial_setup.sql`

### 2. Upload PDF Files
- Visit `https://awctrauma.org/admin`
- Login with your admin password
- Upload PDFs to the appropriate categories

### 3. Test the Site
- Main page: `https://awctrauma.org`
- Admin panel: `https://awctrauma.org/admin`
- PDF viewer: Click on any uploaded PDF

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `ADMIN_PASSWORD` | Password for admin panel access | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your domain (auto-set by Vercel) | No |

## Troubleshooting

### Files not showing up
- Check Supabase connection in Vercel logs
- Verify environment variables are set correctly
- Ensure Supabase tables are created

### Admin login not working
- Verify ADMIN_PASSWORD is set in Vercel environment variables
- Check browser console for errors
- Clear cookies and try again

### Domain not working
- DNS changes can take up to 48 hours to propagate
- Verify DNS settings in Namecheap match Vercel's requirements
- Check domain status in Vercel dashboard

## Support
For issues, check the Vercel deployment logs or contact support.
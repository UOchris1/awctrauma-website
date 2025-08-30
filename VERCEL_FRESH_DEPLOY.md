# Fresh Vercel Deployment Instructions

Since Vercel is stuck on an old commit, create a fresh deployment:

## Steps:

1. **Delete the current Vercel project** (optional but recommended):
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Advanced → Delete Project

2. **Create a new Vercel project**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `UOchris1/awctrauma-website`
   - Choose the `main` branch
   - Click "Import"

3. **Configure Environment Variables**:
   Add these in the Vercel deployment screen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://umivnjhsafvlazjohqhj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaXZuamhzYWZ2bGF6am9ocWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzgzODYsImV4cCI6MjA3MjAxNDM4Nn0.VFN_CpyBOAC4AiSrKR0eo-QFgDCuOXeylCprs6nduug
   ADMIN_PASSWORD=#Mycomputer1!
   ```

4. **Deploy**:
   - Click "Deploy"
   - This will use the latest code from the main branch

5. **Add Custom Domain**:
   - After deployment, go to Settings → Domains
   - Add `awctrauma.org`
   - Follow DNS instructions for Namecheap

## Why This Works:
- Fresh project ensures no cached builds
- Will pull latest code from main branch (commit da10932)
- Includes all TypeScript fixes
- Clean slate deployment

## Alternative: Manual Deploy via CLI

If you prefer CLI:

```bash
npm i -g vercel
vercel --prod
```

When prompted:
- Set up and deploy: Y
- Which scope: Select your account
- Link to existing project: N
- Project name: awctrauma-website
- Directory: ./
- Override settings: N
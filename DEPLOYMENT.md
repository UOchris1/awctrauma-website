# Deployment Checklist

## Pre-Deployment

### Code Preparation
- [ ] All code committed to Git
- [ ] Build runs successfully locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All tests passing (if applicable)

### Environment Setup
- [ ] `.env.example` file is up to date
- [ ] All required environment variables documented
- [ ] Admin password is strong and secure
- [ ] Supabase project created and configured

### Database Setup
- [ ] Supabase tables created
- [ ] Storage bucket `guidelines` created
- [ ] Bucket set to public access
- [ ] RLS policies configured (if needed)
- [ ] Initial data seeded (if applicable)

## Deployment Process

### Vercel Setup
- [ ] GitHub repository connected to Vercel
- [ ] Project imported in Vercel dashboard
- [ ] Build settings confirmed:
  - Framework: Next.js
  - Node Version: 18.x or higher
  - Build Command: `npm run build`
  - Output Directory: `.next`

### Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` added
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added
- [ ] `ADMIN_PASSWORD` added (Production value)
- [ ] `NEXT_PUBLIC_SITE_URL` added

### Initial Deployment
- [ ] Deploy triggered
- [ ] Build logs reviewed for errors
- [ ] Deployment successful

## Post-Deployment Verification

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] Files are displayed properly
- [ ] PDF links work correctly
- [ ] Admin login works (`/login`)
- [ ] File upload works (`/admin`)
- [ ] Logout functionality works
- [ ] Mobile responsive design verified

### SEO & Accessibility
- [ ] robots.txt accessible at `/robots.txt`
- [ ] sitemap.xml accessible at `/sitemap.xml`
- [ ] Meta tags present in page source
- [ ] Skip navigation link works
- [ ] Keyboard navigation functional

### Performance
- [ ] Lighthouse score > 90 for Performance
- [ ] Lighthouse score > 90 for Accessibility
- [ ] Lighthouse score > 90 for Best Practices
- [ ] Lighthouse score > 90 for SEO
- [ ] Core Web Vitals passing

### Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Admin routes protected
- [ ] Environment variables not exposed
- [ ] CORS configured properly
- [ ] Rate limiting considered

## Production Configuration

### Custom Domain (Optional)
- [ ] Domain purchased/available
- [ ] DNS configured in domain provider
- [ ] Domain added in Vercel settings
- [ ] SSL certificate generated (automatic)
- [ ] Redirects configured (www → non-www or vice versa)

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring configured (optional)
- [ ] Performance budgets set

### Backup Strategy
- [ ] Database backup schedule configured
- [ ] Storage backup plan in place
- [ ] Recovery procedure documented

## Maintenance Plan

### Regular Checks (Weekly)
- [ ] Check Vercel dashboard for errors
- [ ] Monitor performance metrics
- [ ] Review usage statistics

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review and optimize storage usage
- [ ] Audit uploaded documents
- [ ] Check for security updates

### Documentation
- [ ] README.md is current
- [ ] API documentation updated
- [ ] Admin guide provided to staff
- [ ] Support contact information updated

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**
   - Use Vercel's instant rollback feature
   - Revert to previous deployment from dashboard

2. **Database Issues**
   - Restore from Supabase backup
   - Verify data integrity

3. **Critical Bugs**
   - Create hotfix branch
   - Apply minimal fix
   - Deploy through standard process

## Support Contacts

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Internal IT**: [Your contact]
- **Developer Team**: [Your contact]

## Notes

_Add any deployment-specific notes here_

---

Last Updated: [Current Date]
Deployment Version: 1.0.0
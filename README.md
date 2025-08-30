# Abrazo West Trauma Center Resources
<!-- Deployment: 2025-01-30 - v0.1.1 -->

A professional web application providing medical staff with easy access to trauma center resources, guidelines, and policies.

## Features

- 📱 Mobile-first responsive design
- 🔒 Secure admin portal for content management
- 📄 PDF document management system
- ⚡ Fast, server-side rendered pages
- ♿ WCAG 2.1 AA compliant
- 🔄 Real-time content updates
- 📊 Organized categorization system

## Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Cookie-based sessions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/awctrauma-website.git
cd awctrauma-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Create the following table structure:
   ```sql
   CREATE TABLE files (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     title TEXT NOT NULL,
     description TEXT,
     file_url TEXT NOT NULL,
     category TEXT NOT NULL CHECK (category IN ('resident_guidelines', 'cpgs', 'trauma_policies', 'resources'))
   );
   ```
   - Create a storage bucket named `guidelines` with public access
   - Copy your project URL and anon key to `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub

2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

4. Deploy the application

### Post-Deployment Checklist

- [ ] Test file upload functionality
- [ ] Verify admin authentication works
- [ ] Check all PDF links are accessible
- [ ] Test on mobile devices
- [ ] Monitor Core Web Vitals in Vercel Analytics
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate (automatic with Vercel)

## Admin Guide

### Accessing the Admin Portal

1. Navigate to `/login` or click "Admin Login" in footer
2. Enter the admin password (set in `ADMIN_PASSWORD` env variable)
3. Access the upload interface at `/admin`

### Uploading Files

1. Click "browse files" or drag and drop a PDF file
2. Enter a descriptive title (required)
3. Add an optional description for better searchability
4. Select the appropriate category:
   - **Resident Guidelines**: Training materials and guidelines for residents
   - **Clinical Practice Guidelines (CPGs)**: Clinical protocols and best practices
   - **Trauma Policies**: Official trauma center policies and procedures
   - **Useful Links & Resources**: Additional resources and reference materials
5. Click "Upload File"

### File Management Best Practices

- Use clear, descriptive titles (e.g., "2024 Trauma Activation Protocol v2")
- Include version numbers when applicable
- Add descriptions with keywords for better searchability
- Ensure PDFs are optimized for web (compressed, under 10MB)
- Regularly review and remove outdated documents

## Development

### Project Structure

```
awctrauma-website/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── login/             # Authentication pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Header.tsx        # Site header
│   ├── Footer.tsx        # Site footer
│   ├── FileCard.tsx      # File display component
│   └── ErrorMessage.tsx  # Error handling
├── lib/                   # Utility functions
│   ├── supabase.ts       # Database configuration
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── .taskmaster/          # Task management files
```

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Server components where possible
- Tailwind CSS for styling
- ESLint for code quality

## Maintenance

### Regular Tasks

- **Weekly**: Check error logs in Vercel dashboard
- **Monthly**: Review and update npm dependencies
- **Monthly**: Monitor Supabase storage usage (free tier: 1GB)
- **Quarterly**: Audit and remove outdated documents
- **Quarterly**: Review user feedback and feature requests

### Troubleshooting

**File uploads failing**
- Check Supabase storage bucket permissions
- Verify file size is under 10MB
- Ensure file type is PDF
- Check network connectivity

**Authentication issues**
- Verify `ADMIN_PASSWORD` environment variable is set
- Clear browser cookies and try again
- Check middleware configuration in `middleware.ts`

**Performance issues**
- Review Vercel Analytics for slow pages
- Check Supabase query performance
- Optimize PDF file sizes
- Enable caching headers

**Database connection errors**
- Verify Supabase credentials in environment variables
- Check Supabase service status
- Review connection pool limits

## Security

- Admin password stored as environment variable
- HTTP-only cookies for session management
- Middleware protection for admin routes
- Input validation on file uploads
- Supabase Row Level Security (RLS) recommended for production

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

Proprietary - Abrazo West Campus. All rights reserved.

## Support

For technical support or questions:
- Technical Issues: [Create an issue](https://github.com/your-org/awctrauma-website/issues)
- General Inquiries: contact IT support

---

Built with ❤️ for Abrazo West Campus Level 1 Trauma Center
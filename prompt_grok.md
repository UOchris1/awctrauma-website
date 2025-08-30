(base) PS C:\projects\awctrauma-website> npm run build

abrazo-west-trauma@0.1.1 build
next build
   ▲ Next.js 15.5.2
   - Environments: .env.local, .env.production, .env
   - Experiments (use with caution):
     · serverActions
   Creating an optimized production build ...
 ✓ Compiled successfully in 19.8s
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ⚠ Unsupported metadata viewport is configured in metadata export in /_not-found. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /admin. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /login. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /test. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ✓ Generating static pages (11/11)
 ✓ Collecting build traces
 ✓ Finalizing page optimization
Route (app) Size First Load JS Revalidate Expire
┌ ○ / 945 B 106 kB 5m 1y
├ ○ /_not-found 993 B 103 kB
├ ○ /admin 2.2 kB 104 kB
├ ƒ /api/auth 132 B 102 kB
├ ƒ /api/upload 132 B 102 kB
├ ○ /login 989 B 103 kB
├ ○ /robots.txt 132 B 102 kB
├ ○ /sitemap.xml 132 B 102 kB
├ ○ /test 945 B 106 kB
└ ƒ /viewer/[id] 162 B 106 kB


First Load JS shared by all 102 kB
  ├ chunks/255-e3bf15caf1f1e0f9.js 45.7 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js 54.2 kB
  └ other shared chunks (total) 1.99 kB
ƒ Middleware 33 kB
○ (Static) prerendered as static content
ƒ (Dynamic) server-rendered on demand
(base) PS C:\projects\awctrauma-website>
Thought for 11sTo resolve the warnings about unsupported viewport metadata in your Next.js 15 build, update the affected pages or layouts (e.g., app/_not-found/page.tsx, app/admin/page.tsx, app/login/page.tsx, app/test/page.tsx, and the root app/page.tsx or app/layout.tsx if shared). These warnings don't block the build but indicate a deprecated pattern—viewport config must now be exported separately via a viewport constant or generateViewport function.
Step-by-Step Fix

Locate the Viewport Config: In each file with the warning, look for an export const metadata object that includes a viewport property, like:
typescriptexport const metadata = {
  title: 'Page Title',
  viewport: 'width=device-width, initial-scale=1',  // This is the issue
  // other metadata
}

Refactor to Separate Export: Split it out. Use one of these options (both work; the function is more flexible for dynamic values):

Static Object:
typescriptexport const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Add other viewport options if needed, like maximumScale: 1, userScalable: false
}

export const metadata = {
  title: 'Page Title',
  // other metadata without viewport
}

Function (if you need logic):
typescriptexport function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    // other options
  }
}

export const metadata = {
  title: 'Page Title',
  // other metadata
}



Apply to All Affected Routes:

For /_not-found: Edit app/_not-found/page.tsx or its layout.
For /admin: Edit app/admin/page.tsx.
For /login: Edit app/login/page.tsx.
For /test: Edit app/test/page.tsx.
For / (root): Edit app/page.tsx or app/layout.tsx (if the viewport is in a shared layout, fixing it there might resolve multiple warnings at once).


Test Locally: After changes, run npm run build again to confirm the warnings are gone. If any persist, check for viewport in parent layouts.
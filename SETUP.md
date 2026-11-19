# Adhyayan Academy website: setup guide (start here)

Admins already built in: aryankatoch236@gmail.com and ssarthak558@gmail.com

## 1. GitHub
Create a private repository. Upload everything in this folder (not the ZIP itself). Do not upload `.env.local`.

## 2. Supabase (free)
1. Create a project at supabase.com.
2. SQL Editor -> paste ALL of `supabase/schema.sql` -> Run. (Creates tables, 7 courses, storage and the two admin emails.)
3. Authentication -> URL Configuration -> Site URL: your Vercel link. Redirect URLs: add `https://YOUR-SITE.vercel.app/auth/callback`.
4. Authentication -> SMTP Settings (recommended): use your Gmail and App Password so sign-in links are not rate-limited.
5. Project Settings -> API: copy the Project URL, anon key and service_role key.

## 3. Vercel
Import the GitHub repo. Add these Environment Variables, then Deploy:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_SITE_URL  (your final site address, e.g. https://adhayayan-academy.vercel.app)
- SUPABASE_SERVICE_ROLE_KEY  (secret, never share)
- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=465
- SMTP_USER  (Gmail that sends the emails)
- SMTP_PASS  (Gmail App Password: Google Account -> Security -> 2-Step Verification -> App passwords)
- MAIL_FROM  (e.g. Adhyayan Academy <your-gmail@gmail.com>)

## 4. First login
Open `/admin/login`, enter your Gmail, press "Email me a sign-in link", open the link on the same device.

## 5. Fill the site
In /admin: Settings (WhatsApp as 918971806043, logo, hero image), Videos (paste YouTube links), Gallery, Faculty, Toppers, Reviews, FAQs. Add more admins in the Admins tab.

## 6. Test
Send a test enquiry from the website. It should appear under Enquiries and arrive by email to both admins.

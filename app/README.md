# Adhyayan Academy

Mobile-first coaching institute website for Adhyayan Academy in Shahpur, Kangra. Public content is stored in Supabase and edited in the owner-only `/admin` dashboard. Empty media sections stay hidden; the hero and brand use a designed text/graphic fallback until photos or a logo are added.

## Run locally

Requirements: Node.js 20.9 or newer (npm is included). In the project folder:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The public pages have seeded fallback settings and courses even before Supabase is connected. The dashboard and enquiry form require Supabase configuration.

## Supabase setup

1. Create a Supabase project and copy its project URL, anon/publishable key, and service-role key from **Project Settings → API**.
2. Open **SQL Editor**, paste the full contents of `supabase/schema.sql`, and run it. This creates the tables, seed settings and seven courses, row-level security policies, and the `academy-media` storage bucket.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` for local work.
4. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters in `.env.local`. From Node 20.9+, run `npm run admin:create`. This creates or updates that Supabase Auth user and grants owner access. The service-role key is used only by this one-time local script. Never add it to a `NEXT_PUBLIC_` variable or to Vercel's client-exposed environment.
5. Restart the development server, open `/admin`, and sign in with the owner email and password.

The database script is safe to re-run: it keeps edited settings and course content, and upserts only missing seed rows. It refreshes the app's access policies.

## Deploy to Vercel

1. Push this source to a private or public Git repository and import it in Vercel.
2. In **Project Settings → Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` set to the production domain (for example `https://www.example.com`). Add `NEXT_PUBLIC_GA_ID` only if you want an environment-level analytics fallback; the owner can also set the GA4 measurement ID in `/admin → Settings`.
3. Do **not** add the service-role key to Vercel; it is only needed when running the local first-admin script. Do not deploy `ADMIN_PASSWORD`.
4. Deploy. In Supabase **Authentication → URL Configuration**, set the production site URL and allow the production `/admin` login redirect. Add localhost URLs only for local development.
5. Verify the public home page, course URLs, enquiry form, and `/admin` login on the deployed domain. Keep the Supabase service-role key in your password manager and rotate it if it is ever exposed.

## Owner guide

- **Logo / hero:** `/admin → Settings` has separate image upload buttons. The first image is converted to WebP and attached immediately. Empty logo uses the Academy name, and empty hero uses the designed graphic panel.
- **Photos:** choose Gallery, Faculty, Toppers or Courses, then upload one or several images. JPG, PNG and WebP are accepted up to 5 MB each. The browser resizes to fit within 1600 × 1600 pixels and saves as WebP. Edit each item to add a caption, description or alt text; use drag and drop or the arrow buttons to reorder; drafts can be unpublished. Delete removes the item and its associated image.
- **Courses:** add or edit course details, categories, duration, optional fee and timing. The slug creates the public page at `/courses/[slug]`. Leave fee empty when it has not been confirmed.
- **YouTube:** add one or more videos in the Videos tab, or paste the main link in Settings. A video appears only when its URL is valid. The preview image loads lazily; playback starts after a visitor taps it.
- **Contact and links:** update phone numbers, WhatsApp, email, address, hours, map embed URL, social links, hero copy, Google Search Console token or GA4 ID in Settings. Tick the WhatsApp confirmation box after checking the number.
- **Enquiries:** filter or search submissions, change the status to new/contacted/admitted, add notes, or export a CSV. The public form saves to Supabase and offers a WhatsApp follow-up after submission.
- **First setup:** the dashboard checklist checks the logo, hero, 10 gallery images, faculty photos, YouTube link and the explicit WhatsApp confirmation as you complete them.

Public content is revalidated about once a minute after a change. Search crawler caches may take longer to refresh generated preview images.

## Database and storage

`supabase/schema.sql` is the source of truth for the schema and seeds. Public visitors can read published content and submit enquiries; owner access is restricted to a `site_admins` membership. Uploaded files are public website media, while inserts, edits and deletes require an authenticated owner. Enquiry management is owner-only.

## Notes

- No photos, student names, faculty profiles, results, reviews, fees, offers or video links have been invented. Those sections remain hidden until content is added.
- The 5.0 Justdial rating and 33 ratings are the values supplied for the brief.
- The map fallback points visitors to Google Maps for the academy address; an embed URL can be set from the admin panel.
- Set a real production domain in `NEXT_PUBLIC_SITE_URL` before submitting the generated sitemap to search engines.

## Admin team, enquiry emails and videos (added)

1. **Run `supabase/migration-admins.sql`** in the Supabase SQL Editor, then add the first admin with
   `insert into public.admin_emails(email) values ('you@gmail.com') on conflict do nothing;`
2. **More admins:** open `/admin` → **Admins**, type an email and press Add. That person signs in at `/admin/login` with **Email me a sign-in link** (no password). In Supabase → Authentication → URL Configuration, add `https://YOUR-SITE/auth/callback` to the redirect URLs.
3. **Enquiry emails:** add these in Vercel → Environment Variables, then redeploy: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS` (a Gmail *App Password*), `MAIL_FROM`, and `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_`). Every admin with "Email me enquiries" ticked receives each new enquiry. `NOTIFY_EMAILS` is an optional extra list. If email is not set up, enquiries are still saved.
4. **Videos:** `/admin` → **Videos**, paste any YouTube link, check the preview, press **Add to website**.
5. Supabase's built-in sign-in emails are limited to a few per hour. For a team, set a custom SMTP (the same Gmail App Password) in Supabase → Authentication → SMTP Settings.

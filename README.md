# CampusSwap (Supabase + Photo Upload)

Ultra-modern Telegram Mini App marketplace with:
- Next.js + Tailwind UI
- Supabase Postgres (listings + reports)
- Supabase Storage image upload (real file upload)
- Admin panel (delete listings + view reports) controlled by env var `ADMIN_USER_IDS`

## 1) Create Supabase project
- Create a new project on Supabase
- Go to SQL Editor → run: `supabase/schema.sql`
- Go to Storage → create bucket `listing-images` (Public ON)

## 2) Get keys
Project Settings → API:
- SUPABASE_URL
- SERVICE_ROLE_KEY (keep secret)

## 3) Create `.env.local`
Create `.env.local` in project root:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_BUCKET=listing-images

# Admins (Telegram user ids)
ADMIN_USER_IDS=123456789
```

Restart dev server after edits.

## 4) Run locally
```bash
npm install
npm run dev
```
Open: http://localhost:3000

## 5) Admin
Open `/admin`. If it says "Not an admin", add your Telegram user id to ADMIN_USER_IDS and restart.

## 6) Telegram Mini App
For local testing inside Telegram use ngrok:
```bash
npx ngrok http 3000
```
Set the HTTPS URL in BotFather Mini App settings.

## Notes
- All DB writes happen on the server (API routes) using SERVICE ROLE key.
- This is MVP. For production you should add spam protection + rate limits.


## Important
- Recommended Node.js: **20+**.
- If you use a publishable/anon key (not service role), run `supabase/schema.sql` and (if uploads fail) `supabase/storage_policies.sql` (MVP, insecure).

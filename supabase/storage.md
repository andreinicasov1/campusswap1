# Storage setup (Supabase)

1) In Supabase dashboard: Storage → Create bucket
   - Name: listing-images (or set SUPABASE_BUCKET)
   - Public: ON (recommended for MVP)

2) (If bucket is NOT public) you must generate signed URLs.
   This project assumes public bucket and stores public URL in `image_url`.

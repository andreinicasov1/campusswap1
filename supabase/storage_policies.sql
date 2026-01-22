-- OPTIONAL (only if you want uploads with ANON/PUBLISHABLE key)
-- Run in Supabase SQL Editor.

drop policy if exists "public insert listing images" on storage.objects;
create policy "public insert listing images"
on storage.objects
for insert
with check (bucket_id = 'listing-images');

drop policy if exists "public select listing images" on storage.objects;
create policy "public select listing images"
on storage.objects
for select
using (bucket_id = 'listing-images');

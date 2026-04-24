-- Add detail fields to book table (all nullable)
alter table public.book
  add column if not exists pages integer,
  add column if not exists dimensions text,
  add column if not exists weight numeric,
  add column if not exists publisher text,
  add column if not exists published_date date,
  add column if not exists description text,
  add column if not exists topics text[],
  add column if not exists pictures text[];

-- Create public storage bucket for book pictures
insert into storage.buckets (id, name, public)
values ('book-pictures', 'book-pictures', true)
on conflict do nothing;

-- Anyone can view pictures
create policy "book_pictures_select" on storage.objects
  for select using (bucket_id = 'book-pictures');

-- Only admins can upload
create policy "book_pictures_insert" on storage.objects
  for insert with check (
    bucket_id = 'book-pictures' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Only admins can delete
create policy "book_pictures_delete" on storage.objects
  for delete using (
    bucket_id = 'book-pictures' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

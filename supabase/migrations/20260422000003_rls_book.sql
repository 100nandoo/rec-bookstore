alter table public.book enable row level security;

create policy "books_select" on public.book for select using (true);

create policy "books_insert" on public.book for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "books_update" on public.book for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "books_delete" on public.book for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

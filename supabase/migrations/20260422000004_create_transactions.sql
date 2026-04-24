create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  payment_method text not null check (payment_method in ('cash', 'paynow', 'paylah')),
  total_amount numeric not null,
  created_at timestamptz default now()
);

create table public.transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade not null,
  book_id uuid references public.book(id) not null,
  title text not null,
  author text not null,
  price numeric not null,
  quantity integer not null default 1,
  location text not null check (location in ('twpc', 'alex'))
);

alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;

create policy "transactions_insert" on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "transactions_select" on public.transactions for select
  using (auth.uid() = user_id);

create policy "transaction_items_insert" on public.transaction_items for insert
  with check (exists (select 1 from public.transactions where id = transaction_id and user_id = auth.uid()));

create policy "transaction_items_select" on public.transaction_items for select
  using (exists (select 1 from public.transactions where id = transaction_id and user_id = auth.uid()));

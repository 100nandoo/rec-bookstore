create table public.book (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  price numeric not null,
  stock_twpc integer not null default 0,
  stock_alex integer not null default 0,
  isbn text
);

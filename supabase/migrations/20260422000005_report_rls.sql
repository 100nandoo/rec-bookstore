-- Allow admins to read all transactions and items for reporting
create policy "transactions_select_admin" on public.transactions for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "transaction_items_select_admin" on public.transaction_items for select
  using (exists (select 1 from public.transactions t
    join public.profiles p on p.id = auth.uid() and p.role = 'admin'
    where t.id = transaction_id));

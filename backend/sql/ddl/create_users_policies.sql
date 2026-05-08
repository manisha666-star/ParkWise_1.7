-- Allow users to SELECT their own data
create policy "Users can select their own data"
on users for select
using (auth.uid() = id);

-- Allow users to INSERT their own row
create policy "Users can insert their own row"
on users for insert
with check (auth.uid() = id);

-- Allow users to UPDATE their own row
create policy "Users can update their own row"
on users for update
using (auth.uid() = id);

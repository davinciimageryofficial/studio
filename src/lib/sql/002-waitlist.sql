
-- Create a table for the waitlist
create table waitlist (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  profession text,
  wants_early_access boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table waitlist
enable row level security;

-- Policies for waitlist table
-- Allow public read access to the waitlist (e.g., for checking status, though we might not implement this on the frontend)
create policy "Waitlist is viewable by everyone." on waitlist
for select using (true);

-- Allow users to be added to the waitlist (this will be done via a server-side function with the service_role key)
-- For simplicity in this context, we will allow authenticated users to insert their own waitlist entry if it doesn't exist
create policy "Users can insert their own waitlist entry." on waitlist
for insert with check (auth.uid() = id);

-- Allow service_role to bypass RLS for administrative tasks
-- This is important for the server action to insert into the table
-- (No explicit policy needed if using service_role key, as it bypasses RLS)

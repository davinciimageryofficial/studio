-- Create waitlist table
create table waitlist (
  id uuid not null primary key,
  email text not null unique,
  full_name text,
  profession text,
  wants_early_access boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table waitlist enable row level security;
create policy "Allow public insert for waitlist." on waitlist for insert with check (true);

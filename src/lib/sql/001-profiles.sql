
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  website text,
  headline text,
  bio text,
  category text,
  skills text[],
  reliability_score integer default 80,
  community_standing text,
  disputes integer default 0
);

alter table profiles
enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
for select using (true);

create policy "Users can insert their own profile." on profiles
for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, category)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'category');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

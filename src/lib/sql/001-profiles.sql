
-- Create the profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  headline text,
  bio text,
  avatar text,
  category text,
  reliability_score int default 80,
  community_standing text,
  disputes int default 0,
  job_title text,
  company text,
  verified boolean default false
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

-- Policy: Profiles are viewable by everyone
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Function to create a public profile for a new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage for Avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using ( auth.uid() = owner ) with check ( bucket_id = 'avatars' );

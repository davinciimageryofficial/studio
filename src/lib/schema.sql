
-- Enable Row Level Security
alter table "users" enable row level security;

-- Create policies for users table
create policy "Public users are viewable by everyone." on users for select using (true);
create policy "Users can insert their own user." on users for insert with check (auth.uid() = id);
create policy "Users can update own user." on users for update using (auth.uid() = id);


-- Represents an agency or a team of freelancers.
create table agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- RLS for agencies
alter table agencies enable row level security;
create policy "Agencies are viewable by their owner." on agencies for select using (auth.uid() = owner_id);
create policy "Owners can insert their own agency." on agencies for insert with check (auth.uid() = owner_id);
create policy "Owners can update their own agency." on agencies for update using (auth.uid() = owner_id);


-- Represents a client of an agency.
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  agency_id uuid references agencies(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- RLS for clients
alter table clients enable row level security;
create policy "Clients are viewable by their agency owner." on clients for select using (exists (select 1 from agencies where agencies.id = clients.agency_id and agencies.owner_id = auth.uid()));


-- Represents a project undertaken by an agency for a client.
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  agency_id uuid references agencies(id) not null,
  client_id uuid references clients(id) not null,
  status text not null default 'active', -- e.g., 'active', 'completed', 'paused'
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- RLS for projects
alter table projects enable row level security;
create policy "Projects are viewable by their agency owner." on projects for select using (exists (select 1 from agencies where agencies.id = projects.agency_id and agencies.owner_id = auth.uid()));


-- Stores monthly financial and operational metrics for an agency.
create table monthly_metrics (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) not null,
  month date not null, -- First day of the month
  revenue numeric(10, 2) not null,
  expenses numeric(10, 2) not null,
  new_leads integer not null,
  projects_won integer not null,
  portfolio_updates integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (agency_id, month)
);
-- RLS for monthly_metrics
alter table monthly_metrics enable row level security;
create policy "Monthly metrics are viewable by their agency owner." on monthly_metrics for select using (exists (select 1 from agencies where agencies.id = monthly_metrics.agency_id and agencies.owner_id = auth.uid()));


-- Stores daily productivity metrics for a user.
create table daily_productivity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    date date not null,
    projects integer not null,
    revenue numeric(10, 2) not null,
    impressions integer not null,
    acquisition integer not null,
    rev_per_project numeric(10, 2) not null,
    unique(user_id, date)
);
-- RLS for daily_productivity
alter table daily_productivity enable row level security;
create policy "Productivity data is viewable by the user." on daily_productivity for select using (auth.uid() = user_id);
create policy "Users can insert their own productivity data." on daily_productivity for insert with check (auth.uid() = user_id);

-- Seed data for a demo agency and metrics for the default user
-- This assumes you have a user in your auth.users table.
-- Replace 'your_auth_user_id' with an actual user ID from your Supabase project.
-- You can find this in the Supabase Dashboard under Authentication -> Users.

-- Important: To run the seed, you must temporarily disable RLS on the tables,
-- run the INSERT statements, and then re-enable RLS.
-- Or, run the inserts from a server-side environment with the service_role key.

-- Example of how to get a user ID from the SQL editor:
-- select id from auth.users limit 1;

-- INSERT INTO agencies (name, owner_id) values ('My Awesome Agency', 'your_auth_user_id');
-- with agency as (select id from agencies where owner_id = 'your_auth_user_id' limit 1)
-- INSERT INTO monthly_metrics (agency_id, month, revenue, expenses, new_leads, projects_won, portfolio_updates) values
-- ((select id from agency), '2024-01-01', 8500, 5000, 8, 3, 2),
-- ((select id from agency), '2024-02-01', 9500, 5500, 10, 4, 3),
-- ((select id from agency), '2024-03-01', 12000, 7000, 12, 5, 4),
-- ((select id from agency), '2024-04-01', 11000, 6500, 11, 4, 3),
-- ((select id from agency), '2024-05-01', 15000, 8000, 15, 6, 5),
-- ((select id from agency), '2024-06-01', 14000, 7500, 14, 5, 4);

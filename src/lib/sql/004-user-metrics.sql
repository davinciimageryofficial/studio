-- Table to store daily metrics for each user
CREATE TABLE user_daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    profile_views INT DEFAULT 0,
    connections_made INT DEFAULT 0,
    search_appearances INT DEFAULT 0,
    post_likes INT DEFAULT 0,
    skill_sync_matches INT DEFAULT 0,
    revenue_generated INT DEFAULT 0,
    projects_completed INT DEFAULT 0,
    client_rating NUMERIC(2, 1) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Table to store monthly aggregated metrics for each user
CREATE TABLE user_monthly_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month DATE NOT NULL,
    total_revenue INT DEFAULT 0,
    total_projects INT DEFAULT 0,
    total_impressions INT DEFAULT 0,
    new_clients INT DEFAULT 0,
    avg_rev_per_project INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month)
);

ALTER TABLE user_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_monthly_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own metrics."
ON user_daily_metrics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly metrics."
ON user_monthly_metrics FOR SELECT
USING (auth.uid() = user_id);


-- Seed data for a sample user to make charts work.
-- In a real app, you would have a function or cron job to aggregate this data.
-- Find a user to associate the data with (we'll try to find Chris Peta, or fall back to any user)
WITH user_to_seed AS (
  SELECT id FROM auth.users WHERE email = 'chris.peta@example.com' LIMIT 1
),
fallback_user AS (
  SELECT id FROM auth.users LIMIT 1
),
target_user AS (
  SELECT id FROM user_to_seed
  UNION ALL
  SELECT id FROM fallback_user
  WHERE NOT EXISTS (SELECT 1 FROM user_to_seed)
  LIMIT 1
)
INSERT INTO user_daily_metrics (user_id, date, profile_views, connections_made, search_appearances, post_likes, skill_sync_matches)
SELECT 
  (SELECT id FROM target_user),
  CURRENT_DATE - (n || ' day')::interval,
  100 + (random() * 50)::int,
  1 + (random() * 5)::int,
  200 + (random() * 100)::int,
  20 + (random() * 30)::int,
  (random() * 3)::int
FROM generate_series(0, 29) as n;


WITH user_to_seed AS (
  SELECT id FROM auth.users WHERE email = 'chris.peta@example.com' LIMIT 1
),
fallback_user AS (
  SELECT id FROM auth.users LIMIT 1
),
target_user AS (
  SELECT id FROM user_to_seed
  UNION ALL
  SELECT id FROM fallback_user
  WHERE NOT EXISTS (SELECT 1 FROM user_to_seed)
  LIMIT 1
)
INSERT INTO user_monthly_metrics (user_id, month, total_revenue, total_projects, total_impressions, new_clients, avg_rev_per_project)
SELECT
  (SELECT id FROM target_user),
  (date_trunc('month', current_date) - (n || ' month')::interval)::date,
  (15000 + random() * 10000)::int,
  (3 + random() * 5)::int,
  (5000 + random() * 15000)::int,
  (1 + random() * 3)::int,
  (3000 + random() * 2000)::int
FROM generate_series(0, 11) as n;
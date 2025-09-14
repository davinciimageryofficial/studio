-- Create a table for user posts
CREATE TABLE posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    parent_id BIGINT REFERENCES posts(id) ON DELETE CASCADE, -- For replies
    likes_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    reposts_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    image_url TEXT,
    type TEXT DEFAULT 'post',
    job_details JSONB
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts
CREATE POLICY "Posts are viewable by everyone."
ON posts FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own posts."
ON posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts."
ON posts FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts."
ON posts FOR DELETE
USING (auth.uid() = author_id);

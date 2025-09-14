-- This script contains the schema for the rest of the application features.

-- =================================================================
-- Feed & Posts
-- =================================================================
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    parent_id BIGINT REFERENCES posts(id) ON DELETE CASCADE, -- For replies
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    content TEXT NOT NULL,
    image_url TEXT,
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0, -- This will be a count of replies
    retweets INT NOT NULL DEFAULT 0,
    views_count VARCHAR(20) NOT NULL DEFAULT '0',
    post_type VARCHAR(20) NOT NULL DEFAULT 'post', -- 'post', 'job'
    job_title TEXT,
    job_budget TEXT,
    job_keywords TEXT[]
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone." ON posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own posts." ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts." ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts." ON posts FOR DELETE USING (auth.uid() = author_id);


-- =================================================================
-- News Articles
-- =================================================================
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are viewable by everyone." ON articles FOR SELECT USING (true);
-- In a real app, you'd restrict insert/update/delete to specific roles.
CREATE POLICY "Admins can manage articles." ON articles FOR ALL USING (true); 


-- =================================================================
-- Courses
-- =================================================================
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    level VARCHAR(50) NOT NULL -- 'Beginner', 'Intermediate', 'Advanced'
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are viewable by everyone." ON courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses." ON courses FOR ALL USING (true);


-- =================================================================
-- Billing & Subscriptions
-- =================================================================
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    invoice_id_str TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Paid'
);

CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'visa', 'mastercard', 'paypal'
    details TEXT NOT NULL,
    expiry_date TEXT, -- e.g., '08/2026'
    is_default BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE referrals (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    referred_user_name TEXT NOT NULL,
    referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL, -- 'Pending', 'Joined', 'Subscribed'
    reward TEXT
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own invoices." ON invoices FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own payment methods." ON payment_methods FOR ALL USING (auth.uid() = user_id);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referrals." ON referrals FOR SELECT USING (auth.uid() = user_id);


-- =================================================================
-- Ad Studio
-- =================================================================
CREATE TABLE ad_campaigns (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Active', 'Paused', 'Finished'
    type TEXT NOT NULL,
    spend NUMERIC(10, 2) NOT NULL,
    conversions INT NOT NULL
);

ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own ad campaigns." ON ad_campaigns FOR ALL USING (auth.uid() = user_id);


-- =================================================================
-- Messages & Conversations
-- =================================================================
CREATE TABLE conversations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_group BOOLEAN NOT NULL DEFAULT false,
  name TEXT, -- For group chats
  avatar_url TEXT, -- For group chats
  last_message_id BIGINT -- Can be null
);

CREATE TABLE conversation_participants (
  conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key to conversations table after messages table is created
ALTER TABLE conversations
ADD CONSTRAINT fk_last_message
FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;


ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to see conversations they are part of
CREATE POLICY "Users can view their own conversations." ON conversations
FOR SELECT USING (
  id IN (
    SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations." ON conversations
FOR INSERT WITH CHECK (true); -- Further checks would be needed for who can create what

CREATE POLICY "Users can see participants of their conversations." ON conversation_participants
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can add participants to conversations they are in." ON conversation_participants
FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view messages in their conversations." ON messages
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages in their conversations." ON messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
  )
);

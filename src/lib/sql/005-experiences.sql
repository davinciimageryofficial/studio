
CREATE TABLE experiences (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    duration TEXT
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Users can insert their own experiences" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own experiences" ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own experiences" ON experiences FOR DELETE USING (auth.uid() = user_id);

-- Seed some initial data
INSERT INTO experiences (user_id, title, company, duration, description) VALUES
((SELECT id FROM profiles WHERE full_name = 'Chris Peta'), 'Senior Frontend Developer', 'Innovate Inc.', 'Jan 2020 - Present · 4+ years', 'Leading the development of a design system and migrating the main application to Next.js. Focused on performance, accessibility, and creating a delightful user experience.'),
((SELECT id FROM profiles WHERE full_name = 'Chris Peta'), 'Web Developer', 'Solutions Co.', 'Jun 2017 - Dec 2019 · 2.5 years', 'Developed and maintained client websites using React, Redux, and Node.js. Collaborated with designers to implement pixel-perfect user interfaces.');

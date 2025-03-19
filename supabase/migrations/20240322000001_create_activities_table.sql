-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('diagnosis', 'chat', 'analysis')),
  status TEXT CHECK (status IN ('completed', 'in-progress', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own activities";
CREATE POLICY "Users can view their own activities"
ON activities FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activities";
CREATE POLICY "Users can insert their own activities"
ON activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own activities";
CREATE POLICY "Users can update their own activities"
ON activities FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table activities;
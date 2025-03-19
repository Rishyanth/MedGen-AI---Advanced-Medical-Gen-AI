-- Create health_stats table
CREATE TABLE IF NOT EXISTS health_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  last_checkup DATE,
  blood_pressure TEXT,
  heart_rate INTEGER,
  weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE health_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own health stats";
CREATE POLICY "Users can view their own health stats"
ON health_stats FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own health stats";
CREATE POLICY "Users can update their own health stats"
ON health_stats FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table health_stats;
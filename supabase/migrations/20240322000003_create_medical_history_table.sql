-- Create medical_history table
CREATE TABLE IF NOT EXISTS medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  condition TEXT NOT NULL,
  diagnosis_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own medical history";
CREATE POLICY "Users can view their own medical history"
ON medical_history FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own medical history";
CREATE POLICY "Users can insert their own medical history"
ON medical_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own medical history";
CREATE POLICY "Users can update their own medical history"
ON medical_history FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table medical_history;
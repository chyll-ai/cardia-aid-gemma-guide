
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  diagnosis TEXT,
  intervention TEXT,
  surgery_date DATE,
  stage TEXT CHECK (stage IN ('pre-op', 'post-op')) DEFAULT 'pre-op',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create medications table
CREATE TABLE medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  dosage TEXT,
  taken_today BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create medical_files table for storing uploaded images/documents
CREATE TABLE medical_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  upload_purpose TEXT, -- 'wound_monitoring', 'medication_photo', 'document', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ai_analysis table for storing MedGemma analysis results
CREATE TABLE ai_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  medical_file_id UUID REFERENCES medical_files(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'image_analysis', 'symptom_triage', etc.
  prompt_used TEXT,
  ai_response TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create symptoms_log table for tracking patient symptoms
CREATE TABLE symptoms_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  symptoms JSONB, -- Array of selected symptoms
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  description TEXT,
  ai_guidance TEXT, -- Triage guidance from AI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_history table for storing chatbot conversations
CREATE TABLE chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('user', 'ai')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create instructions table for storing pre/post-op instructions
CREATE TABLE instructions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  instruction_type TEXT CHECK (instruction_type IN ('pre-op', 'post-op')) NOT NULL,
  original_text TEXT NOT NULL,
  simplified_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Patients can only see their own data
CREATE POLICY "Users can view own patient data" ON patients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own medications" ON medications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = medications.patient_id AND patients.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own medical files" ON medical_files
  FOR ALL USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = medical_files.patient_id AND patients.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own AI analysis" ON ai_analysis
  FOR ALL USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = ai_analysis.patient_id AND patients.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own symptoms log" ON symptoms_log
  FOR ALL USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = symptoms_log.patient_id AND patients.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own chat history" ON chat_history
  FOR ALL USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = chat_history.patient_id AND patients.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own instructions" ON instructions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = instructions.patient_id AND patients.user_id = auth.uid()
  ));

-- Create storage bucket for medical files
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-files', 'medical-files', false);

-- Create storage policy for medical files
CREATE POLICY "Users can upload own medical files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own medical files" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own medical files" ON storage.objects
  FOR DELETE USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

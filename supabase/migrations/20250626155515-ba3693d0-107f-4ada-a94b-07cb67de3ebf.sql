
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM (
  'patient', 
  'doctor', 
  'care_giver', 
  'nurse', 
  'surgeon'
);

-- Create profiles table to extend auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  first_name TEXT,
  last_name TEXT,
  license_number TEXT, -- For medical professionals
  specialization TEXT, -- For doctors/surgeons
  department TEXT, -- For nurses/hospital staff
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create patients table (recreated to work with new schema)
CREATE TABLE public.patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  diagnosis TEXT,
  intervention TEXT,
  surgery_date DATE,
  stage TEXT CHECK (stage IN ('pre-op', 'post-op')) DEFAULT 'pre-op',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create patient_care_team table to link patients with their care providers
CREATE TABLE public.patient_care_team (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(patient_id, provider_id)
);

-- Create medical_reports table for AI-generated reports
CREATE TABLE public.medical_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  generated_by UUID REFERENCES public.profiles(id), -- AI system or user who triggered
  report_type TEXT NOT NULL, -- 'symptom_assessment', 'medication_analysis', 'care_summary'
  natural_language_input TEXT NOT NULL,
  medical_jargon_output TEXT NOT NULL,
  recipients UUID[] DEFAULT '{}', -- Array of profile IDs who should receive this
  urgency_level INTEGER CHECK (urgency_level >= 1 AND urgency_level <= 5) DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_care_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Care providers can view patient profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.patient_care_team pct
      WHERE (pct.patient_id = profiles.id OR pct.provider_id = profiles.id) 
      AND (pct.patient_id = auth.uid() OR pct.provider_id = auth.uid())
    )
  );

-- RLS Policies for patients
CREATE POLICY "Users can view own patient data" ON public.patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = patients.profile_id AND profiles.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.patient_care_team pct
      JOIN public.profiles p ON p.id = patients.profile_id
      WHERE pct.patient_id = p.id AND pct.provider_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own patient data" ON public.patients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = patients.profile_id AND profiles.id = auth.uid()
    )
  );

-- RLS Policies for patient_care_team
CREATE POLICY "Care providers can view their patients" ON public.patient_care_team
  FOR SELECT USING (
    auth.uid() = provider_id OR 
    auth.uid() = patient_id
  );

CREATE POLICY "Care providers can manage care teams" ON public.patient_care_team
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('doctor', 'nurse', 'surgeon', 'care_giver')
    )
  );

-- RLS Policies for medical_reports
CREATE POLICY "Users can view relevant medical reports" ON public.medical_reports
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = ANY(recipients) OR
    EXISTS (
      SELECT 1 FROM public.patient_care_team pct
      WHERE pct.patient_id = medical_reports.patient_id 
      AND pct.provider_id = auth.uid()
    )
  );

CREATE POLICY "Care providers can create medical reports" ON public.medical_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('doctor', 'nurse', 'surgeon', 'care_giver')
    ) OR auth.uid() = patient_id
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'patient')
  );
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

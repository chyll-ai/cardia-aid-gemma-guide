
-- Seed data for development and demo purposes

-- Insert demo patient (this will be linked to authenticated users)
INSERT INTO patients (id, name, diagnosis, intervention, surgery_date, stage) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Sarah Johnson',
  'Coronary Artery Disease',
  'Coronary Artery Bypass Graft (CABG)',
  '2024-07-15',
  'pre-op'
);

-- Insert demo medications
INSERT INTO medications (patient_id, name, frequency, dosage, taken_today) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Aspirin',
  'Daily',
  '81mg',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Metoprolol',
  'Twice daily',
  '50mg',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Atorvastatin',
  'Daily',
  '40mg',
  false
);

-- Insert demo pre-op instructions
INSERT INTO instructions (patient_id, instruction_type, original_text, simplified_text) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'pre-op',
  'Patient must maintain NPO status for a minimum of 8 hours prior to the scheduled surgical intervention to reduce aspiration risk during anesthetic induction.',
  'Don''t eat or drink anything for 8 hours before your surgery. This keeps you safe during anesthesia.'
);

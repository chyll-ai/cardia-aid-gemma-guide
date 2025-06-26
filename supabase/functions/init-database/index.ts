
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Run initialization queries
    console.log('Initializing database schema...')
    
    // The tables should already be created via migrations, but we can seed data
    const { data: patients, error: patientsError } = await supabaseClient
      .from('patients')
      .select('id')
      .limit(1)

    if (patientsError) {
      console.error('Error checking patients table:', patientsError)
      throw patientsError
    }

    // If no patients exist, insert seed data
    if (patients && patients.length === 0) {
      console.log('Seeding database with demo data...')
      
      // Insert demo patient
      const { data: patient, error: patientError } = await supabaseClient
        .from('patients')
        .insert({
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Sarah Johnson',
          diagnosis: 'Coronary Artery Disease',
          intervention: 'Coronary Artery Bypass Graft (CABG)',
          surgery_date: '2024-07-15',
          stage: 'pre-op'
        })
        .select()
        .single()

      if (patientError) {
        console.error('Error inserting patient:', patientError)
        throw patientError
      }

      // Insert demo medications
      const { error: medicationsError } = await supabaseClient
        .from('medications')
        .insert([
          {
            patient_id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Aspirin',
            frequency: 'Daily',
            dosage: '81mg',
            taken_today: false
          },
          {
            patient_id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Metoprolol',
            frequency: 'Twice daily',
            dosage: '50mg',
            taken_today: false
          },
          {
            patient_id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Atorvastatin',
            frequency: 'Daily',
            dosage: '40mg',
            taken_today: false
          }
        ])

      if (medicationsError) {
        console.error('Error inserting medications:', medicationsError)
        throw medicationsError
      }

      // Insert demo pre-op instruction
      const { error: instructionsError } = await supabaseClient
        .from('instructions')
        .insert({
          patient_id: '550e8400-e29b-41d4-a716-446655440000',
          instruction_type: 'pre-op',
          original_text: 'Patient must maintain NPO status for a minimum of 8 hours prior to the scheduled surgical intervention to reduce aspiration risk during anesthetic induction.',
          simplified_text: 'Don\'t eat or drink anything for 8 hours before your surgery. This keeps you safe during anesthesia.'
        })

      if (instructionsError) {
        console.error('Error inserting instructions:', instructionsError)
        throw instructionsError
      }

      console.log('Database seeded successfully!')
    } else {
      console.log('Database already contains data, skipping seed.')
    }

    return new Response(
      JSON.stringify({ 
        message: 'Database initialized successfully',
        patients_count: patients?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error initializing database:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

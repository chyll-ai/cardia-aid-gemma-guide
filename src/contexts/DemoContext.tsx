
import React, { createContext, useContext, useState } from 'react';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface DemoProfile {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  license_number: string | null;
  specialization: string | null;
  department: string | null;
  phone: string | null;
}

interface DemoContextType {
  demoProfile: DemoProfile | null;
  setDemoRole: (role: UserRole) => void;
  isDemoMode: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoProfile, setDemoProfile] = useState<DemoProfile>({
    id: 'demo-user',
    role: 'patient',
    first_name: 'Demo',
    last_name: 'User',
    license_number: null,
    specialization: null,
    department: null,
    phone: null
  });

  const setDemoRole = (role: UserRole) => {
    const roleProfiles: Record<UserRole, Partial<DemoProfile>> = {
      patient: {
        first_name: 'Demo',
        last_name: 'Patient',
        license_number: null,
        specialization: null,
        department: null
      },
      doctor: {
        first_name: 'Dr. Demo',
        last_name: 'Doctor',
        license_number: 'MD123456',
        specialization: 'Cardiology',
        department: 'Cardiology'
      },
      surgeon: {
        first_name: 'Dr. Demo',
        last_name: 'Surgeon',
        license_number: 'MD789012',
        specialization: 'Cardiac Surgery',
        department: 'Surgery'
      },
      nurse: {
        first_name: 'Demo',
        last_name: 'Nurse',
        license_number: 'RN345678',
        specialization: null,
        department: 'Cardiac Care Unit'
      },
      care_giver: {
        first_name: 'Demo',
        last_name: 'Caregiver',
        license_number: null,
        specialization: null,
        department: 'Patient Care'
      }
    };

    setDemoProfile(prev => ({
      ...prev,
      role,
      ...roleProfiles[role]
    }));
  };

  return (
    <DemoContext.Provider value={{
      demoProfile,
      setDemoRole,
      isDemoMode: true
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

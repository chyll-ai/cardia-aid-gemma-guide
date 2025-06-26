
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PatientDashboard } from './dashboards/PatientDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { NurseDashboard } from './dashboards/NurseDashboard';
import { CareGiverDashboard } from './dashboards/CareGiverDashboard';
import { SurgeonDashboard } from './dashboards/SurgeonDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const RoleBasedDashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Profile Not Found</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Unable to load your profile. Please try signing in again.
          </p>
        </CardContent>
      </Card>
    );
  }

  switch (profile.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'surgeon':
      return <SurgeonDashboard />;
    case 'nurse':
      return <NurseDashboard />;
    case 'care_giver':
      return <CareGiverDashboard />;
    default:
      return <PatientDashboard />;
  }
};

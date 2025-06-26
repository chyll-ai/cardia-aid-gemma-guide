
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { PatientDashboard } from './dashboards/PatientDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { NurseDashboard } from './dashboards/NurseDashboard';
import { CareGiverDashboard } from './dashboards/CareGiverDashboard';
import { SurgeonDashboard } from './dashboards/SurgeonDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Settings, User, LogIn } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';

type UserRole = Database['public']['Enums']['user_role'];

export const RoleBasedDashboard = () => {
  const { profile, loading, user } = useAuth();
  const { demoProfile, setDemoRole, isDemoMode } = useDemo();

  // Use real profile if authenticated, otherwise use demo profile
  const currentProfile = user ? profile : demoProfile;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentProfile) {
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

  const getDashboardComponent = () => {
    switch (currentProfile.role) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Demo/Auth Controls */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                {currentProfile.first_name} {currentProfile.last_name}
              </span>
              <span className="text-sm text-gray-500 capitalize">
                ({currentProfile.role.replace('_', ' ')})
              </span>
            </div>
            
            {isDemoMode && !user && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Role Switcher for Demo Mode */}
            {isDemoMode && !user && (
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <Select 
                  value={currentProfile.role} 
                  onValueChange={(value) => setDemoRole(value as UserRole)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="surgeon">Surgeon</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="care_giver">Care Giver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Auth Button */}
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>{user ? 'Account' : 'Sign In'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {getDashboardComponent()}
    </div>
  );
};

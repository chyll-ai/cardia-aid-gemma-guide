
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Heart, Stethoscope } from 'lucide-react';

interface PatientData {
  name: string;
  diagnosis: string;
  intervention: string;
  surgeryDate: string;
  medications: Array<{
    name: string;
    frequency: string;
    taken: boolean;
  }>;
}

interface PatientProfileProps {
  patientData: PatientData;
  setPatientData: (data: PatientData) => void;
  currentStage: 'pre-op' | 'post-op';
  setCurrentStage: (stage: 'pre-op' | 'post-op') => void;
}

const interventionTypes = [
  'Coronary Artery Bypass Graft (CABG)',
  'Percutaneous Coronary Intervention (PCI)',
  'Heart Valve Repair/Replacement',
  'Cardiac Catheterization',
  'Pacemaker Implantation',
  'Defibrillator Implantation',
  'Heart Transplant Evaluation',
  'Angioplasty',
  'Stent Placement',
  'Other'
];

export function PatientProfile({ patientData, setPatientData, currentStage, setCurrentStage }: PatientProfileProps) {
  const handleInputChange = (field: string, value: string) => {
    setPatientData({
      ...patientData,
      [field]: value
    });
  };

  const getSurgeryStatus = () => {
    const surgeryDate = new Date(patientData.surgeryDate);
    const today = new Date();
    const daysDiff = Math.ceil((surgeryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff > 0) {
      return `Surgery in ${daysDiff} days`;
    } else if (daysDiff === 0) {
      return 'Surgery today';
    } else {
      return `${Math.abs(daysDiff)} days post-surgery`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Patient Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">{patientData.name}</CardTitle>
                <p className="text-sm text-gray-600">{getSurgeryStatus()}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={currentStage === 'pre-op' ? 'default' : 'outline'}
                onClick={() => setCurrentStage('pre-op')}
                className="text-xs"
              >
                Pre-Op
              </Button>
              <Button
                size="sm"
                variant={currentStage === 'post-op' ? 'default' : 'outline'}
                onClick={() => setCurrentStage('post-op')}
                className="text-xs"
              >
                Post-Op
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Diagnosis:</span>
              <span className="text-gray-700">{patientData.diagnosis}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-medium">Procedure:</span>
              <span className="text-gray-700">{patientData.intervention}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="font-medium">Surgery Date:</span>
              <span className="text-gray-700">{new Date(patientData.surgeryDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              value={patientData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="diagnosis" className="text-sm font-medium">Diagnosis</Label>
            <Input
              id="diagnosis"
              value={patientData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="intervention" className="text-sm font-medium">Cardiac Intervention</Label>
            <Select 
              value={patientData.intervention} 
              onValueChange={(value) => handleInputChange('intervention', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select intervention type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {interventionTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="surgeryDate" className="text-sm font-medium">Surgery Date</Label>
            <Input
              id="surgeryDate"
              type="date"
              value={patientData.surgeryDate}
              onChange={(e) => handleInputChange('surgeryDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

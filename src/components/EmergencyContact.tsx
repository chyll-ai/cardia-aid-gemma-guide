
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, AlertTriangle, Heart, Stethoscope } from 'lucide-react';

export function EmergencyContact() {
  const handleEmergencyCall = () => {
    window.location.href = 'tel:911';
  };

  const handleDoctorCall = () => {
    // In a real app, this would use the patient's actual doctor's number
    window.location.href = 'tel:555-0123';
  };

  return (
    <div className="space-y-4">
      {/* Emergency Actions */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Emergency Contact</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            For life-threatening emergencies like severe chest pain, difficulty breathing, or loss of consciousness.
          </p>
          <Button 
            onClick={handleEmergencyCall}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call 911 - Emergency
          </Button>
        </CardContent>
      </Card>

      {/* Doctor Contact */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Contact Your Doctor</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            For non-emergency questions about your recovery, medications, or concerning symptoms.
          </p>
          <Button 
            onClick={handleDoctorCall}
            variant="outline" 
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Your Care Team
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Heart className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium mb-1">Important Disclaimer</p>
              <p>
                This app provides general information and support tools only. It does not replace professional medical advice, 
                diagnosis, or treatment. Always consult your healthcare provider for medical decisions and emergency situations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PatientProfile } from '@/components/PatientProfile';
import { PreOpProtocols } from '@/components/PreOpProtocols';
import { PostOpInstructions } from '@/components/PostOpInstructions';
import { MedicationTracker } from '@/components/MedicationTracker';
import { ChatbotInterface } from '@/components/ChatbotInterface';
import { SymptomTracker } from '@/components/SymptomTracker';
import { EmergencyContact } from '@/components/EmergencyContact';
import { DatabaseInitializer } from '@/components/DatabaseInitializer';
import { Heart, User, Calendar, MessageCircle, Pill, Activity, Database } from 'lucide-react';

const Index = () => {
  const [currentStage, setCurrentStage] = useState<'pre-op' | 'post-op'>('pre-op');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patientData, setPatientData] = useState({
    name: 'Sarah Johnson',
    diagnosis: 'Coronary Artery Disease',
    intervention: 'Coronary Artery Bypass Graft (CABG)',
    surgeryDate: '2024-07-15',
    medications: [
      { name: 'Aspirin 81mg', frequency: 'Daily', taken: false },
      { name: 'Metoprolol 50mg', frequency: 'Twice daily', taken: false },
      { name: 'Atorvastatin 40mg', frequency: 'Daily', taken: false },
    ]
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'database', label: 'Setup', icon: Database },
    { id: 'pre-op', label: 'Pre-Op', icon: Calendar },
    { id: 'post-op', label: 'Post-Op', icon: Heart },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'chat', label: 'Ask Questions', icon: MessageCircle },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cardiac Care</h1>
                <p className="text-sm text-gray-600">Your health companion</p>
              </div>
            </div>
            <Badge variant={currentStage === 'pre-op' ? 'default' : 'secondary'}>
              {currentStage === 'pre-op' ? 'Pre-Surgery' : 'Post-Surgery'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-1 px-4 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto mb-1" />
                  <div className="truncate">{tab.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <PatientProfile 
              patientData={patientData} 
              setPatientData={setPatientData}
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
            />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setActiveTab(currentStage === 'pre-op' ? 'pre-op' : 'post-op')}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View {currentStage === 'pre-op' ? 'Pre-Op' : 'Post-Op'} Instructions
                </Button>
                <Button 
                  onClick={() => setActiveTab('medications')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Track Medications
                </Button>
                <Button 
                  onClick={() => setActiveTab('chat')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'database' && <DatabaseInitializer />}
        {activeTab === 'pre-op' && <PreOpProtocols />}
        {activeTab === 'post-op' && <PostOpInstructions />}
        {activeTab === 'medications' && (
          <MedicationTracker 
            medications={patientData.medications}
            setPatientData={setPatientData}
          />
        )}
        {activeTab === 'chat' && <ChatbotInterface />}
        {activeTab === 'symptoms' && <SymptomTracker />}

        {/* Emergency Contact - Always visible */}
        <EmergencyContact />
      </div>
    </div>
  );
};

export default Index;

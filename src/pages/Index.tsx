
import { DatabaseInitializer } from "@/components/DatabaseInitializer";
import { PatientProfile } from "@/components/PatientProfile";
import { PreOpProtocols } from "@/components/PreOpProtocols";
import { PostOpInstructions } from "@/components/PostOpInstructions";
import { EnhancedMedicationTracker } from "@/components/EnhancedMedicationTracker";
import { IntelligentSymptomTracker } from "@/components/IntelligentSymptomTracker";
import { PersonalizedInstructions } from "@/components/PersonalizedInstructions";
import { ChatbotInterface } from "@/components/ChatbotInterface";
import { EmergencyContact } from "@/components/EmergencyContact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Heart, Bot, Pill, Activity, BookOpen, Phone, Database, User } from "lucide-react";

const Index = () => {
  const [currentStage, setCurrentStage] = useState<'pre-op' | 'post-op'>('pre-op');
  const [patientData, setPatientData] = useState({
    name: "Sarah Johnson",
    diagnosis: "Coronary Artery Disease",
    intervention: "Coronary Artery Bypass Graft (CABG)",
    surgeryDate: "2024-07-15",
    medications: [
      { name: "Aspirin", frequency: "Daily", taken: false },
      { name: "Metoprolol", frequency: "Twice daily", taken: true },
      { name: "Atorvastatin", frequency: "Daily", taken: false }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Josiane
              </h1>
              <p className="text-gray-600 text-lg">AI-Powered Cardiac Care Assistant</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Bot className="h-3 w-3 mr-1" />
              MedGemma Powered
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-300">
              Personalized Care
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center space-x-2">
              <Pill className="h-4 w-4" />
              <span className="hidden sm:inline">Medications</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Instructions</span>
            </TabsTrigger>
            <TabsTrigger value="protocols" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Protocols</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PatientProfile
                  patientData={patientData}
                  setPatientData={setPatientData}
                  currentStage={currentStage}
                  setCurrentStage={setCurrentStage}
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span>Quick Health Check</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">3/3</div>
                        <div className="text-sm text-gray-600">Instructions Completed</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">2/3</div>
                        <div className="text-sm text-gray-600">Medications Taken Today</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <EmergencyContact />
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-800">
                      <Bot className="h-5 w-5" />
                      <span>AI Assistant Ready</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-700 mb-4">
                      Get instant help with medication questions, symptom guidance, and personalized care instructions.
                    </p>
                    <Badge className="bg-purple-100 text-purple-800">
                      MedGemma AI • Always Available
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <PatientProfile
              patientData={patientData}
              setPatientData={setPatientData}
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
            />
          </TabsContent>

          <TabsContent value="medications">
            <EnhancedMedicationTracker />
          </TabsContent>

          <TabsContent value="symptoms">
            <IntelligentSymptomTracker />
          </TabsContent>

          <TabsContent value="instructions">
            <PersonalizedInstructions />
          </TabsContent>

          <TabsContent value="protocols">
            <div className="space-y-6">
              {currentStage === 'pre-op' ? <PreOpProtocols /> : <PostOpInstructions />}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <ChatbotInterface />
          </TabsContent>

          <TabsContent value="setup">
            <DatabaseInitializer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Pill, Clock, AlertTriangle, CheckCircle, Brain, TrendingUp } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects: string[];
  adherenceScore: number;
  lastTaken?: Date;
}

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Daily',
    instructions: 'Take with food to prevent stomach upset',
    sideEffects: ['Stomach irritation', 'Bleeding risk'],
    adherenceScore: 95,
    lastTaken: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    name: 'Metoprolol',
    dosage: '50mg',
    frequency: 'Twice daily',
    instructions: 'Take at the same time each day',
    sideEffects: ['Dizziness', 'Fatigue'],
    adherenceScore: 88,
    lastTaken: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '40mg',
    frequency: 'Daily at bedtime',
    instructions: 'Avoid grapefruit juice',
    sideEffects: ['Muscle pain', 'Liver problems'],
    adherenceScore: 92
  }
];

export function EnhancedMedicationTracker() {
  const [medications] = useState<Medication[]>(mockMedications);
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  const [sideEffectReport, setSideEffectReport] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSideEffectAnalysis = async (medication: Medication) => {
    if (!sideEffectReport.trim()) return;

    setIsAnalyzing(true);
    try {
      const prompt = `As MedGemma, analyze this side effect report for ${medication.name} (${medication.dosage}):

Patient Report: "${sideEffectReport}"

Known Side Effects: ${medication.sideEffects.join(', ')}

Please provide:
1. Severity assessment (mild/moderate/severe)
2. Whether this matches known side effects
3. Immediate recommendations
4. When to contact healthcare provider
5. Any drug interactions to consider

Keep response concise and actionable for a cardiac patient.`;

      const response = await callGeminiAPI(prompt);
      setAiAnalysis(response);
    } catch (error) {
      console.error('Error analyzing side effect:', error);
      setAiAnalysis('Unable to analyze at this time. Please contact your healthcare provider if you have concerns.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTimeSinceLastDose = (lastTaken?: Date) => {
    if (!lastTaken) return 'Not recorded';
    
    const hours = Math.floor((Date.now() - lastTaken.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Less than 1 hour ago';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="space-y-6">
      {/* Adherence Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Medication Adherence Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(medications.reduce((acc, med) => acc + med.adherenceScore, 0) / medications.length)}%
              </div>
              <div className="text-sm text-gray-600">Overall Adherence</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{medications.length}</div>
              <div className="text-sm text-gray-600">Active Medications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {medications.filter(med => med.lastTaken && Date.now() - med.lastTaken.getTime() < 24 * 60 * 60 * 1000).length}
              </div>
              <div className="text-sm text-gray-600">Taken Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Cards */}
      <div className="space-y-4">
        {medications.map((medication) => (
          <Card key={medication.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Pill className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                  </div>
                </div>
                <Badge className={getAdherenceColor(medication.adherenceScore)}>
                  {medication.adherenceScore}% adherence
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Instructions:</span>
                  <p className="text-gray-600">{medication.instructions}</p>
                </div>
                <div>
                  <span className="font-medium">Last taken:</span>
                  <p className="text-gray-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeSinceLastDose(medication.lastTaken)}
                  </p>
                </div>
              </div>

              {medication.sideEffects.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Known Side Effects:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medication.sideEffects.map((effect, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Taken
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedMed(selectedMed === medication.id ? null : medication.id)}
                  className="flex-1"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Report Side Effect
                </Button>
              </div>

              {selectedMed === medication.id && (
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Describe any side effects or concerns:
                    </label>
                    <Textarea
                      value={sideEffectReport}
                      onChange={(e) => setSideEffectReport(e.target.value)}
                      placeholder="Describe what you're experiencing..."
                      className="min-h-20"
                    />
                  </div>
                  <Button 
                    onClick={() => handleSideEffectAnalysis(medication)}
                    disabled={!sideEffectReport.trim() || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                  </Button>

                  {aiAnalysis && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-2">
                        <Brain className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-800">MedGemma Analysis</span>
                      </div>
                      <div className="text-sm text-blue-700 whitespace-pre-line">{aiAnalysis}</div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

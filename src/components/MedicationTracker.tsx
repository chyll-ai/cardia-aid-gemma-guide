
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

interface Medication {
  name: string;
  frequency: string;
  taken: boolean;
}

interface MedicationTrackerProps {
  medications: Medication[];
  setPatientData: (updater: (prev: any) => any) => void;
}

export function MedicationTracker({ medications, setPatientData }: MedicationTrackerProps) {
  const [feedback, setFeedback] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const handleMedicationToggle = (index: number) => {
    setPatientData((prev: any) => ({
      ...prev,
      medications: prev.medications.map((med: Medication, idx: number) =>
        idx === index ? { ...med, taken: !med.taken } : med
      )
    }));
  };

  const getAdherenceRate = () => {
    if (medications.length === 0) return 0;
    const takenCount = medications.filter(med => med.taken).length;
    return Math.round((takenCount / medications.length) * 100);
  };

  const getEncouragement = async () => {
    setIsLoadingFeedback(true);
    try {
      const adherenceRate = getAdherenceRate();
      const takenMeds = medications.filter(med => med.taken).map(med => med.name);
      const missedMeds = medications.filter(med => !med.taken).map(med => med.name);

      const prompt = `As a supportive healthcare assistant for cardiac patients, provide encouraging feedback about medication adherence.

Adherence rate: ${adherenceRate}%
Medications taken: ${takenMeds.join(', ') || 'None'}
Medications missed: ${missedMeds.join(', ') || 'None'}

Please provide:
1. Encouraging words (even if adherence is low)
2. Brief reminder about importance for heart health
3. Gentle suggestion if medications were missed
4. Keep it warm, supportive, and under 100 words

Do not provide medical advice, just encouragement and general reminders.`;

      const response = await callGeminiAPI(prompt);
      setFeedback(response);
    } catch (error) {
      console.error('Error getting encouragement:', error);
      setFeedback('Great job tracking your medications! Remember, taking your heart medications as prescribed is one of the best things you can do for your recovery. Keep up the good work!');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const adherenceRate = getAdherenceRate();

  return (
    <div className="space-y-6">
      {/* Adherence Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-green-600" />
              <span>Today's Medications</span>
            </div>
            <Badge variant={adherenceRate >= 80 ? 'default' : 'destructive'}>
              {adherenceRate}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  adherenceRate >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${adherenceRate}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{medications.filter(med => med.taken).length}/{medications.length}</span>
          </div>
          
          <Button onClick={getEncouragement} variant="outline" size="sm" className="w-full">
            {isLoadingFeedback ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting feedback...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Get Encouragement
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Feedback */}
      {feedback && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medication List */}
      <div className="space-y-3">
        {medications.map((medication, index) => (
          <Card key={index} className={`transition-all ${medication.taken ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={medication.taken}
                  onCheckedChange={() => handleMedicationToggle(index)}
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Pill className={`h-4 w-4 ${medication.taken ? 'text-green-600' : 'text-gray-400'}`} />
                    <h3 className={`font-medium ${medication.taken ? 'text-green-800' : 'text-gray-900'}`}>
                      {medication.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <p className="text-sm text-gray-600">{medication.frequency}</p>
                  </div>
                </div>
                {medication.taken ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Medication Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medication Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
              <p>Take medications at the same time each day to build a routine.</p>
            </div>
            <div className="flex items-start space-x-2">
              <Pill className="h-4 w-4 text-green-500 mt-0.5" />
              <p>Use a pill organizer to keep track of daily doses.</p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p>Never stop heart medications without talking to your doctor first.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

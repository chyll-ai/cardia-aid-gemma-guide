
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Thermometer, Scale, Loader2, AlertTriangle } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

const symptomCategories = [
  { name: 'Chest Pain', icon: <Heart className="h-4 w-4" />, color: 'text-red-500' },
  { name: 'Shortness of Breath', icon: <Activity className="h-4 w-4" />, color: 'text-blue-500' },
  { name: 'Fatigue', icon: <Thermometer className="h-4 w-4" />, color: 'text-yellow-500' },
  { name: 'Swelling', icon: <Scale className="h-4 w-4" />, color: 'text-purple-500' }
];

export function SymptomTracker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState([0]);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [triageResponse, setTriageResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmitSymptoms = async () => {
    if (selectedSymptoms.length === 0 && !symptomDescription.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `As a supportive healthcare assistant for cardiac patients, provide gentle triage guidance based on these symptoms. Always emphasize contacting healthcare providers for concerning symptoms.

Selected symptoms: ${selectedSymptoms.join(', ') || 'None specified'}
Pain level (0-10): ${painLevel[0]}
Description: ${symptomDescription || 'No additional description'}

Please provide:
1. Empathetic acknowledgment of their concerns
2. General guidance about when these symptoms might warrant immediate medical attention
3. Self-care suggestions if appropriate
4. Clear instruction to contact their healthcare team
5. Emergency contact reminder for severe symptoms

Important: Do not diagnose. Focus on supportive guidance and appropriate medical referrals. Keep response under 200 words.`;

      const response = await callGeminiAPI(prompt);
      setTriageResponse(response);
    } catch (error) {
      console.error('Error getting triage response:', error);
      setTriageResponse('I understand you\'re experiencing symptoms. For your safety, please contact your healthcare provider to discuss these concerns. If you\'re experiencing severe chest pain, difficulty breathing, or other emergency symptoms, please call 911 immediately.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Symptom Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>How are you feeling today?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">Select any symptoms you're experiencing:</p>
            <div className="grid grid-cols-2 gap-2">
              {symptomCategories.map((symptom) => (
                <Button
                  key={symptom.name}
                  variant={selectedSymptoms.includes(symptom.name) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSymptomToggle(symptom.name)}
                  className="justify-start h-auto py-3"
                >
                  <div className={symptom.color}>{symptom.icon}</div>
                  <span className="ml-2 text-xs">{symptom.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Pain Level</label>
              <Badge variant="outline" className={getPainLevelColor(painLevel[0])}>
                {painLevel[0]}/10
              </Badge>
            </div>
            <Slider
              value={painLevel}
              onValueChange={setPainLevel}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No pain</span>
              <span>Worst pain</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional details (optional):
            </label>
            <Textarea
              value={symptomDescription}
              onChange={(e) => setSymptomDescription(e.target.value)}
              placeholder="Describe how you're feeling, when symptoms started, or any other details..."
              className="min-h-20"
            />
          </div>

          <Button 
            onClick={handleSubmitSymptoms}
            disabled={selectedSymptoms.length === 0 && !symptomDescription.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting guidance...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Get Guidance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Triage Response */}
      {triageResponse && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Heart className="h-5 w-5 text-blue-600" />
              <span>Care Guidance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 whitespace-pre-line">{triageResponse}</p>
          </CardContent>
        </Card>
      )}

      {/* Emergency Warning */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">When to Seek Immediate Help</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Severe chest pain or pressure</li>
                <li>• Difficulty breathing or shortness of breath</li>
                <li>• Sudden dizziness or fainting</li>
                <li>• Rapid or irregular heartbeat</li>
              </ul>
              <p className="text-sm text-red-800 font-medium mt-2">
                Call 911 immediately for emergency symptoms
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

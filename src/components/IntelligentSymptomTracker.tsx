
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Activity, Brain, AlertTriangle, Heart, TrendingUp, Clock } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

const commonCardiacSymptoms = [
  'Chest pain or discomfort',
  'Shortness of breath',
  'Fatigue or weakness',
  'Irregular heartbeat',
  'Swelling in legs or feet',
  'Dizziness or lightheadedness',
  'Nausea or vomiting',
  'Excessive sweating',
  'Back or jaw pain',
  'Arm pain or numbness'
];

const severityLevels = {
  1: { label: 'Very Mild', color: 'text-green-600' },
  2: { label: 'Mild', color: 'text-green-500' },
  3: { label: 'Mild-Moderate', color: 'text-yellow-500' },
  4: { label: 'Moderate', color: 'text-yellow-600' },
  5: { label: 'Moderate-Severe', color: 'text-orange-500' },
  6: { label: 'Severe', color: 'text-red-500' },
  7: { label: 'Very Severe', color: 'text-red-600' },
  8: { label: 'Extremely Severe', color: 'text-red-700' },
  9: { label: 'Critical', color: 'text-red-800' },
  10: { label: 'Emergency', color: 'text-red-900' }
};

export function IntelligentSymptomTracker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState([0]);
  const [description, setDescription] = useState('');
  const [aiGuidance, setAiGuidance] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<'low' | 'medium' | 'high' | 'emergency' | null>(null);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0 && !description.trim()) return;

    setIsAnalyzing(true);
    try {
      const prompt = `As MedGemma, analyze these cardiac symptoms for triage:

Selected Symptoms: ${selectedSymptoms.join(', ')}
Pain/Discomfort Level: ${painLevel[0]}/10
Additional Description: "${description}"

Patient Context: Post-cardiac intervention patient (CABG)

Please provide:
1. Urgency level (low/medium/high/emergency)
2. Possible causes or explanations
3. Immediate action recommendations
4. When to seek medical attention
5. Self-care measures if appropriate
6. Red flags to watch for

Format as clear, actionable guidance for a cardiac patient.`;

      const response = await callGeminiAPI(prompt);
      setAiGuidance(response);

      // Determine urgency based on symptoms and pain level
      const highRiskSymptoms = ['Chest pain or discomfort', 'Shortness of breath', 'Irregular heartbeat'];
      const hasHighRiskSymptoms = selectedSymptoms.some(s => highRiskSymptoms.includes(s));
      const highPainLevel = painLevel[0] >= 7;

      if (highPainLevel || (hasHighRiskSymptoms && painLevel[0] >= 5)) {
        setUrgencyLevel('emergency');
      } else if (hasHighRiskSymptoms || painLevel[0] >= 5) {
        setUrgencyLevel('high');
      } else if (selectedSymptoms.length >= 3 || painLevel[0] >= 3) {
        setUrgencyLevel('medium');
      } else {
        setUrgencyLevel('low');
      }

    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setAiGuidance('Unable to analyze symptoms at this time. If you are experiencing severe symptoms, please contact your healthcare provider immediately.');
      setUrgencyLevel('medium');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyBadge = () => {
    if (!urgencyLevel) return null;

    const urgencyConfig = {
      low: { label: 'Low Priority', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium Priority', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High Priority', className: 'bg-orange-100 text-orange-800' },
      emergency: { label: 'EMERGENCY', className: 'bg-red-100 text-red-800 animate-pulse' }
    };

    const config = urgencyConfig[urgencyLevel];
    
    return (
      <Badge className={config.className}>
        {urgencyLevel === 'emergency' && <AlertTriangle className="h-3 w-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500" />
            <span>Intelligent Symptom Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Symptom Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Select any symptoms you're experiencing:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {commonCardiacSymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                  />
                  <label htmlFor={symptom} className="text-sm cursor-pointer">
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Pain/Discomfort Level: {painLevel[0]}/10
            </label>
            <div className="px-3">
              <Slider
                value={painLevel}
                onValueChange={setPainLevel}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No pain</span>
                <span className={severityLevels[painLevel[0] as keyof typeof severityLevels]?.color}>
                  {severityLevels[painLevel[0] as keyof typeof severityLevels]?.label || 'None'}
                </span>
                <span>Worst possible</span>
              </div>
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional details (optional):
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe when symptoms started, what makes them better or worse, any triggers..."
              className="min-h-20"
            />
          </div>

          {/* Analyze Button */}
          <Button 
            onClick={analyzeSymptoms}
            disabled={selectedSymptoms.length === 0 && !description.trim() || isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Get AI Health Guidance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiGuidance && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>MedGemma Health Assessment</span>
              </CardTitle>
              {getUrgencyBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-700 whitespace-pre-line">{aiGuidance}</div>
            </div>
            
            {urgencyLevel === 'emergency' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-800 font-medium mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Protocol
                </div>
                <p className="text-red-700 text-sm">
                  Based on your symptoms, you should seek immediate medical attention. 
                  Contact emergency services (911) or go to the nearest emergency room.
                </p>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <Clock className="h-3 w-3 inline mr-1" />
              Assessment generated at {new Date().toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Emergency Actions */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <Heart className="h-5 w-5" />
            <span>Emergency Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Call 911 - Emergency
            </Button>
            <Button variant="outline" className="w-full border-red-300 text-red-700">
              Call Cardiologist
            </Button>
            <Button variant="outline" className="w-full border-red-300 text-red-700">
              Contact Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

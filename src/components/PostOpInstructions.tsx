
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Heart, AlertTriangle, CheckCircle, X, Thermometer } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

const postOpCategories = [
  {
    title: "Wound Care",
    icon: <Heart className="h-4 w-4 text-red-500" />,
    color: "bg-red-50 border-red-200",
    instructions: [
      "Keep incision clean and dry",
      "Watch for signs of infection (redness, warmth, drainage)",
      "Don't soak in bathtub for 6 weeks"
    ]
  },
  {
    title: "Activity Restrictions",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    color: "bg-yellow-50 border-yellow-200",
    instructions: [
      "No lifting more than 10 pounds for 6 weeks",
      "No driving while taking pain medication",
      "Gradual return to normal activities"
    ]
  },
  {
    title: "Medication Management",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    color: "bg-green-50 border-green-200",
    instructions: [
      "Take medications as prescribed",
      "Don't skip doses of heart medications",
      "Monitor for side effects"
    ]
  },
  {
    title: "Warning Signs",
    icon: <X className="h-4 w-4 text-red-600" />,
    color: "bg-red-100 border-red-300",
    instructions: [
      "Call doctor for fever over 101°F",
      "Severe chest pain or shortness of breath",
      "Unusual swelling or weight gain"
    ]
  }
];

export function PostOpInstructions() {
  const [customInstruction, setCustomInstruction] = useState('');
  const [simplifiedInstruction, setSimplifiedInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSimplifyInstruction = async () => {
    if (!customInstruction.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Please simplify the following post-operative cardiac care instruction for a patient. Make it clear, actionable, and include visual cues or icons where helpful. Be empathetic and focus on patient safety:

"${customInstruction}"

Please provide a simplified, patient-friendly version with clear steps and any important warnings.`;

      const response = await callGeminiAPI(prompt);
      setSimplifiedInstruction(response);
    } catch (error) {
      console.error('Error simplifying instruction:', error);
      setSimplifiedInstruction('Sorry, I had trouble simplifying that instruction. Please try again or contact your healthcare team.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Post-Op Categories */}
      <div className="grid gap-4">
        {postOpCategories.map((category, index) => (
          <Card key={index} className={`${category.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                {category.icon}
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {category.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Instruction Simplifier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Simplify Post-Op Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter complex post-operative instructions:
            </label>
            <Textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Paste post-operative instructions that need clarification..."
              className="min-h-24"
            />
          </div>
          
          <Button 
            onClick={handleSimplifyInstruction}
            disabled={!customInstruction.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Simplifying...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Simplify Instructions
              </>
            )}
          </Button>

          {simplifiedInstruction && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Simplified Instructions:
              </h4>
              <div className="text-sm text-blue-700 whitespace-pre-line">{simplifiedInstruction}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Thermometer className="h-5 w-5 text-blue-600" />
            <span>Quick Reference</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Normal Recovery</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Mild pain at incision</li>
                <li>• Some fatigue</li>
                <li>• Gradual improvement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-900 mb-2">Call Doctor If</h4>
              <ul className="space-y-1 text-red-600">
                <li>• Fever over 101°F</li>
                <li>• Severe chest pain</li>
                <li>• Unusual swelling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

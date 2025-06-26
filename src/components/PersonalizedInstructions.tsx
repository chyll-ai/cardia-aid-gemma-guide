
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Sparkles, CheckCircle, Clock, Heart, Utensils, Pill } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

interface Instruction {
  id: string;
  type: 'pre-op' | 'post-op' | 'medication' | 'lifestyle';
  title: string;
  content: string;
  simplifiedContent?: string;
  priority: number;
  completed: boolean;
  aiGenerated: boolean;
}

const mockInstructions: Instruction[] = [
  {
    id: '1',
    type: 'post-op',
    title: 'Wound Care Protocol',
    content: 'Clean incision site daily with mild soap and water. Pat dry gently. Watch for signs of infection including increased redness, warmth, swelling, or unusual drainage.',
    simplifiedContent: 'Wash your cut gently with soap and water every day. Dry it carefully. Call your doctor if it gets red, hot, swollen, or leaks fluid.',
    priority: 1,
    completed: false,
    aiGenerated: false
  },
  {
    id: '2',
    type: 'lifestyle',
    title: 'Heart-Healthy Diet',
    content: 'Follow a cardiac diet low in sodium (less than 2000mg daily), saturated fats, and cholesterol. Include plenty of fruits, vegetables, whole grains, and lean proteins.',
    priority: 2,
    completed: false,
    aiGenerated: false
  },
  {
    id: '3',
    type: 'medication',
    title: 'Blood Thinner Safety',
    content: 'While taking aspirin or other blood thinners, avoid activities with high bleeding risk. Use a soft toothbrush, electric razor, and report unusual bruising to your healthcare provider.',
    priority: 1,
    completed: true,
    aiGenerated: false
  }
];

export function PersonalizedInstructions() {
  const [instructions, setInstructions] = useState<Instruction[]>(mockInstructions);
  const [customRequest, setCustomRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'pre-op' | 'post-op' | 'medication' | 'lifestyle'>('all');

  const generatePersonalizedInstruction = async () => {
    if (!customRequest.trim()) return;

    setIsGenerating(true);
    try {
      const prompt = `As MedGemma, create personalized instructions for a cardiac patient who has undergone CABG surgery:

Patient Request: "${customRequest}"

Patient Profile:
- Post-CABG surgery
- Taking aspirin, metoprolol, atorvastatin
- Allergies: Penicillin, Shellfish
- Risk factors: Hypertension, High Cholesterol

Please provide:
1. Detailed medical instruction
2. Simplified patient-friendly version
3. Priority level (1-3, where 1 is highest)
4. Instruction category (pre-op/post-op/medication/lifestyle)

Format as structured, actionable guidance tailored to this specific patient.`;

      const response = await callGeminiAPI(prompt);
      
      // Create new instruction from AI response
      const newInstruction: Instruction = {
        id: Date.now().toString(),
        type: 'lifestyle', // Default, could be parsed from AI response
        title: customRequest.length > 50 ? customRequest.substring(0, 50) + '...' : customRequest,
        content: response,
        priority: 2,
        completed: false,
        aiGenerated: true
      };

      setInstructions(prev => [newInstruction, ...prev]);
      setCustomRequest('');
    } catch (error) {
      console.error('Error generating instruction:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const simplifyInstruction = async (instructionId: string) => {
    const instruction = instructions.find(i => i.id === instructionId);
    if (!instruction || instruction.simplifiedContent) return;

    try {
      const prompt = `Simplify this medical instruction for a cardiac patient to understand easily:

"${instruction.content}"

Make it:
- Clear and easy to understand
- Action-oriented
- Empathetic in tone
- Include why it's important for their heart health

Keep it concise but complete.`;

      const response = await callGeminiAPI(prompt);
      
      setInstructions(prev => prev.map(inst => 
        inst.id === instructionId 
          ? { ...inst, simplifiedContent: response }
          : inst
      ));
    } catch (error) {
      console.error('Error simplifying instruction:', error);
    }
  };

  const toggleCompletion = (instructionId: string) => {
    setInstructions(prev => prev.map(inst => 
      inst.id === instructionId 
        ? { ...inst, completed: !inst.completed }
        : inst
    ));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'pre-op': <Clock className="h-4 w-4" />,
      'post-op': <Heart className="h-4 w-4" />,
      'medication': <Pill className="h-4 w-4" />,
      'lifestyle': <Utensils className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <BookOpen className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'pre-op': 'bg-blue-100 text-blue-800',
      'post-op': 'bg-red-100 text-red-800',
      'medication': 'bg-purple-100 text-purple-800',
      'lifestyle': 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: number) => {
    const colors = {
      1: 'border-l-red-500',
      2: 'border-l-yellow-500',
      3: 'border-l-green-500'
    };
    return colors[priority as keyof typeof colors] || 'border-l-gray-500';
  };

  const filteredInstructions = selectedType === 'all' 
    ? instructions 
    : instructions.filter(inst => inst.type === selectedType);

  return (
    <div className="space-y-6">
      {/* AI Instruction Generator */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Instruction Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What would you like personalized guidance on?
            </label>
            <Textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="E.g., 'How should I exercise after surgery?', 'What foods should I avoid?', 'How to manage medication side effects?'"
              className="min-h-20"
            />
          </div>
          
          <Button 
            onClick={generatePersonalizedInstruction}
            disabled={!customRequest.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Generating Personalized Guidance...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get Personalized AI Guidance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instruction Filters */}
      <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pre-op">Pre-Op</TabsTrigger>
          <TabsTrigger value="post-op">Post-Op</TabsTrigger>
          <TabsTrigger value="medication">Medication</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4">
          {filteredInstructions.map((instruction) => (
            <Card key={instruction.id} className={`border-l-4 ${getPriorityColor(instruction.priority)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(instruction.type)}
                      <CardTitle className="text-base">{instruction.title}</CardTitle>
                    </div>
                    {instruction.aiGenerated && (
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(instruction.type)}>
                      {instruction.type}
                    </Badge>
                    <Button
                      size="sm"
                      variant={instruction.completed ? "default" : "outline"}
                      onClick={() => toggleCompletion(instruction.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {instruction.completed ? 'Done' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{instruction.content}</p>
                </div>

                {instruction.simplifiedContent ? (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Simplified Version</span>
                    </div>
                    <p className="text-sm text-green-700">{instruction.simplifiedContent}</p>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simplifyInstruction(instruction.id)}
                  >
                    <Sparkles className="h-3 w-3 mr-2" />
                    Simplify This Instruction
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredInstructions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No instructions found for this category.</p>
            <p className="text-sm text-gray-500 mt-2">Use the AI generator above to create personalized guidance.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

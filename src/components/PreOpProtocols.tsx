
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, Clock, Utensils, Pill, Shower } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';

const commonPreOpInstructions = [
  "Nothing to eat or drink after midnight before surgery",
  "Take prescribed medications with small sips of water unless told otherwise",
  "Shower with antibacterial soap the night before and morning of surgery",
  "Remove all jewelry, nail polish, and makeup",
  "Arrange for someone to drive you home after surgery",
  "Bring a list of all medications you are currently taking"
];

const preOpFAQ = [
  {
    question: "Can I eat before surgery?",
    answer: "You should not eat or drink anything after midnight before your surgery. This helps prevent complications during anesthesia."
  },
  {
    question: "What medications should I take?",
    answer: "Take only the medications your doctor specifically told you to take. Bring a complete list of all your medications to the hospital."
  },
  {
    question: "How should I prepare at home?",
    answer: "Shower with antibacterial soap, remove nail polish and jewelry, and make sure someone can drive you home after surgery."
  },
  {
    question: "What should I bring to the hospital?",
    answer: "Bring your ID, insurance cards, medication list, comfortable clothes for going home, and any medical devices you use."
  }
];

export function PreOpProtocols() {
  const [customInstruction, setCustomInstruction] = useState('');
  const [simplifiedInstruction, setSimplifiedInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSimplifyInstruction = async () => {
    if (!customInstruction.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Please simplify the following pre-operative medical instruction for a cardiac patient. Make it clear, easy to understand, and empathetic. Focus on what the patient needs to do and why it's important for their safety:

"${customInstruction}"

Please provide a simplified, patient-friendly version.`;

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
      {/* Pre-Op Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Pre-Surgery Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonPreOpInstructions.map((instruction, index) => {
              let icon;
              if (instruction.includes('eat') || instruction.includes('drink')) icon = <Utensils className="h-4 w-4 text-orange-500" />;
              else if (instruction.includes('medication')) icon = <Pill className="h-4 w-4 text-blue-500" />;
              else if (instruction.includes('shower')) icon = <Shower className="h-4 w-4 text-green-500" />;
              else icon = <Clock className="h-4 w-4 text-gray-500" />;

              return (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  {icon}
                  <p className="text-sm text-gray-700 flex-1">{instruction}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Instruction Simplifier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Simplify Medical Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a complex medical instruction:
            </label>
            <Textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Paste a medical instruction that you'd like simplified..."
              className="min-h-20"
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
                Simplify Instruction
              </>
            )}
          </Button>

          {simplifiedInstruction && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Simplified Version:</h4>
              <p className="text-sm text-green-700">{simplifiedInstruction}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Common Pre-Op Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {preOpFAQ.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

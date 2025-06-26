
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, Loader2, Copy, Check } from 'lucide-react';
import { callGeminiAPI } from '@/utils/geminiAPI';
import { useToast } from '@/components/ui/use-toast';

export const MedicalReportsGenerator = () => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [reportType, setReportType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('1');
  const [medicalReport, setMedicalReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMedicalReport = async () => {
    if (!naturalLanguageInput.trim() || !reportType) {
      toast({
        title: "Missing Information",
        description: "Please provide patient information and select a report type.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setMedicalReport('');

    const prompt = `Convert the following patient information into a professional medical report:

Report Type: ${reportType}
Urgency Level: ${urgencyLevel}/5
Patient Information: ${naturalLanguageInput}

Please generate a comprehensive medical report using appropriate medical terminology and formatting. Include:
1. Patient presentation summary
2. Clinical assessment
3. Recommendations
4. Follow-up requirements
5. Any urgent concerns if applicable

Format the report professionally for medical documentation.`;

    try {
      const response = await callGeminiAPI(prompt);
      setMedicalReport(response);
      
      toast({
        title: "Report Generated",
        description: "Medical report has been successfully generated.",
      });
    } catch (error) {
      console.error('Error generating medical report:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate medical report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(medicalReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Medical report copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case '1': return 'text-green-600';
      case '2': return 'text-blue-600';
      case '3': return 'text-yellow-600';
      case '4': return 'text-orange-600';
      case '5': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Medical Report Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="symptom_assessment">Symptom Assessment</SelectItem>
                  <SelectItem value="medication_analysis">Medication Analysis</SelectItem>
                  <SelectItem value="care_summary">Care Summary</SelectItem>
                  <SelectItem value="progress_report">Progress Report</SelectItem>
                  <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Low (1)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Routine (2)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Moderate (3)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>High (4)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Critical (5)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="patientInfo">Patient Information (Natural Language)</Label>
            <Textarea
              id="patientInfo"
              placeholder="Enter patient information in natural language, e.g., 'Patient reports chest pain when climbing stairs, feeling tired, taking aspirin and metoprolol, surgery scheduled for next week...'"
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              className="min-h-[120px] mt-2"
            />
          </div>

          <Button 
            onClick={generateMedicalReport}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Medical Report...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate Medical Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {medicalReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Generated Medical Report</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getUrgencyColor(urgencyLevel)}>
                  Urgency: {urgencyLevel}/5
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {medicalReport}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


// Utility for calling the Gemini API
export async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    // Check if we're in a Supabase environment with access to edge functions
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      // Use Supabase edge function to call Gemini API securely
      const response = await fetch(`${supabaseUrl}/functions/v1/call-gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } else {
      // Fallback to mock responses for development
      console.warn('Supabase not configured, using mock responses');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getMockResponse(prompt);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to mock response on error
    return getMockResponse(prompt);
  }
}

// Enhanced mock responses with better healthcare guidance
function getMockResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('emergency') || lowerPrompt.includes('severe pain') || lowerPrompt.includes('chest pain')) {
    return `🚨 **IMPORTANT**: If you're experiencing severe symptoms, please contact emergency services immediately.

**Call 911 if you have:**
- Severe chest pain
- Difficulty breathing
- Loss of consciousness
- Severe bleeding

**Contact your cardiologist immediately for:**
- New or worsening symptoms
- Concerning changes in your condition

For non-emergency questions, I'm here to help with general guidance. How can I assist you today?`;
  }
  
  if (lowerPrompt.includes('side effect') || lowerPrompt.includes('medication')) {
    return `I understand you're concerned about medication side effects. Here's some general guidance:

**Mild side effects** (nausea, mild dizziness):
- Monitor symptoms and note when they occur
- Take medications with food if recommended
- Stay hydrated

**Contact your healthcare provider if you experience:**
- Severe or worsening side effects
- New symptoms after starting medication
- Symptoms that interfere with daily activities

**Emergency signs** (difficulty breathing, severe allergic reactions):
- Call 911 immediately

Remember: Never stop cardiac medications without consulting your doctor first. Would you like me to help you track these symptoms or provide more specific guidance?`;
  }
  
  if (lowerPrompt.includes('simplify') && lowerPrompt.includes('pre-op')) {
    return `Here's a simplified pre-surgery checklist:

🍽️ **No Food or Drinks**: Stop eating and drinking after midnight before your surgery. This keeps you safe during anesthesia.

🚿 **Clean Up**: Take a shower with the special antibacterial soap your team gave you.

💊 **Medications**: Only take the medications your doctor specifically said to take. Bring your complete medication list.

👔 **What to Wear**: Wear comfortable, loose clothing and leave jewelry at home.

❓ **Questions or Concerns**: Contact your surgical team at [their number] if you have any questions.

This helps ensure your surgery goes smoothly and safely!`;
  }
  
  if (lowerPrompt.includes('simplify') && lowerPrompt.includes('post-op')) {
    return `Here's what you need to know after surgery:

❤️ **Keep Your Incision Clean**: Gently wash with soap and water, then pat dry. Watch for redness or unusual drainage.

🚫 **Take It Easy**: No lifting anything heavier than 10 pounds for 6 weeks. Listen to your body and rest when you need to.

💊 **Take Your Medications**: These help your heart heal. Don't skip doses, even if you feel better.

⚠️ **Call Your Doctor If**: You have a fever over 101°F, severe pain, or unusual swelling.

📞 **Emergency Contact**: Call 911 for severe chest pain, difficulty breathing, or other emergency symptoms.

Remember, healing takes time, and you're doing great! Contact your care team with any concerns.`;
  }
  
  if (lowerPrompt.includes('symptoms') || lowerPrompt.includes('feeling')) {
    return `I understand you're concerned about how you're feeling. Let me help assess your symptoms:

**Normal recovery symptoms may include:**
- Mild fatigue and tiredness
- Some discomfort at the incision site
- Gradual improvement in energy levels

**Please contact your healthcare team if you experience:**
- Severe or worsening chest pain
- Significant shortness of breath
- Fever over 101°F (38.3°C)
- Unusual swelling or rapid weight gain
- Signs of infection at incision site

**Call 911 immediately for:**
- Severe chest pain
- Difficulty breathing
- Loss of consciousness
- Severe bleeding

Your body needs time to heal, and everyone recovers at their own pace. Don't hesitate to reach out to your care team - they're there to support you through this process.

Would you like me to help you track these symptoms or provide more specific guidance?`;
  }
  
  // Default response with contact guidance
  return `Thank you for your question. I'm here to provide general support and information about cardiac care.

**For immediate medical concerns:**
- Call 911 for emergencies
- Contact your cardiologist for urgent questions
- Reach out to your care team for guidance

**For general support:**
I can help with medication reminders, symptom tracking, and general care information.

**Remember**: This information is for educational purposes only. For personalized medical advice, always consult with your healthcare team who knows your specific situation.

Is there anything specific about your cardiac care that I can help you with today?`;
}

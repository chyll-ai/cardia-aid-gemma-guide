
// Utility for calling the Gemini API
export async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    // In a real implementation, you would get the API key from environment variables
    // For this demo, we'll simulate the API call
    const apiKey = process.env.GEMINI_API_KEY || 'demo-key';
    
    if (apiKey === 'demo-key') {
      // Simulate API delay and return mock responses
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getMockResponse(prompt);
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Mock responses for demo purposes
function getMockResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('simplify') && lowerPrompt.includes('pre-op')) {
    return `Here's a simplified version:

🍽️ **No Food or Drinks**: Stop eating and drinking after midnight before your surgery. This keeps you safe during anesthesia.

🚿 **Clean Up**: Take a shower with the special antibacterial soap your team gave you.

💊 **Medications**: Only take the medications your doctor specifically said to take. Bring your complete medication list.

👔 **What to Wear**: Wear comfortable, loose clothing and leave jewelry at home.

This helps ensure your surgery goes smoothly and safely!`;
  }
  
  if (lowerPrompt.includes('simplify') && lowerPrompt.includes('post-op')) {
    return `Here's what you need to know:

❤️ **Keep Your Incision Clean**: Gently wash with soap and water, then pat dry. Watch for redness or unusual drainage.

🚫 **Take It Easy**: No lifting anything heavier than 10 pounds for 6 weeks. Listen to your body and rest when you need to.

💊 **Take Your Medications**: These help your heart heal. Don't skip doses, even if you feel better.

⚠️ **Call Your Doctor If**: You have a fever over 101°F, severe pain, or unusual swelling.

Remember, healing takes time, and you're doing great!`;
  }
  
  if (lowerPrompt.includes('adherence') || lowerPrompt.includes('medication')) {
    return `Great job tracking your medications! Taking your heart medications exactly as prescribed is one of the most important things you can do for your recovery. 

Even if you missed a dose today, don't worry - just take your next dose as scheduled. Consider setting phone reminders or using a pill organizer to help maintain your routine.

Your heart is healing, and each medication plays a vital role in keeping you healthy. Keep up the excellent work! 💊❤️`;
  }
  
  if (lowerPrompt.includes('shower') || lowerPrompt.includes('bathing')) {
    return `You can typically shower 24-48 hours after surgery, but always follow your specific discharge instructions. 

Here are some general guidelines:
• Use lukewarm water and mild soap
• Gently wash the incision area - don't scrub
• Pat the area dry with a clean towel
• Avoid soaking in baths or hot tubs for 6 weeks

If you notice increased redness, drainage, or separation of the incision, contact your healthcare team right away. When in doubt, it's always best to check with your care team first!`;
  }
  
  if (lowerPrompt.includes('walking') || lowerPrompt.includes('exercise')) {
    return `Walking is excellent for your recovery! Start slowly and gradually increase your activity.

Generally, you can:
• Walk as tolerated, starting with short distances
• Increase walking time by 5 minutes each day
• Stop if you feel chest pain, dizziness, or extreme fatigue
• Avoid stairs for the first few days if possible

Remember, everyone heals at their own pace. Listen to your body and don't push too hard. Your healthcare team can provide specific activity guidelines based on your procedure and recovery progress.`;
  }
  
  if (lowerPrompt.includes('foods') || lowerPrompt.includes('diet')) {
    return `A heart-healthy diet will support your recovery! Here are some general guidelines:

✅ **Good choices:**
• Fresh fruits and vegetables
• Lean proteins like fish and chicken
• Whole grains
• Low-sodium options

❌ **Limit these:**
• High-sodium processed foods
• Saturated fats and fried foods
• Excessive caffeine
• Alcohol (especially if taking medications)

Stay hydrated with water, and eat small, frequent meals if you have a reduced appetite. Your healthcare team may have given you specific dietary instructions - always follow those first!`;
  }
  
  if (lowerPrompt.includes('symptoms') || lowerPrompt.includes('feeling')) {
    return `I understand you're concerned about how you're feeling. It's completely normal to experience some discomfort during recovery.

**Some typical recovery symptoms include:**
• Mild fatigue and tiredness
• Some discomfort at the incision site
• Gradual improvement in energy levels

**Please contact your healthcare team if you experience:**
• Severe or worsening chest pain
• Significant shortness of breath
• Fever over 101°F
• Unusual swelling or rapid weight gain

Your body needs time to heal, and everyone recovers at their own pace. Don't hesitate to reach out to your care team with any concerns - they're there to support you through this process.`;
  }
  
  // Default response for general questions
  return `Thank you for your question. I'm here to provide general support and information about cardiac care.

For the most accurate and personalized guidance, I always recommend discussing your specific situation with your healthcare team. They know your medical history and can provide the best advice for your individual needs.

If you're experiencing any concerning symptoms or have urgent questions, please don't hesitate to contact your doctor or call 911 for emergencies.

Is there anything else I can help you with regarding your cardiac care journey?`;
}

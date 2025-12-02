// src/llm.ts
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import type { MessageAnalysis } from './types.js';

// Validate API key
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error(
    'GEMINI_API_KEY environment variable is not set. Please create a .env file with your API key.'
  );
}

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// Function to call the Gemini API
export async function analyzeMessageWithLLM(
  text: string,
  sender: string
): Promise<MessageAnalysis> {
  const prompt = `
    You are a personal "Text Butler" that helps a busy user deal with incoming messages.

    You will receive:
    - The full message text
    - Basic context about who sent it

    Your job:
    1. Assess the overall priority (considering both importance and urgency).
    2. Summarize the message in 1-2 sentences.
    3. Suggest a short, natural reply the user could send back.
    4. Decide whether the Butler should proactively notify the user.

    Rules:
    - Priority should consider both importance and urgency together.
    - If the message contains emotional content (frustration, disappointment), priority should be at least "medium".
    - If there are deadlines or time-bound asks, priority is "high".
    - Respond ONLY in strict JSON with this shape:

    {
      "priority": "low" | "medium" | "high",
      "vibe": "short one-line description of the emotional tone",
      "tldr": "one or two sentences summarizing the message",
      "suggested_reply": "one or two sentences the user could send back",
      "should_notify": true or false
    }

    Now analyze this message:

    Sender: ${sender}
    Message:
    """${text}"""
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  // Handle response parsing
  if (!response.text) {
    throw new Error('No response text from Gemini API');
  }

  // Try to extract JSON from response (handle cases where response includes markdown code blocks)
  let jsonText = response.text.trim();
  
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
  }

  try {
    const parsed = JSON.parse(jsonText) as Partial<MessageAnalysis>;
    
    // Validate and provide defaults for missing fields
    const analysis: MessageAnalysis = {
      priority: parsed.priority || 'medium',
      vibe: parsed.vibe || 'neutral',
      tldr: parsed.tldr || text.slice(0, 140) + (text.length > 140 ? '...' : ''),
      suggested_reply: parsed.suggested_reply || "Got it, thanks for the update!",
      should_notify: parsed.should_notify ?? true,
    };

    return analysis;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response text:', response.text);
    
    // Return safe defaults
    return {
      priority: 'medium',
      vibe: 'neutral',
      tldr: text.slice(0, 140) + (text.length > 140 ? '...' : ''),
      suggested_reply: "Got it, thanks for the update!",
      should_notify: true,
    };
  }
}

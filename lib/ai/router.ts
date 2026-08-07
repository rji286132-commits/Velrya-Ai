import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

export interface AIProvider {
  name: string;
  generate(prompt: string): Promise<string>;
}

export class SmartRouter {
  async generate(prompt: string): Promise<{ response: string; provider: string }> {
    const enhancedPrompt = `You are VELRYA AI - Next Gen AI Website Builder. Build modern, 3D, responsive websites. Always answer as VELRYA AI.\n\nUser: ${prompt}`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: enhancedPrompt,
        });
        return {
          response: res.text || '',
          provider: 'VELRYA AI',
        };
      } catch (err) {
        console.error('Gemini SmartRouter error:', err);
      }
    }

    if (process.env.GROQ_API_KEY) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: enhancedPrompt }],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 4000,
        });

        return {
          response: chatCompletion.choices[0]?.message?.content || '',
          provider: 'VELRYA AI',
        };
      } catch (error) {
        console.error('VELRYA AI Groq Error:', error);
      }
    }

    return {
      response: `Hello! I am VELRYA AI. Please configure GEMINI_API_KEY or GROQ_API_KEY in environment variables.`,
      provider: 'VELRYA AI',
    };
  }
}

export const smartRouter = new SmartRouter();


import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export interface AIProvider {
  name: string;
  generate(prompt: string): Promise<string>;
}

export class SmartRouter {
  async generate(prompt: string): Promise<{ response: string; provider: string }> {
    try {
      const enhancedPrompt = `You are VELRYA AI - Next Gen AI Website Builder. Build modern, 3D, responsive websites. Always answer as VELRYA AI.\n\nUser: ${prompt}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: enhancedPrompt }],
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 4000,
      });

      return {
        response: chatCompletion.choices[0]?.message?.content || '',
        provider: 'VELRYA AI' // user ko sirf VELRYA AI dikhega, Groq nahi
      };
    } catch (error) {
      console.error('VELRYA AI Error:', error);
      return {
        response: 'Sorry, VELRYA AI encountered an error. Please try again.',
        provider: 'VELRYA AI'
      };
    }
  }
}

export const smartRouter = new SmartRouter();

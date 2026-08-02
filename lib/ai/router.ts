import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface AIProvider {
  name: string;
  generate(prompt: string): Promise<string>;
}

export class SmartRouter {
  async generate(prompt: string): Promise<{ response: string; provider: string }> {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-70b-8192',
        temperature: 0.7,
      });
      return { response: chatCompletion.choices[0]?.message?.content || '', provider: 'Groq' };
    } catch (error) {
      console.error('AI Error:', error);
      return { response: 'Sorry, I encountered an error. Please try again.', provider: 'Error' };
    }
  }
}
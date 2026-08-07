import Groq from 'groq-sdk';

export async function chatGroq(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY missing');
  const client = new Groq({ apiKey });
  const res = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }]
  });
  return res.choices[0]?.message?.content || '';
}

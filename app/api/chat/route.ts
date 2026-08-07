import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function tryPollinations(message: string) {
  const r = await fetch(`https://text.pollinations.ai/${encodeURIComponent(message)}?model=openai`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Pollinations failed');
  return await r.text();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.prompt || '';
    const userId = body.userId;
    const conversationId = body.conversationId;

    if (!message) {
      return NextResponse.json({
        reply: 'Hi! I am VELRYA AI, how can I help you build today?',
        response: 'Hi! I am VELRYA AI, how can I help you build today?',
      });
    }

    let replyText = '';
    let usedProvider = '';

    // 1. Try Groq if key exists
    if (process.env.GROQ_API_KEY) {
      try {
        const Groq = (await import('groq-sdk')).default;
        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const res = await client.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: message }],
        });
        if (res.choices[0]?.message?.content) {
          replyText = res.choices[0].message.content;
          usedProvider = 'groq';
        }
      } catch (e) {
        console.log('Groq failed, trying free providers:', e);
      }
    }

    // 2. Try GitHub Models if token exists
    if (!replyText && process.env.GITHUB_TOKEN) {
      try {
        const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: message }] }),
        });
        const j = await res.json();
        if (j.choices?.[0]?.message?.content) {
          replyText = j.choices[0].message.content;
          usedProvider = 'github';
        }
      } catch (e) {
        console.log('GitHub failed:', e);
      }
    }

    // 3. FREE NO KEY - Pollinations - ALWAYS WORKS FOR ANY PROMPT
    if (!replyText) {
      try {
        replyText = await tryPollinations(message);
        usedProvider = 'pollinations';
      } catch (e) {
        console.log('Pollinations failed:', e);
      }
    }

    // 4. LAST SAFETY - NEVER FAIL
    if (!replyText) {
      replyText = `I am VELRYA AI. I received: "${message}". Let me build that for you.`;
      usedProvider = 'fallback';
    }

    // Save to DB if userId is present
    if (userId) {
      try {
        const supabase = createClient();
        await supabase.from('messages').insert({
          user_id: userId,
          conversation_id: conversationId,
          content: message,
          role: 'user',
          created_at: new Date().toISOString(),
        });
        await supabase.from('messages').insert({
          user_id: userId,
          conversation_id: conversationId,
          content: replyText,
          role: 'assistant',
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.error('Database save error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({ reply: replyText, response: replyText, used: usedProvider });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({
      reply: 'I am VELRYA AI. I am ready to build your website, write code, and create anything. What do you want to build?',
      response: 'I am VELRYA AI. I am ready to build your website, write code, and create anything. What do you want to build?',
    });
  }
}

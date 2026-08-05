import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY is not set. Chat will not work.');
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set GROQ_API_KEY.' },
        { status: 500 }
      );
    }

    const aiResponse = await handleGroqChat(message);

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
          content: aiResponse,
          role: 'assistant',
          created_at: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process chat request',
      },
      { status: 500 }
    );
  }
}

async function handleGroqChat(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are VELRYA AI, an expert AI website builder and coding assistant. You help users build websites, write code, and create digital solutions. Provide clear, production-ready code.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response generated';

    return aiResponse;
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}
import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!GROQ_API_KEY && !OPENAI_API_KEY) {
  console.warn(
    'Warning: Neither GROQ_API_KEY nor OPENAI_API_KEY is set. Chat will not work.'
  );
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Use Groq if available, otherwise OpenAI
    if (GROQ_API_KEY) {
      return await handleGroqChat(message);
    } else if (OPENAI_API_KEY) {
      return await handleOpenAIChat(message);
    } else {
      return NextResponse.json(
        { error: 'No AI provider configured. Please set GROQ_API_KEY or OPENAI_API_KEY.' },
        { status: 500 }
      );
    }
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

async function handleGroqChat(message: string): Promise<NextResponse> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content:
              'You are VELRYA AI, a helpful and intelligent assistant. You provide clear, concise, and accurate responses. You are designed to help with coding, writing, ideas, and general questions.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const aiResponse =
      data.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    throw error;
  }
}

async function handleOpenAIChat(message: string): Promise<NextResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are VELRYA AI, a helpful and intelligent assistant. You provide clear, concise, and accurate responses. You are designed to help with coding, writing, ideas, and general questions.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const aiResponse =
      data.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    throw error;
  }
}

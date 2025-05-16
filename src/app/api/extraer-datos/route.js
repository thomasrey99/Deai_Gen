import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { promptContext } from '../../../../public/prompt';

const openai = new OpenAI({
  apiKey: process.env.CHAT_GPT_KEY, // Tu clave debe estar en .env.local
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt inválido' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: "system", content: promptContext },
        { role: "user", content: prompt },],
    });

    const reply = completion.choices[0]?.message?.content;
    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error('Error al generar respuesta con OpenAI:', error);
    return NextResponse.json(
      { error: 'Hubo un error al generar la respuesta' },
      { status: 500 }
    );
  }
}

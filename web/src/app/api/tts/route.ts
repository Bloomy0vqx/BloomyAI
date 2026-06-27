import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = process.env.HUGGINGFACE_API_KEY ? new HfInference(process.env.HUGGINGFACE_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!hf) {
      return NextResponse.json({ error: 'HuggingFace API key is not configured' }, { status: 500 });
    }

    // Use HuggingFace for TTS
    const result = await hf.textToSpeech({
      model: 'microsoft/speecht5_tts',
      inputs: text,
    });

    // Convert blob to base64
    const arrayBuffer = await result.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:audio/wav;base64,${base64}`;

    return NextResponse.json({ 
      success: true, 
      audio: dataUrl 
    });

  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate speech' 
    }, { status: 500 });
  }
}

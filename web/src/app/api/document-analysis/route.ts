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

    // Use HuggingFace for document analysis
    const response = await hf.textGeneration({
      model: 'HauhauCS/Gemma4-31B-QAT-Uncensored-HauhauCS-Balanced-MTP',
      inputs: `Analyze this document and provide a summary, key insights, entities, and sentiment analysis. Return in JSON format: { "summary": "...", "keyInsights": ["...", "..."], "entities": [{"text": "...", "type": "..."}], "sentiment": {"score": 0.0-1.0, "label": "POSITIVE/NEGATIVE/NEUTRAL"} }\n\nDocument:\n${text}`,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.3,
        return_full_text: false,
      },
    });

    const analysisText = response.generated_text || '{}';
    let analysis;
    
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      // Fallback if JSON parsing fails
      analysis = {
        summary: analysisText,
        keyInsights: [],
        entities: [],
        sentiment: { score: 0.5, label: "NEUTRAL" }
      };
    }

    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;

    return NextResponse.json({ 
      success: true, 
      results: {
        ...analysis,
        statistics: {
          wordCount,
          sentenceCount: sentences,
          characterCount: text.length
        }
      }
    });

  } catch (error: any) {
    console.error('Document analysis error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to analyze document' 
    }, { status: 500 });
  }
}

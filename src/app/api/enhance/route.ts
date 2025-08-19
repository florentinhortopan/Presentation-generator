import { NextRequest, NextResponse } from 'next/server';
import { prdParser } from '@/lib/prd-parser';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'PRD content is required' },
        { status: 400 }
      );
    }

    // Parse with AI enhancement
    const enhancedPresentation = await prdParser.parseMarkdown(content, true);
    
    return NextResponse.json({
      success: true,
      presentation: enhancedPresentation
    });
    
  } catch (error) {
    console.error('Enhancement API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to enhance presentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST your PRD content to /api/enhance for AI enhancement',
    hasApiKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY
  });
}

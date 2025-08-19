import OpenAI from 'openai';
import { Slide, SlideContent, PresentationMeta } from '@/types/presentation';

// Initialize OpenAI client (will need API key from environment)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // For client-side usage
});

export interface AISlideRequest {
  content: string;
  slideIndex: number;
  totalSlides: number;
  presentationMeta: PresentationMeta;
  existingDirectives?: Record<string, string>;
}

export interface AISlideResponse {
  slideType: 'hero' | 'bullet' | 'list' | 'ascii' | 'image' | 'summary' | 'content';
  slideStyle: 'dark' | 'contrast' | 'accent' | 'showcase' | 'grid' | 'highlight' | 'callout' | 'closing';
  transition: 'fade' | 'slide' | 'flip' | 'zoom';
  enhancedContent: SlideContent[];
  reasoning: string;
}

export class AISlideGenerator {
  private async callOpenAI(prompt: string): Promise<string> {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert presentation designer and content strategist. Your job is to analyze PRD (Product Requirements Document) content and generate optimal slide configurations with enhanced content.

CORE CAPABILITIES:
1. Identify the best slide type for content (hero, bullet, list, ascii, image, summary)
2. Determine appropriate visual style (dark, contrast, accent, showcase, grid, highlight, callout, closing)
3. Choose optimal transitions (fade, slide, flip, zoom)
4. Generate enhanced content including ASCII diagrams, formatted text, and structured layouts
5. Maintain consistency with presentation tone and brand

SLIDE TYPES:
- hero: Title/opening slides with large text and minimal content
- bullet: Key points with emphasis and visual hierarchy  
- list: Structured information with clear organization
- ascii: Technical diagrams, workflows, or system architecture
- image: Visual content, mockups, or media-focused slides
- summary: Closing slides with key takeaways

STYLES:
- dark: Standard dark theme
- contrast: High contrast for emphasis
- accent: Brand color highlights
- showcase: Visual-forward presentation
- grid: Structured layout
- highlight: Important information emphasis
- callout: Special attention content
- closing: Final/summary styling

Always respond with valid JSON matching the expected schema.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate AI slide content');
    }
  }

  async generateSlide(request: AISlideRequest): Promise<AISlideResponse> {
    const prompt = `Analyze this slide content and generate an enhanced version:

PRESENTATION CONTEXT:
- Title: ${request.presentationMeta.title}
- Author: ${request.presentationMeta.author}
- Tone: ${request.presentationMeta.voice.tone}
- Style: ${request.presentationMeta.voice.style}
- Slide ${request.slideIndex + 1} of ${request.totalSlides}

CURRENT SLIDE CONTENT:
\`\`\`
${request.content}
\`\`\`

EXISTING DIRECTIVES:
${request.existingDirectives ? JSON.stringify(request.existingDirectives) : 'None'}

TASKS:
1. Determine the optimal slide type based on content
2. Choose appropriate visual style
3. Select best transition type
4. Generate enhanced content with proper formatting
5. Create ASCII diagrams where appropriate
6. Structure text for maximum impact

SPECIAL INSTRUCTIONS:
- If content mentions workflows, processes, or architecture → generate ASCII diagrams
- If content is a title/opening → use hero type
- If content has lists → use bullet or list type  
- If content is concluding → use summary type
- For ASCII diagrams, use Unicode box-drawing characters (┌┐└┘├┤┬┴┼│─)
- Maintain the presentation's tone and voice
- Consider slide position in overall flow

Respond with JSON:
{
  "slideType": "hero|bullet|list|ascii|image|summary|content",
  "slideStyle": "dark|contrast|accent|showcase|grid|highlight|callout|closing", 
  "transition": "fade|slide|flip|zoom",
  "enhancedContent": [
    {
      "type": "title|content|list|diagram|quote",
      "title": "Optional title",
      "content": "Enhanced text content",
      "items": ["list items if applicable"],
      "asciiDiagram": "ASCII diagram if applicable"
    }
  ],
  "reasoning": "Brief explanation of design choices"
}`;

    try {
      const response = await this.callOpenAI(prompt);
      
      // Clean and parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const aiResponse = JSON.parse(jsonMatch[0]) as AISlideResponse;
      
      // Validate response structure
      if (!aiResponse.slideType || !aiResponse.slideStyle || !aiResponse.enhancedContent) {
        throw new Error('Invalid AI response structure');
      }
      
      return aiResponse;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      
      // Fallback response
      return {
        slideType: 'content',
        slideStyle: 'dark',
        transition: 'fade',
        enhancedContent: [
          {
            type: 'content',
            content: request.content
          }
        ],
        reasoning: 'Fallback due to AI processing error'
      };
    }
  }

  async enhancePresentation(slides: Slide[], meta: PresentationMeta): Promise<Slide[]> {
    const enhancedSlides: Slide[] = [];
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      try {
        // Combine slide content into a single string for analysis
        const slideContent = slide.content
          .map(c => {
            if (c.type === 'list' && c.items) {
              return c.items.map(item => `- ${item}`).join('\n');
            }
            return c.content || c.title || '';
          })
          .join('\n\n');

        const aiRequest: AISlideRequest = {
          content: `# ${slide.title}\n\n${slideContent}`,
          slideIndex: i,
          totalSlides: slides.length,
          presentationMeta: meta,
          existingDirectives: slide.directives
        };

        const aiResponse = await this.generateSlide(aiRequest);
        
        // Create enhanced slide
        const enhancedSlide: Slide = {
          ...slide,
          slideType: aiResponse.slideType,
          slideStyle: aiResponse.slideStyle,
          transition: aiResponse.transition,
          content: aiResponse.enhancedContent,
          notes: slide.notes ? `${slide.notes}\n\nAI Enhancement: ${aiResponse.reasoning}` : aiResponse.reasoning
        };
        
        enhancedSlides.push(enhancedSlide);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error enhancing slide ${i + 1}:`, error);
        
        // Keep original slide if enhancement fails
        enhancedSlides.push(slide);
      }
    }
    
    return enhancedSlides;
  }

  async generateWorkflowDiagram(description: string): Promise<string> {
    const prompt = `Generate an ASCII diagram for this workflow description:

"${description}"

Requirements:
- Use Unicode box-drawing characters: ┌┐└┘├┤┬┴┼│─▲▼◄►
- Create a clear, readable flow
- Include labels and arrows
- Maximum width of 60 characters
- Show clear relationships between components

Return only the ASCII diagram, no other text.`;

    try {
      const response = await this.callOpenAI(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error generating workflow diagram:', error);
      return `┌─────────────┐    ┌─────────────┐\n│   Input     │───▶│   Output    │\n└─────────────┘    └─────────────┘`;
    }
  }
}

export const aiSlideGenerator = new AISlideGenerator();

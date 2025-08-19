import OpenAI from 'openai';
import { Slide, PresentationMeta } from '@/types/presentation';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export interface AIGeneratedSlide {
  id: string;
  htmlContent: string;
  metadata: {
    type: string;
    style: string;
    transition: string;
  };
}

export interface AIEnhancedPresentation {
  manifest: {
    meta: {
      title: string;
      author: string;
      theme: {
        primary: string;
        secondary: string;
        tone: string;
        voice: string;
      };
    };
    slides: Array<{
      id: string;
      title: string;
      type: string;
      style: string;
      transition: string;
      content_summary: string;
    }>;
  };
  htmlSlides: AIGeneratedSlide[];
}

export class AISlideGeneratorV2 {
  private buildSystemPrompt(): string {
    return `You are an AI slide compiler for the "PUXA Preso" app.
Input is a Markdown PRD with optional YAML front‑matter and slide hooks:
<!-- @slide:generate type="{type}" style="{style}" transition="{transition}" -->

OUTPUT FORMAT - YOU MUST FOLLOW THIS EXACTLY:

\`\`\`json manifest
{
  "meta": {
    "title": "Presentation Title",
    "author": "Author Name", 
    "theme": {
      "primary": "#00E0FF",
      "secondary": "#FF00AA",
      "tone": "professional",
      "voice": "engaging"
    }
  },
  "slides": [
    {
      "id": "slide-1",
      "title": "Slide Title",
      "type": "hero",
      "style": "dark", 
      "transition": "fade",
      "content_summary": "Brief description"
    }
  ]
}
\`\`\`

\`\`\`html slide-1
<section data-slide-id="slide-1" data-slide-type="hero" data-slide-style="dark" data-transition="fade" class="w-full h-screen bg-slate-950 text-white flex items-center justify-center px-8">
  <div class="max-w-4xl mx-auto text-center space-y-6">
    <h1 class="text-5xl font-bold mb-6" style="color: #00E0FF;">Slide Title</h1>
    <p class="text-xl text-slate-200">Content goes here</p>
  </div>
</section>
\`\`\`

Continue for each slide found.

RULES:
- Start response with \`\`\`json manifest
- Follow with \`\`\`html slide-{number} for each slide
- Use Tailwind CSS classes only
- Include data attributes for metadata
- Use provided colors from frontmatter
- Dark theme (bg-slate-950, text-white)
- Responsive design (max-w-4xl mx-auto)`;
  }

  private buildUserPrompt(prdContent: string): string {
    return `Here is the PRD Markdown to compile:

<BEGIN_MD>
${prdContent}
<END_MD>

TASKS:
1) Parse front-matter and hooks; split into slides.
2) Build manifest (JSON) with meta, assets, and a slide entry per section.
3) Render each slide to a self-contained HTML <section> following mapping rules.

Remember: obey the fence order and labels exactly.

Expected output format:
\`\`\`json manifest
{...deck manifest json...}
\`\`\`

\`\`\`html slide-1
<section ...> ... </section>
\`\`\`

\`\`\`html slide-2
<section ...> ... </section>
\`\`\`

Continue for all slides found in the PRD.`;
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent output
        max_tokens: 4000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate AI slide content: ${error}`);
    }
  }

  private parseAIResponse(response: string): AIEnhancedPresentation {
    console.log('🔍 Parsing AI response:', response.substring(0, 500) + '...');
    
    try {
      // Extract JSON manifest - try multiple patterns
      let manifestMatch = response.match(/```json manifest\n([\s\S]*?)\n```/);
      if (!manifestMatch) {
        // Try alternative patterns
        manifestMatch = response.match(/```json\n([\s\S]*?)\n```/);
        if (!manifestMatch) {
          manifestMatch = response.match(/\{[\s\S]*?"meta"[\s\S]*?\}/);
        }
      }
      
      if (!manifestMatch) {
        console.warn('⚠️ No manifest found, creating fallback');
        // Create fallback manifest
        const fallbackManifest = {
          meta: {
            title: "AI Generated Presentation",
            author: "PUXA AI",
            theme: {
              primary: "#00E0FF",
              secondary: "#FF00AA", 
              tone: "professional",
              voice: "engaging"
            }
          },
          slides: []
        };
        
        // Try to extract slides without manifest
        return this.parseResponseWithoutManifest(response, fallbackManifest);
      }

      let manifest;
      try {
        manifest = JSON.parse(manifestMatch[1] || manifestMatch[0]);
      } catch (jsonError) {
        console.warn('⚠️ Invalid JSON in manifest, using fallback');
        manifest = {
          meta: {
            title: "AI Generated Presentation",
            author: "PUXA AI", 
            theme: {
              primary: "#00E0FF",
              secondary: "#FF00AA",
              tone: "professional", 
              voice: "engaging"
            }
          },
          slides: []
        };
      }

      // Extract HTML slides
      const slideMatches = response.matchAll(/```html slide-(\d+)\n([\s\S]*?)\n```/g);
      const htmlSlides: AIGeneratedSlide[] = [];

      for (const match of slideMatches) {
        const slideIndex = parseInt(match[1]) - 1;
        const htmlContent = match[2];
        
        // Extract metadata from HTML attributes or use defaults
        const typeMatch = htmlContent.match(/data-slide-type="([^"]+)"/);
        const styleMatch = htmlContent.match(/data-slide-style="([^"]+)"/);
        const transitionMatch = htmlContent.match(/data-transition="([^"]+)"/);

        htmlSlides.push({
          id: `slide-${slideIndex + 1}`,
          htmlContent: htmlContent.trim(),
          metadata: {
            type: typeMatch?.[1] || 'content',
            style: styleMatch?.[1] || 'dark',
            transition: transitionMatch?.[1] || 'fade'
          }
        });

        // Update manifest slides if needed
        if (!manifest.slides[slideIndex]) {
          manifest.slides.push({
            id: `slide-${slideIndex + 1}`,
            title: `Slide ${slideIndex + 1}`,
            type: typeMatch?.[1] || 'content',
            style: styleMatch?.[1] || 'dark',
            transition: transitionMatch?.[1] || 'fade',
            content_summary: 'AI generated slide'
          });
        }
      }

      console.log(`✅ Parsed ${htmlSlides.length} slides from AI response`);
      return {
        manifest,
        htmlSlides
      };
    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
      throw new Error(`Failed to parse AI-generated content: ${error}`);
    }
  }

  private parseResponseWithoutManifest(response: string, fallbackManifest: any): AIEnhancedPresentation {
    // Try to extract any HTML sections
    const sectionMatches = response.matchAll(/<section[\s\S]*?<\/section>/g);
    const htmlSlides: AIGeneratedSlide[] = [];

    let slideIndex = 0;
    for (const match of sectionMatches) {
      const htmlContent = match[0];
      
      // Try to extract metadata
      const typeMatch = htmlContent.match(/data-slide-type="([^"]+)"/);
      const styleMatch = htmlContent.match(/data-slide-style="([^"]+)"/);
      const transitionMatch = htmlContent.match(/data-transition="([^"]+)"/);

      htmlSlides.push({
        id: `slide-${slideIndex + 1}`,
        htmlContent: htmlContent.trim(),
        metadata: {
          type: typeMatch?.[1] || 'content',
          style: styleMatch?.[1] || 'dark',
          transition: transitionMatch?.[1] || 'fade'
        }
      });

      fallbackManifest.slides.push({
        id: `slide-${slideIndex + 1}`,
        title: `Slide ${slideIndex + 1}`,
        type: typeMatch?.[1] || 'content',
        style: styleMatch?.[1] || 'dark',
        transition: transitionMatch?.[1] || 'fade',
        content_summary: 'AI generated slide'
      });

      slideIndex++;
    }

    return {
      manifest: fallbackManifest,
      htmlSlides
    };
  }

  async generateEnhancedPresentation(prdContent: string): Promise<AIEnhancedPresentation> {
    console.log('🤖 Starting AI slide generation...');
    
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(prdContent);

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      console.log('✅ AI response received, parsing content...');
      console.log('📝 Full AI Response:');
      console.log('=' .repeat(80));
      console.log(response);
      console.log('=' .repeat(80));
      
      const parsedResponse = this.parseAIResponse(response);
      console.log(`📊 Generated ${parsedResponse.htmlSlides.length} slides`);
      
      return parsedResponse;
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      throw error;
    }
  }

  // Enhanced single slide generation for specific content
  async generateSingleSlide(
    slideContent: string, 
    slideIndex: number, 
    meta: PresentationMeta,
    directives?: Record<string, string>
  ): Promise<AIGeneratedSlide> {
    const systemPrompt = `You are an expert slide designer. Generate a single HTML <section> slide using Tailwind CSS and Framer Motion.

Requirements:
- Use only Tailwind utility classes
- Include Framer Motion animations with motion.div
- Make it responsive and dark-themed
- Include proper data attributes for metadata
- Use provided colors: primary=${meta.theme.primaryColor}, secondary=${meta.theme.secondaryColor}`;

    const userPrompt = `Generate an HTML slide for this content:

CONTENT:
${slideContent}

CONTEXT:
- Title: ${meta.title}
- Author: ${meta.author}
- Tone: ${meta.voice?.tone || 'professional'}
- Style: ${meta.voice?.style || 'storytelling'}
- Slide ${slideIndex + 1}
- Directives: ${JSON.stringify(directives || {})}

Return only the HTML <section> element with proper styling and animations.`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Extract the section element
      const sectionMatch = response.match(/<section[\s\S]*<\/section>/);
      if (!sectionMatch) {
        throw new Error('No valid section element found in response');
      }

      return {
        id: `slide-${slideIndex + 1}`,
        htmlContent: sectionMatch[0],
        metadata: {
          type: directives?.type || 'content',
          style: directives?.style || 'dark',
          transition: directives?.transition || 'fade'
        }
      };
    } catch (error) {
      console.error('Error generating single slide:', error);
      throw error;
    }
  }

  /**
   * Simplified generation that focuses on HTML content only
   */
  async generateSimpleHTML(prdContent: string): Promise<AIGeneratedSlide[]> {
    console.log('🤖 Starting simple AI HTML generation...');
    
    const systemPrompt = `You are an AI slide designer. Convert Markdown PRD content into styled HTML slides.

INSTRUCTIONS:
- Generate one <section> element per slide
- Use Tailwind CSS classes for styling  
- Make slides dark-themed (bg-slate-950, text-white)
- Include data attributes: data-slide-id, data-slide-type, data-slide-style
- Split content on "---" separators
- Use responsive design (max-w-4xl mx-auto)

EXAMPLE OUTPUT:
<section data-slide-id="slide-1" data-slide-type="hero" data-slide-style="dark" class="w-full h-screen bg-slate-950 text-white flex items-center justify-center px-8">
  <div class="max-w-4xl mx-auto text-center space-y-6">
    <h1 class="text-5xl font-bold mb-6 text-cyan-400">Title</h1>
    <p class="text-xl text-slate-200">Content</p>
  </div>
</section>

Return ONLY the HTML sections, no explanations or markdown.`;

    const userPrompt = `Convert this PRD to HTML slides:

${prdContent}

Generate responsive, dark-themed HTML sections with proper styling.`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      console.log('✅ Simple AI response received');
      
      // Extract all section elements
      const sectionMatches = response.matchAll(/<section[\s\S]*?<\/section>/g);
      const htmlSlides: AIGeneratedSlide[] = [];

      let slideIndex = 0;
      for (const match of sectionMatches) {
        const htmlContent = match[0];
        
        // Extract metadata
        const typeMatch = htmlContent.match(/data-slide-type="([^"]+)"/);
        const styleMatch = htmlContent.match(/data-slide-style="([^"]+)"/);
        const transitionMatch = htmlContent.match(/data-transition="([^"]+)"/);

        htmlSlides.push({
          id: `slide-${slideIndex + 1}`,
          htmlContent: htmlContent.trim(),
          metadata: {
            type: typeMatch?.[1] || 'content',
            style: styleMatch?.[1] || 'dark',
            transition: transitionMatch?.[1] || 'fade'
          }
        });

        slideIndex++;
      }

      console.log(`📊 Generated ${htmlSlides.length} simple HTML slides`);
      return htmlSlides;
    } catch (error) {
      console.error('❌ Simple AI generation failed:', error);
      throw error;
    }
  }
}

export const aiSlideGeneratorV2 = new AISlideGeneratorV2();

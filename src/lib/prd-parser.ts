import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { Presentation, PresentationMeta, Slide, SlideContent, PresentationTheme } from '@/types/presentation';
import { aiSlideGenerator } from './ai-slide-generator';
import { aiSlideGeneratorV2, AIEnhancedPresentation } from './ai-slide-generator-v2';

// Default theme configuration
const defaultTheme: PresentationTheme = {
  primaryColor: 'hsl(210, 40%, 98%)',
  secondaryColor: 'hsl(210, 40%, 96%)',
  backgroundColor: 'hsl(224, 71%, 4%)',
  textColor: 'hsl(210, 40%, 98%)',
  accentColor: 'hsl(217, 91%, 60%)',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: {
    title: '3rem',
    subtitle: '1.5rem',
    body: '1.125rem',
    caption: '0.875rem',
  },
  spacing: {
    section: '2rem',
    paragraph: '1rem',
  },
  animation: {
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export class PRDParser {
  private processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml);

  async parseMarkdown(content: string, useAI: boolean = false): Promise<Presentation> {
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    // Extract metadata from frontmatter
    const meta = this.extractMetadata(frontmatter);
    
    // Parse slides from markdown content
    let slides = await this.parseSlides(markdownContent);
    
    // Enhance with AI if requested and API key is available
    if (useAI && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      try {
        console.log('Enhancing presentation with AI...');
        slides = await aiSlideGenerator.enhancePresentation(slides, meta);
        console.log('AI enhancement completed');
      } catch (error) {
        console.warn('AI enhancement failed, using original slides:', error);
      }
    }
    
    return {
      meta,
      slides,
    };
  }

  private extractMetadata(frontmatter: any): PresentationMeta {
    // Handle both old and new metadata formats
    const theme = {
      ...defaultTheme,
      ...frontmatter.theme,
    };

    // Support PUXA format with direct color properties
    if (frontmatter.primary_color) {
      theme.accentColor = frontmatter.primary_color;
      theme.primaryColor = frontmatter.primary_color;
    }
    if (frontmatter.secondary_color) {
      theme.secondaryColor = frontmatter.secondary_color;
    }

    // Extract voice/tone from multiple formats
    const voice = {
      tone: frontmatter.tone || frontmatter.voice?.tone || 'professional',
      style: frontmatter.voice || frontmatter.voice?.style || 'formal',
    };

    return {
      title: frontmatter.title || 'Untitled Presentation',
      subtitle: frontmatter.subtitle,
      author: frontmatter.author || 'Unknown Author',
      date: frontmatter.date,
      version: frontmatter.version || '1.0',
      description: frontmatter.description,
      theme,
      voice,
    };
  }

  private async parseSlides(content: string): Promise<Slide[]> {
    // Split content by slide separators (--- or ## Slide)
    const slideDelimiters = /^(?:---|\#{1,2}\s+(?:Slide|slide))/gm;
    const sections = content.split(slideDelimiters).filter(section => section.trim());
    
    const slides: Slide[] = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      const slide = await this.parseSlideContent(section, i);
      slides.push(slide);
    }
    
    return slides;
  }

  private async parseSlideContent(content: string, index: number): Promise<Slide> {
    const lines = content.split('\n');
    let title = `Slide ${index + 1}`;
    const slideContent: SlideContent[] = [];
    let currentContent = '';
    let currentType: SlideContent['type'] = 'content';
    let slideDirectives: any = {};
    
    // Extract slide generation directives
    const directiveMatch = content.match(/<!--\s*@slide:generate\s+(.+?)\s*-->/);
    if (directiveMatch) {
      const directiveString = directiveMatch[1];
      const directives = directiveString.split(/\s+/);
      directives.forEach(directive => {
        const [key, value] = directive.split('=');
        if (key && value) {
          slideDirectives[key] = value.replace(/"/g, '');
        }
      });
    }
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract title from first heading
      if (line.startsWith('#') && !title.startsWith('Slide')) {
        title = line.replace(/^#+\s*/, '');
        continue;
      }
      
      // Detect ASCII diagrams (lines starting with special chars or having box-drawing characters)
      if (this.isAsciiDiagram(line)) {
        if (currentContent) {
          slideContent.push({
            type: currentType,
            content: currentContent.trim(),
          });
          currentContent = '';
        }
        
        // Collect ASCII diagram lines
        let diagramContent = line + '\n';
        let j = i + 1;
        while (j < lines.length && (this.isAsciiDiagram(lines[j]) || lines[j].trim() === '')) {
          diagramContent += lines[j] + '\n';
          j++;
        }
        i = j - 1;
        
        slideContent.push({
          type: 'diagram',
          asciiDiagram: diagramContent.trim(),
        });
        currentType = 'content';
        continue;
      }
      
      // Detect Figma links
      if (line.includes('figma.com')) {
        if (currentContent) {
          slideContent.push({
            type: currentType,
            content: currentContent.trim(),
          });
          currentContent = '';
        }
        
        slideContent.push({
          type: 'image',
          figmaUrl: this.extractFigmaUrl(line),
          title: this.extractFigmaTitle(line),
        });
        currentType = 'content';
        continue;
      }
      
      // Detect lists
      if (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
        if (currentType !== 'list' && currentContent) {
          slideContent.push({
            type: currentType,
            content: currentContent.trim(),
          });
          currentContent = '';
        }
        
        if (currentType !== 'list') {
          currentType = 'list';
          currentContent = line + '\n';
        } else {
          currentContent += line + '\n';
        }
        continue;
      }
      
      // Detect quotes
      if (line.startsWith('>')) {
        if (currentContent) {
          slideContent.push({
            type: currentType,
            content: currentContent.trim(),
          });
          currentContent = '';
        }
        
        slideContent.push({
          type: 'quote',
          content: line.replace(/^>\s*/, ''),
        });
        currentType = 'content';
        continue;
      }
      
      // Regular content
      if (currentType === 'list' && !line.startsWith('-') && !line.startsWith('*') && !/^\d+\./.test(line) && line !== '') {
        slideContent.push({
          type: 'list',
          items: currentContent.trim().split('\n').map(item => item.replace(/^[-*]\s*|\d+\.\s*/, '')),
        });
        currentContent = '';
        currentType = 'content';
      }
      
      currentContent += line + '\n';
    }
    
    // Add remaining content
    if (currentContent.trim()) {
      if (currentType === 'list') {
        slideContent.push({
          type: 'list',
          items: currentContent.trim().split('\n').map(item => item.replace(/^[-*]\s*|\d+\.\s*/, '')),
        });
      } else {
        slideContent.push({
          type: currentType,
          content: currentContent.trim(),
        });
      }
    }
    
    return {
      id: `slide-${index}`,
      title,
      content: slideContent,
      transition: slideDirectives.transition as any || 'fade',
      slideType: slideDirectives.type as any,
      slideStyle: slideDirectives.style as any,
      directives: slideDirectives,
    };
  }

  private isAsciiDiagram(line: string): boolean {
    // Check for common ASCII diagram characters
    const asciiChars = /[┌┐└┘├┤┬┴┼│─╔╗╚╝╠╣╦╩╬║═▲▼◄►□■○●+\-|\/\\]/;
    const boxChars = /[+\-|]/;
    const hasBoxStructure = line.includes('┌') || line.includes('└') || line.includes('├') || 
                           line.includes('│') || line.includes('─') || 
                           (line.includes('+') && line.includes('-'));
    
    return asciiChars.test(line) || hasBoxStructure || 
           (boxChars.test(line) && line.length > 10);
  }

  private extractFigmaUrl(line: string): string {
    const match = line.match(/https:\/\/[^\s]+figma\.com[^\s)]+/);
    return match ? match[0] : '';
  }

  private extractFigmaTitle(line: string): string {
    // Extract title from markdown link format [title](url) or text before the URL
    const linkMatch = line.match(/\[([^\]]+)\]\([^)]+\)/);
    if (linkMatch) return linkMatch[1];
    
    const beforeUrl = line.split('https://')[0].trim();
    return beforeUrl || 'Figma Design';
  }

  /**
   * Parse markdown and generate AI-enhanced HTML slides
   */
  async parseMarkdownWithAI(content: string): Promise<{
    presentation: Presentation;
    aiEnhanced: AIEnhancedPresentation | null;
  }> {
    // First parse the content normally
    const presentation = await this.parseMarkdown(content, false);

    let aiEnhanced: AIEnhancedPresentation | null = null;

    // Try to generate AI-enhanced version
    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.log('🔑 API key detected, length:', process.env.NEXT_PUBLIC_OPENAI_API_KEY.length);
      try {
        console.log('🤖 Generating AI-enhanced slides...');
        console.log('📝 PRD Content length:', content.length);
        console.log('📝 PRD Content preview:', content.substring(0, 200));
        aiEnhanced = await aiSlideGeneratorV2.generateStructurePreservingSlides(content);
        console.log('✅ AI enhancement completed');
        console.log('📊 AI Enhanced result:', aiEnhanced);
        console.log('📊 Number of slides:', aiEnhanced?.htmlSlides?.length || 0);
      } catch (error) {
        console.warn('❌ AI enhancement failed:', error);
        // Continue with standard presentation
      }
    } else {
      console.log('⚠️  OpenAI API key not found, skipping AI enhancement');
    }

    return {
      presentation,
      aiEnhanced
    };
  }

  /**
   * Check if AI enhancement is available
   */
  isAIAvailable(): boolean {
    return !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  }
}

export const prdParser = new PRDParser();

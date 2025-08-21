const fs = require('fs');

let content = fs.readFileSync('src/lib/ai-slide-generator-v2.ts', 'utf8');

// Add a structure-preserving method that respects original slide count
const structurePreservingMethod = `
  /**
   * Generate AI slides that respect the original PRD structure
   * This ensures we get exactly the same number of slides as the original PRD
   */
  async generateStructurePreservingSlides(prdContent: string): Promise<AIEnhancedPresentation> {
    console.log('🎯 Starting STRUCTURE-PRESERVING AI generation...');
    
    // Step 1: Parse the original PRD to get exact slide count
    const slideDelimiters = /^(?:---|\#{1,2}\s+(?:Slide|slide))/gm;
    const sections = prdContent.split(slideDelimiters).filter(section => section.trim());
    
    console.log(\`📋 Original PRD has \${sections.length} sections - will generate exactly \${sections.length} slides\`);
    
    // Step 2: Generate one slide per section
    const htmlSlides: AIGeneratedSlide[] = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      console.log(\`🔄 Processing section \${i + 1}/\${sections.length}...\`);
      
      const enhancedSlide = await this.enhanceSingleSection(section, i + 1);
      htmlSlides.push(enhancedSlide);
    }
    
    console.log(\`✅ Generated exactly \${htmlSlides.length} slides (matching original structure)\`);
    
    // Create manifest
    const titleMatch = prdContent.match(/^# (.+)$/m);
    const presentationTitle = titleMatch?.[1] || 'Presentation';
    
    return {
      manifest: {
        title: presentationTitle,
        description: 'AI-generated presentation',
        totalSlides: htmlSlides.length,
        estimatedDuration: htmlSlides.length * 2,
        theme: 'dark',
        slides: htmlSlides.map((slide, index) => ({
          id: slide.id,
          title: \`Slide \${index + 1}\`,
          type: slide.metadata.type,
          style: slide.metadata.style,
          transition: slide.metadata.transition,
          content_summary: 'Generated content'
        }))
      },
      htmlSlides
    };
  }

  /**
   * Enhance a single section into one HTML slide
   */
  private async enhanceSingleSection(sectionContent: string, slideNumber: number): Promise<AIGeneratedSlide> {
    const systemPrompt = \`Transform this single PRD section into ONE beautiful HTML slide.

REQUIREMENTS:
- Generate EXACTLY ONE <section> element
- Use the content provided, don't add extra content
- Enhance styling and layout only
- Keep the same information and structure
- Use data-slide-id="slide-\${slideNumber}"
- Make it visually appealing with dark theme

SLIDE STRUCTURE:
<section data-slide-id="slide-\${slideNumber}" data-slide-type="TYPE" data-slide-style="dark" class="slide">
  [ENHANCED CONTENT FROM ORIGINAL SECTION]
</section>

TYPES: hero, content, bullet, summary (choose based on content)
FOCUS: Transform the provided content into beautiful HTML, don't add new content.\`;

    const userPrompt = \`Section content:
\${sectionContent}

Transform into ONE enhanced HTML slide. Preserve all original content.\`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Extract the single section
      const sectionMatch = response.match(/<section[\\s\\S]*?<\\/section>/);
      const htmlContent = sectionMatch?.[0] || \`<section data-slide-id="slide-\${slideNumber}">Error processing slide</section>\`;
      
      // Detect slide type from content
      const slideType = this.detectSlideType(sectionContent);
      
      return {
        id: \`slide-\${slideNumber}\`,
        htmlContent: htmlContent.trim(),
        metadata: {
          type: slideType,
          style: 'dark',
          transition: 'fade'
        }
      };
    } catch (error) {
      console.error(\`❌ Error enhancing section \${slideNumber}:\`, error);
      // Return fallback slide
      return {
        id: \`slide-\${slideNumber}\`,
        htmlContent: \`<section data-slide-id="slide-\${slideNumber}" data-slide-type="content" data-slide-style="dark" class="slide">
          <div class="text-center">
            <h1>Section \${slideNumber}</h1>
            <p>\${sectionContent.substring(0, 200)}...</p>
          </div>
        </section>\`,
        metadata: {
          type: 'content',
          style: 'dark',
          transition: 'fade'
        }
      };
    }
  }

  /**
   * Detect slide type from content
   */
  private detectSlideType(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('# ') && content.split('\\n').length < 5) return 'hero';
    if (lowerContent.includes('- ') || lowerContent.includes('* ')) return 'bullet';
    if (lowerContent.includes('```') || lowerContent.includes('┌')) return 'ascii';
    if (lowerContent.includes('conclusion') || lowerContent.includes('summary')) return 'summary';
    
    return 'content';
  }`;

// Insert the new method before the existing generateEnhancedPresentationChunked method
content = content.replace(
  /async generateEnhancedPresentationChunked\(prdContent: string\): Promise<AIEnhancedPresentation> \{/,
  structurePreservingMethod + '\n  async generateEnhancedPresentationChunked(prdContent: string): Promise<AIEnhancedPresentation> {'
);

fs.writeFileSync('src/lib/ai-slide-generator-v2.ts', content);
console.log('✅ Added structure-preserving slide generation method!');

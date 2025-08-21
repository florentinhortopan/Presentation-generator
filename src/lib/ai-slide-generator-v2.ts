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
  
  private getStyleGuidelines(tone?: string, voice?: string): string {
    const styleMap = {
      'professional-formal': {
        colors: 'Conservative palette, high contrast, navy/gray base with accent highlights',
        typography: 'Clean sans-serif, large headers, generous whitespace, left-aligned content',
        layout: 'Grid-based, structured sections, minimal decorative elements',
        animations: 'Subtle fade transitions, no bounce or dynamic effects'
      },
      'casual-conversational': {
        colors: 'Warm, approachable colors, softer contrasts, friendly blues and greens',
        typography: 'Rounded fonts, medium sizes, comfortable line height, mixed alignments',
        layout: 'Organic flow, asymmetrical elements, friendly spacing',
        animations: 'Gentle slides, soft transitions, subtle hover effects'
      },
      'creative-storytelling': {
        colors: 'Bold, vibrant palette, dramatic contrasts, artistic gradients',
        typography: 'Mixed font weights, creative hierarchy, dynamic sizing',
        layout: 'Asymmetrical, artistic compositions, creative use of negative space',
        animations: 'Dynamic transitions, creative reveals, artistic effects'
      },
      'technical-data-driven': {
        colors: 'Monochromatic with accent highlights, code-friendly palette',
        typography: 'Monospace for code, clear hierarchy, tabular layouts',
        layout: 'Structured grids, data tables, technical diagrams',
        animations: 'Minimal, functional transitions, focus on content'
      },
      'minimal-storytelling': {
        colors: 'Restrained palette, subtle gradients, emphasis on whitespace',
        typography: 'Ultra-clean fonts, dramatic size contrasts, zen-like spacing',
        layout: 'Extreme whitespace, single focus points, minimalist compositions',
        animations: 'Elegant fades, smooth transitions, nothing distracting'
      },
      'witty-sarcastic-conversational': {
        colors: 'Playful palette, unexpected color combinations, fun accents',
        typography: 'Quirky fonts, varied sizes, playful arrangements',
        layout: 'Unconventional layouts, humorous elements, broken grids',
        animations: 'Bouncy transitions, playful reveals, fun interactions'
      }
    };

    const key = `${tone || 'professional'}-${voice || 'formal'}`;
    const style = styleMap[key as keyof typeof styleMap] || styleMap['professional-formal'];
    
    return `
STYLE GUIDELINES FOR TONE: ${tone?.toUpperCase()} + VOICE: ${voice?.toUpperCase()}:

**Colors**: ${style.colors}
**Typography**: ${style.typography}  
**Layout**: ${style.layout}
**Animations**: ${style.animations}

Apply these guidelines consistently across all slides while maintaining brand colors from frontmatter.`;
  }

  private buildSystemPrompt(): string {
    return `You are an expert presentation designer and AI slide compiler for "PUXA Preso".

## CORE EXPERTISE
You excel at creating visually stunning, engaging presentations that adapt to different tones, voices, and styles. You understand:
- Modern design principles (typography, spacing, visual hierarchy)
- Professional presentation aesthetics
- Brand consistency and color psychology
- Audience engagement techniques
- Content structure and flow

## INPUT ANALYSIS
Parse Markdown PRD with YAML frontmatter containing:
- title, author, tone, voice, primary_color, secondary_color
- Content sections separated by "---"
- Optional slide generation hooks: <!-- @slide:generate type="{type}" style="{style}" transition="{transition}" -->

## TONE & VOICE ADAPTATION

### TONE STYLES:
- **professional**: Clean, authoritative, business-focused with minimal animations
- **casual**: Friendly, approachable, relaxed with subtle animations
- **technical**: Data-driven, precise, systematic with code-friendly styling
- **creative**: Bold, artistic, experimental with dynamic animations
- **minimal**: Clean, spacious, zen-like with elegant simplicity
- **witty-sarcastic**: Playful, humorous, irreverent with fun elements

### VOICE STYLES:
- **formal**: Traditional business language, structured layouts
- **conversational**: Natural, dialogue-like, engaging interactions
- **storytelling**: Narrative flow, emotional connection, journey-based
- **data-driven**: Metrics-focused, analytical, evidence-based

## VISUAL DESIGN SYSTEM

### SLIDE TYPES & LAYOUTS:
- **hero**: Title slides with dramatic impact, large typography, minimal content
- **bullet**: Key points with visual hierarchy, icons, progressive disclosure, avoid traditional bullet points
- **list**: Structured information with numbered/bulleted organization
- **ascii**: Technical diagrams, code blocks, monospace typography
- **image**: Visual-forward content, large media, minimal text overlay
- **summary**: Conclusion slides with key takeaways, call-to-action
- **comparison**: Side-by-side layouts, vs. scenarios, decision matrices
- **timeline**: Sequential content, process flows, roadmaps
- **quote**: Testimonials, important statements, branded callouts

### STYLE VARIATIONS:
- **dark**: Primary dark theme with accent highlights
- **contrast**: High contrast for emphasis and accessibility
- **accent**: Brand color dominant with complementary highlights  
- **showcase**: Visual-forward with large imagery/graphics
- **grid**: Structured multi-column layouts
- **highlight**: Important information emphasis with background colors
- **callout**: Special attention content with borders/shadows
- **closing**: Final slide styling with strong call-to-action

## OUTPUT FORMAT - FOLLOW EXACTLY:

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
<section data-slide-id="slide-1" data-slide-type="hero" data-slide-style="dark" data-transition="fade" class="w-full h-screen bg-slate-950 text-white flex items-center justify-center px-8 relative overflow-hidden">
  <!-- Dynamic background with brand colors -->
  <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"></div>
  <div class="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10" style="background: radial-gradient(circle, #00E0FF 0%, transparent 70%);"></div>
  <div class="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-10" style="background: radial-gradient(circle, #FF00AA 0%, transparent 70%);"></div>
  
  <!-- Main content -->
  <div class="relative z-10 max-w-4xl mx-auto text-center space-y-8">
    <!-- Custom icon for hero slide -->
    <div class="flex justify-center mb-6">
      <svg class="w-16 h-16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#00E0FF" stroke-width="2" fill="url(#heroGradient)"/>
        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00E0FF;stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:#FF00AA;stop-opacity:0.3"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <h1 class="text-6xl font-bold leading-tight mb-8" style="background: linear-gradient(135deg, #00E0FF, #FF00AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      Slide Title
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
      Compelling subtitle or description
    </p>
  </div>
  
  <!-- Geometric decorative elements -->
  <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
  <div class="absolute top-1/2 left-8 w-2 h-16 rounded-full opacity-30" style="background: linear-gradient(to bottom, #00E0FF, #FF00AA);"></div>
  <div class="absolute top-1/2 right-8 w-2 h-16 rounded-full opacity-30" style="background: linear-gradient(to bottom, #FF00AA, #00E0FF);"></div>
</section>
\`\`\`

## ENHANCED DESIGN RULES:

### TYPOGRAPHY HIERARCHY:
- H1: 4xl-6xl, bold, brand colors, dramatic impact
- H2: 2xl-3xl, semibold, section headers
- H3: xl-2xl, medium, subsection headers  
- Body: lg-xl, regular, readable content
- Caption: sm-base, light, supporting information

### COLOR PSYCHOLOGY & HIGH CONTRAST:
- **MANDATORY CONTRAST**: All text must have 7:1 contrast ratio (AAA standard)
- **Consistent Palette**: Extract exact primary/secondary colors from frontmatter
- **Primary Color Usage**: Headers, CTAs, key icons, progress indicators (20% of design)
- **Secondary Color Usage**: Accents, decorative elements, secondary icons (10% of design)
- **Base Palette (CONSISTENT ACROSS ALL SLIDES)**:
  - Background: Always dark (#0f172a, #1e293b, #000000)
  - Text Primary: Always white (#ffffff, #f8fafc)
  - Text Secondary: Light gray (#e2e8f0, #cbd5e1)
  - Surface/Cards: Dark elevated (#374151, #475569)
- **Never deviate**: Use EXACTLY the same brand colors on every slide
- **Create gradients**: Between primary/secondary for modern look while maintaining contrast

### SPACING & LAYOUT:
- Generous whitespace for professional/minimal tones
- Tighter spacing for technical/data-driven content
- Asymmetrical layouts for creative tones
- Grid-based for formal presentations

### ANIMATIONS & TRANSITIONS:
- Subtle for professional/minimal
- Dynamic for creative/casual
- None for technical/formal
- Playful for witty-sarcastic

### RESPONSIVE DESIGN:
- Mobile-first approach
- Readable on all screen sizes
- Touch-friendly interactive elements
- Scalable typography and spacing

### ACCESSIBILITY ENFORCEMENT:
- **WCAG AAA Contrast**: ENFORCE 7:1 ratio for all text on backgrounds
- **Large Text**: Minimum 4.5:1 ratio for text 18pt+ or 14pt+ bold
- **UI Elements**: 3:1 minimum for interactive elements and borders
- **Color Independence**: Never rely on color alone - use icons + text
- **Font Requirements**: Minimum 16px (1rem) body text, 24px+ (1.5rem) for headings
- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)
- **Screen Reader**: Descriptive alt text and ARIA labels
- **Focus States**: Clear visual indicators using brand colors

### SVG ICON GENERATION GUIDE:

**Icon Style by Tone:**
- **Professional**: Clean lines, geometric shapes, 2px stroke, minimal detail
  Example: <path d="M9 12l2 2 4-4" stroke="currentColor" fill="none" stroke-width="2"/>
- **Creative**: Organic curves, artistic flair, varied stroke weights, hand-drawn feel
  Example: <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
- **Technical**: Geometric precision, grid-based, monospace feel, circuit-like
  Example: <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none"/>
- **Casual**: Rounded corners, friendly curves, approachable, soft edges
  Example: <circle cx="12" cy="12" r="8" stroke="currentColor" fill="none" stroke-width="2"/>
- **Minimal**: Ultra-simple, single stroke, maximum whitespace, zen-like
  Example: <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor"/>
- **Witty**: Playful shapes, unexpected elements, character, fun details
  Example: <path d="M12 2L13.09 8.26L22 9L16 14.74L17.18 21.02L12 17.77L6.82 21.02L8 14.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>

**Visual Enhancement Options for Lists:**

**Option 1 - SVG Icons (for engaging, visual presentations):**
<div class="flex items-center space-x-4 mb-4">
  <svg class="w-6 h-6 flex-shrink-0 text-primary-color" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2"/>
  </svg>
  <span class="text-lg text-white">Enhanced list item</span>
</div>

**Option 2 - Styled Bullets (for professional, clean presentations):**
<div class="flex items-center space-x-4 mb-4">
  <div class="w-2 h-2 rounded-full bg-primary-color flex-shrink-0"></div>
  <span class="text-lg text-white">Professional list item</span>
</div>

**Option 3 - Numbered Lists (for sequential content):**
<div class="flex items-center space-x-4 mb-4">
  <div class="w-8 h-8 rounded-full bg-primary-color text-white flex items-center justify-center text-sm font-bold">1</div>
  <span class="text-lg text-white">Sequential list item</span>
</div>

**Choose based on content type and presentation tone:**
- Use SVG icons when content benefits from visual metaphors
- Use styled bullets for clean, professional lists
- Use numbered items for processes or sequential steps
- Consider the overall slide density and visual complexity

**Optional SVG Icon Library (use when appropriate):**
- Strategy/Planning: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2"/>
- Technology/Code: <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2"/>
- Users/People: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2"/>
- Growth/Trends: <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" stroke-width="2"/>
- Security: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2"/>
- Communication: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2"/>
- Check/Success: <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2"/>

**Background Pattern Examples:**
- Professional: Linear gradients, subtle geometric overlays
- Creative: Organic shapes, artistic patterns, dynamic compositions  
- Technical: Grid patterns, circuit-like elements, structured layouts
- Casual: Soft curves, friendly shapes, warm gradients
- Minimal: Simple gradients, lots of whitespace, clean lines
- Witty: Unexpected patterns, playful elements, fun compositions

**High-Contrast Color Application Rules:**
- **Primary color**: Main headings, key icons, CTAs - ALWAYS at full opacity on dark backgrounds
- **Secondary color**: Accents, decorative elements, supporting graphics - ensure contrast
- **White text**: ALL body text must be #ffffff or #f8fafc on dark backgrounds
- **Gradients**: Combine primary + secondary but maintain text readability over them
- **Background opacity**: 10-30% for subtle patterns, NEVER compromise text contrast
- **Foreground elements**: 80-100% opacity for full visibility and accessibility
- **Consistent hex values**: Use IDENTICAL colors across all slides - no variations

CRITICAL: Extract and utilize the EXACT tone, voice, and colors from frontmatter to create cohesive, brand-consistent presentations with MANDATORY high contrast. Consider enhancing lists with visual elements (SVG icons, styled bullets, or numbered items) when appropriate for the content and tone.`;
  }

  private buildUserPrompt(prdContent: string): string {
    // Extract frontmatter for better prompt context
    const frontmatterMatch = prdContent.match(/^---\n([\s\S]*?)\n---/);
    let frontmatterContext = '';
    let tone = 'professional';
    let voice = 'formal';
    
    // Count expected slides by analyzing content sections
    const contentWithoutFrontmatter = frontmatterMatch ? prdContent.replace(frontmatterMatch[0], '').trim() : prdContent;
    const slideDelimiters = /^(?:---|\#{1,2}\s+(?:Slide|slide))/gm;
    const sections = contentWithoutFrontmatter.split(slideDelimiters).filter(section => section.trim());
    const expectedSlideCount = Math.max(1, sections.length);
    
    console.log(`📊 Detected ${expectedSlideCount} content sections, expecting ${expectedSlideCount} slides`);
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const toneMatch = frontmatter.match(/tone:\s*["']?([^"'\n]+)["']?/);
      const voiceMatch = frontmatter.match(/voice:\s*["']?([^"'\n]+)["']?/);
      
      if (toneMatch) tone = toneMatch[1].trim();
      if (voiceMatch) voice = voiceMatch[1].trim();
      
      frontmatterContext = `
DETECTED FRONTMATTER:
${frontmatter}

SLIDE COUNT ANALYSIS:
- Detected ${expectedSlideCount} content sections
- You MUST generate exactly ${expectedSlideCount} slides
- Each section becomes one slide with format: \`\`\`html slide-1\`\`\`, \`\`\`html slide-2\`\`\`, etc.

HIGH-CONTRAST DESIGN REQUIREMENTS:
- **EXTRACT EXACT COLORS**: Use primary_color and secondary_color hex values from frontmatter
- **ENFORCE CONSISTENCY**: Apply the SAME colors on EVERY slide with IDENTICAL usage patterns
- **MANDATORY CONTRAST**: All text must be white (#ffffff) on dark backgrounds (#0f172a, #1e293b)
- **Brand Identity**: Use primary color for headers/CTAs, secondary for accents - consistently
- **Tone Adaptation**: Adapt typography, spacing, and animations to match specified tone
- **Voice Application**: Apply voice style to content structure and language
- **Color Testing**: Ensure 7:1 contrast ratio for all text elements

${this.getStyleGuidelines(tone, voice)}`;
    } else {
      frontmatterContext = `
SLIDE COUNT ANALYSIS:
- Detected ${expectedSlideCount} content sections
- You MUST generate exactly ${expectedSlideCount} slides
- Each section becomes one slide with format: \`\`\`html slide-1\`\`\`, \`\`\`html slide-2\`\`\`, etc.`;
    }

    return `Here is the PRD Markdown to compile into a stunning presentation:

<BEGIN_MD>
${prdContent}
<END_MD>

${frontmatterContext}

## CRITICAL TASKS:

### 1. ANALYZE & EXTRACT:
- Parse YAML frontmatter for tone, voice, colors, title, author
- **COUNT content sections**: Each section separated by "---" becomes ONE slide
- **IMPORTANT**: Generate slides for EVERY section found in the markdown content
- Detect slide generation hooks and directives
- Understand content hierarchy and flow

### 2. DESIGN ADAPTATION:
- **TONE IMPLEMENTATION**: Apply tone-specific styling (professional = clean lines, creative = bold elements, etc.)
- **VOICE EXPRESSION**: Match voice through layout choices (formal = structured grids, conversational = organic flow)
- **COLOR INTEGRATION**: Use primary/secondary colors strategically for branding and visual hierarchy
- **CONTENT FLOW**: Create logical progression that tells a story

### 3. TECHNICAL EXECUTION:
- Generate complete JSON manifest with accurate metadata
- Create self-contained HTML sections with embedded styling
- Use modern Tailwind classes for responsive design
- Include proper data attributes for functionality
- Ensure accessibility and mobile compatibility

### 4. VISUAL EXCELLENCE & ASSET GENERATION:
- Apply sophisticated typography hierarchy
- Create engaging layouts that match content type
- Use appropriate spacing and visual rhythm
- **Enhanced Lists**: Consider using visual elements for lists (SVG icons, styled bullets, or numbers) when they add value to the content
- Generate tone-appropriate background patterns and decorative elements
- Include visual metaphors and illustrations for key concepts
- Create data visualizations using CSS and SVG when applicable
- Maintain brand consistency across all slides

### 5. INLINE ASSET GENERATION:
- **Custom SVG Icons**: Use meaningful, tone-appropriate SVG icons when they enhance content understanding
- **Background Elements**: Generate CSS gradients, geometric patterns using pure CSS
- **Visual Metaphors**: Create simple inline SVG illustrations for key concepts
- **Decorative Elements**: Add visual flair with brand-colored geometric shapes
- **Data Visualizations**: Design simple charts/graphs using CSS and SVG when needed

## OUTPUT REQUIREMENTS:

\`\`\`json manifest
{
  "meta": {
    "title": "[extracted from frontmatter]",
    "author": "[extracted from frontmatter]",
    "theme": {
      "primary": "[use primary_color from frontmatter]",
      "secondary": "[use secondary_color from frontmatter]",
      "tone": "[use tone from frontmatter]",
      "voice": "[use voice from frontmatter]"
    }
  },
  "slides": [/* accurate slide metadata */]
}
\`\`\`

\`\`\`html slide-1
<section data-slide-id="slide-1" data-slide-type="[appropriate-type]" data-slide-style="[tone-appropriate]" data-transition="[smooth-transition]" class="[comprehensive-tailwind-classes]">
  <!-- Rich, styled content that reflects the tone and voice -->
</section>
\`\`\`

**CRITICAL**: Continue the pattern above for ALL slides found in the PRD content. If there are 5 content sections, generate 5 slides (slide-1, slide-2, slide-3, slide-4, slide-5). Each slide should be:
- Visually distinct but cohesively branded
- Appropriately styled for its content type
- Responsive and accessible
- Engaging and professional

**EXAMPLE COMPLETE OUTPUT FOR 3 SLIDES:**
\`\`\`html slide-1
[First slide HTML]
\`\`\`

\`\`\`html slide-2
[Second slide HTML]
\`\`\`

\`\`\`html slide-3
[Third slide HTML]
\`\`\`

## ASSET GENERATION EXAMPLES BY SLIDE TYPE:

**Hero Slides**: Central icon/logo, brand-colored geometric backgrounds, gradient overlays
**Bullet Slides**: Enhanced list styling with appropriate visual elements, meaningful visuals
**List Slides**: Numbered or icon-based organization, visual hierarchy with graphics
**Comparison Slides**: Split layouts with contrasting visual elements, vs. graphics
**Timeline Slides**: Progress indicators, connecting lines, milestone icons
**Quote Slides**: Large quotation mark graphics, decorative frames, author avatars
**Technical Slides**: Code-style icons, circuit patterns, geometric precision
**Summary Slides**: Checkmark icons, completion graphics, call-to-action visuals

**CRITICAL REQUIREMENTS:**
- Generate EXACTLY ${expectedSlideCount} slides (detected from content sections)
- Use the format: \`\`\`html slide-1\`\`\`, \`\`\`html slide-2\`\`\`, ... \`\`\`html slide-${expectedSlideCount}\`\`\`
- Avoid plain bullet points (•) - enhance lists with appropriate visual elements when beneficial
- Choose between SVG icons, styled bullets, or numbered items based on content and tone
- ALL backgrounds should have some visual interest (gradients, patterns, shapes)
- Icons must match the tone and content meaning

**HIGH CONTRAST & PALETTE CONSISTENCY MANDATES:**
- **ENFORCE 7:1 contrast ratio**: All text must be white/light on dark backgrounds
- **Consistent brand colors**: Use EXACT primary/secondary colors from frontmatter on ALL slides
- **Dark backgrounds ONLY**: #0f172a, #1e293b, or #000000 - never light backgrounds
- **White text ONLY**: #ffffff or #f8fafc - never gray or low-contrast text
- **Brand color application**: Primary for headers/CTAs, secondary for accents - IDENTICAL usage across all slides
- **No color deviation**: Once palette is set, use the SAME hex values on every single slide
- **Test readability**: Ensure every text element passes WCAG AAA standards

Focus on creating a presentation that truly reflects the specified tone and voice while maintaining visual excellence, high contrast, and absolute color consistency throughout all slides.`;
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent output
        max_tokens: 4000, // Increased to handle more slides
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate AI slide content: ${error}`);
    }
  }

  private parseAIResponse(response: string): AIEnhancedPresentation {
    console.log('🔍 Parsing AI response...');
    console.log('📝 Response length:', response.length);
    console.log('📄 Response preview:', response.substring(0, 1000) + '...');
    
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
        console.log('✅ Manifest parsed successfully');
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

      // Extract HTML slides - try multiple patterns
      console.log('🔍 Looking for slide patterns...');
      
      // Pattern 1: ```html slide-1
      let slideMatches = Array.from(response.matchAll(/```html slide-(\d+)\n([\s\S]*?)\n```/g));
      console.log(`📊 Pattern 1 matches: ${slideMatches.length}`);
      
      // Pattern 2: Alternative patterns if first doesn't work
      if (slideMatches.length === 0) {
        slideMatches = Array.from(response.matchAll(/```html slide(\d+)\n([\s\S]*?)\n```/g));
        console.log(`📊 Pattern 2 matches: ${slideMatches.length}`);
      }
      
      // Pattern 3: More relaxed pattern
      if (slideMatches.length === 0) {
        slideMatches = Array.from(response.matchAll(/```html[\s\S]*?slide.*?(\d+)[\s\S]*?\n([\s\S]*?)\n```/g));
        console.log(`📊 Pattern 3 matches: ${slideMatches.length}`);
      }
      
      const htmlSlides: AIGeneratedSlide[] = [];

      for (const match of slideMatches) {
        const slideNumber = match[1];
        const slideIndex = parseInt(slideNumber) - 1;
        const htmlContent = match[2];
        
        console.log(`🔧 Processing slide ${slideNumber}, content length: ${htmlContent.length}`);
        
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

      // If still no slides found, try fallback approach
      if (htmlSlides.length === 0) {
        console.warn('⚠️ No slides found with standard patterns, trying fallback approach');
        return this.parseResponseWithoutManifest(response, manifest);
      }

      console.log(`✅ Successfully parsed ${htmlSlides.length} slides from AI response`);
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
    console.log('🔄 Trying fallback parsing without manifest...');
    
    // Try to extract any HTML sections
    const sectionMatches = Array.from(response.matchAll(/<section[\s\S]*<\/section>/g));
    console.log(`📊 Found ${sectionMatches.length} section elements`);
    
    const htmlSlides: AIGeneratedSlide[] = [];

    let slideIndex = 0;
    for (const match of sectionMatches) {
      const htmlContent = match[0];
      
      console.log(`🔧 Processing fallback slide ${slideIndex + 1}, content length: ${htmlContent.length}`);
      
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

    console.log(`✅ Fallback parsing found ${htmlSlides.length} slides`);
    
    // If still no slides found, create a single error slide
    if (htmlSlides.length === 0) {
      console.warn('⚠️ No HTML sections found, creating error slide');
      const errorSlide: AIGeneratedSlide = {
        id: 'slide-1',
        htmlContent: `
          <section data-slide-id="slide-1" data-slide-type="error" data-slide-style="dark" class="w-full h-screen bg-slate-950 text-white flex items-center justify-center">
            <div class="text-center">
              <h1 class="text-4xl font-bold mb-4 text-red-400">AI Generation Error</h1>
              <p class="text-xl">Unable to parse AI response. Please try again.</p>
              <div class="mt-8 p-4 bg-slate-800 rounded text-left text-sm max-w-2xl">
                <h3 class="font-semibold mb-2">Debug Info:</h3>
                <p>Response length: ${response.length}</p>
                <p>Response preview: ${response.substring(0, 200)}...</p>
              </div>
            </div>
          </section>
        `,
        metadata: {
          type: 'error',
          style: 'dark',
          transition: 'fade'
        }
      };
      
      htmlSlides.push(errorSlide);
      fallbackManifest.slides.push({
        id: 'slide-1',
        title: 'Error Slide',
        type: 'error',
        style: 'dark',
        transition: 'fade',
        content_summary: 'AI generation error'
      });
    }

    return {
      manifest: fallbackManifest,
      htmlSlides
    };
  }


  /**
   * Split PRD content into chunks and generate slides in batches
   */
  private splitPRDIntoChunks(prdContent: string): string[] {
    // Split by slide markers (--- or # headers)
    const sections = prdContent.split(/(?=^#{1,2} )/gm).filter(section => section.trim());
    
    const chunks: string[] = [];
    let currentChunk = '';
    const maxChunkLength = 2000; // Conservative chunk size
    
    for (const section of sections) {
      // If adding this section would exceed max length, save current chunk and start new one
      if (currentChunk.length + section.length > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + section;
      }
    }
    
    // Add the last chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  /**
   * Generate slides for a specific chunk with context
   */
  private async generateChunkSlides(
    chunkContent: string, 
    chunkIndex: number, 
    totalChunks: number,
    presentationContext: string
  ): Promise<AIGeneratedSlide[]> {
    console.log(`🔄 Processing chunk ${chunkIndex + 1}/${totalChunks}...`);
    
    const systemPrompt = `You are an expert presentation designer. Generate HTML slides for this chunk of a PRD.

CONTEXT: This is chunk ${chunkIndex + 1} of ${totalChunks} from a Product Requirements Document.
Presentation Context: ${presentationContext}

REQUIREMENTS:
1. Generate 1-3 high-quality HTML slides for the provided content
2. Each slide must be a complete <section> element with proper styling
3. Use data attributes: data-slide-id, data-slide-type, data-slide-style, data-transition
4. Apply dark theme with professional styling
5. Make slides responsive and visually engaging
6. Include proper animations and transitions

SLIDE TYPES:
- hero: Title/opening slides
- content: Main content slides
- list: Bullet points or lists
- summary: Conclusion/summary slides

SLIDE STYLES:
- dark: Standard dark theme
- accent: With brand colors
- highlight: Important content
- callout: Special attention

Return ONLY the HTML <section> elements, no additional text or explanation.`;

    const userPrompt = `PRD Content Chunk:

${chunkContent}

Generate beautiful, responsive HTML slides for this content.`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Extract section elements
      const sectionMatches = response.matchAll(/<section[\s\S]*?<\/section>/g);
      const htmlSlides: AIGeneratedSlide[] = [];

      for (const match of sectionMatches) {
        const htmlContent = match[0];
        
        // Extract metadata
        const idMatch = htmlContent.match(/data-slide-id="([^"]+)"/);
        const typeMatch = htmlContent.match(/data-slide-type="([^"]+)"/);
        const styleMatch = htmlContent.match(/data-slide-style="([^"]+)"/);
        const transitionMatch = htmlContent.match(/data-transition="([^"]+)"/);

        htmlSlides.push({
          id: idMatch?.[1] || `chunk-${chunkIndex}-slide-${htmlSlides.length + 1}`,
          htmlContent: htmlContent.trim(),
          metadata: {
            type: typeMatch?.[1] || 'content',
            style: styleMatch?.[1] || 'dark',
            transition: transitionMatch?.[1] || 'fade'
          }
        });
      }

      console.log(`✅ Generated ${htmlSlides.length} slides for chunk ${chunkIndex + 1}`);
      return htmlSlides;
    } catch (error) {
      console.error(`❌ Chunk ${chunkIndex + 1} generation failed:`, error);
      // Return empty array on failure to continue with other chunks
      return [];
    }
  }

  /**
   * Generate slides using chunked approach for better token management
   */
  
  
  async generateStructurePreservingSlides(prdContent: string): Promise<AIEnhancedPresentation> {
    return this.generateStructurePreservingSlidesWithGuidance(prdContent, '', 'auto', []);
  }

  async generateStructurePreservingSlidesWithGuidance(
    prdContent: string, 
    layoutGuidance: string = '', 
    selectedLayout: string = 'auto',
    uploadedImages: Array<{id: number; name: string; url: string; size: number}> = []
  ): Promise<AIEnhancedPresentation> {
    console.log('🎯 Starting STRUCTURE-PRESERVING AI generation with layout guidance...');
    console.log('📐 Layout:', selectedLayout);
    console.log('💡 Guidance:', layoutGuidance);
    console.log('🖼️ Images:', uploadedImages.length);
    
    // Use same splitting logic as PRD parser
    const slideDelimiters = /^(?:---|#{1,2}\s+(?:Slide|slide))/gm;
    const sections = prdContent.split(slideDelimiters).filter(section => section.trim());
    
    console.log(`📋 Original PRD has ${sections.length} sections - will generate exactly ${sections.length} slides`);
    
    const htmlSlides: AIGeneratedSlide[] = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      console.log(`🔄 Processing section ${i + 1}/${sections.length} with AI...`);
      
      // Call AI to enhance this section with layout guidance
      const enhancedSlide = await this.enhanceSectionWithAIAndGuidance(
        section, 
        i + 1, 
        layoutGuidance, 
        selectedLayout, 
        uploadedImages
      );
      htmlSlides.push(enhancedSlide);
      
      // Small delay between API calls
      if (i < sections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log(`✅ Generated exactly ${htmlSlides.length} AI-enhanced slides with layout guidance`);
    
    const titleMatch = prdContent.match(/^# (.+)$/m);
    const presentationTitle = titleMatch?.[1] || 'Presentation';
    
    return {
      manifest: {
        meta: {
          title: presentationTitle,
          author: 'AI Generated',
          theme: {
            primary: '#00E0FF',
            secondary: '#FF00AA',
            tone: 'professional',
            voice: 'engaging'
          }
        },
        slides: htmlSlides.map((slide, index) => ({
          id: slide.id,
          title: `Slide ${index + 1}`,
          type: slide.metadata.type,
          style: slide.metadata.style,
          transition: slide.metadata.transition,
          content_summary: 'AI-enhanced content'
        }))
      },
      htmlSlides
    };
  }

  /**
   * Enhance a single section with AI
   */
  
  private async enhanceSectionWithAI(sectionContent: string, slideNumber: number): Promise<AIGeneratedSlide> {
    const systemPrompt = `You are an expert presentation designer. Create BEAUTIFUL, PROFESSIONAL HTML slides.

REQUIREMENTS:
- Generate EXACTLY ONE <section> element with rich, modern styling
- Use the content provided, enhance with professional design
- Apply modern CSS with gradients, shadows, and animations
- Use data-slide-id="slide-${slideNumber}"
- Create visually stunning, presentation-ready slides

DESIGN PATTERNS:
- Hero slides: Large titles with gradient backgrounds
- Content slides: Clean cards with subtle shadows
- List slides: Beautiful bullet points with icons
- Summary slides: Elegant conclusions with highlights

MODERN CSS FEATURES:
- Linear gradients for backgrounds
- Box shadows for depth
- Border radius for modern look
- Flexbox/Grid for layouts
- Smooth transitions and animations
- Professional typography

EXAMPLE STRUCTURE:
<section data-slide-id="slide-${slideNumber}" data-slide-type="TYPE" data-slide-style="modern" class="slide">
  <div class="slide-container" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
    <div class="content">
      [RICH, BEAUTIFUL CONTENT WITH MODERN STYLING]
    </div>
  </div>
</section>

FOCUS: Create stunning, professional slides that look like they were designed by a top presentation designer.`;

    const userPrompt = `Section content:
${sectionContent}

Transform into ONE BEAUTIFUL, PROFESSIONAL HTML slide with modern styling, gradients, and visual appeal.`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Extract the single section
      const sectionMatch = response.match(/<section[\s\S]*?<\/section>/);
      const htmlContent = sectionMatch?.[0] || this.createFallbackSlide(sectionContent, slideNumber);
      
      // Detect slide type from content
      const slideType = this.detectSlideType(sectionContent);
      
      return {
        id: `slide-${slideNumber}`,
        htmlContent: htmlContent.trim(),
        metadata: {
          type: slideType,
          style: 'modern',
          transition: 'fade'
        }
      };
    } catch (error) {
      console.error(`❌ Error enhancing section ${slideNumber}:`, error);
      return {
        id: `slide-${slideNumber}`,
        htmlContent: this.createFallbackSlide(sectionContent, slideNumber),
        metadata: {
          type: 'content',
          style: 'modern',
          transition: 'fade'
        }
      };
    }
  }

  
  /**
   * Enhance a single section with AI and layout guidance
   */
  private async enhanceSectionWithAIAndGuidance(
    sectionContent: string, 
    slideNumber: number, 
    layoutGuidance: string, 
    selectedLayout: string,
    uploadedImages: Array<{id: number; name: string; url: string; size: number}>
  ): Promise<AIGeneratedSlide> {
    // Build layout-specific guidance
    let layoutInstructions = '';
    
    if (selectedLayout !== 'auto') {
      layoutInstructions += `\nLAYOUT TEMPLATE: ${selectedLayout.toUpperCase()}\n`;
      
      switch (selectedLayout) {
        case 'hero':
          layoutInstructions += '- Use large, prominent titles\n- Add gradient backgrounds\n- Include hero imagery or icons\n- Make it visually striking\n';
          break;
        case 'content':
          layoutInstructions += '- Focus on text readability\n- Use clean typography\n- Organize content in clear sections\n- Minimal decorative elements\n';
          break;
        case 'grid':
          layoutInstructions += '- Use multi-column layouts\n- Organize content in grid format\n- Balance visual elements\n- Use cards or boxes for content\n';
          break;
        case 'split':
          layoutInstructions += '- Split content and images side-by-side\n- Use 50/50 or 60/40 layouts\n- Balance text and visual elements\n- Include relevant imagery\n';
          break;
        case 'minimal':
          layoutInstructions += '- Use lots of whitespace\n- Clean, simple design\n- Focus on essential content\n- Subtle, elegant styling\n';
          break;
        case 'modern':
          layoutInstructions += '- Use gradients and shadows\n- Modern card-based design\n- Contemporary color schemes\n- Smooth animations and effects\n';
          break;
      }
    }
    
    if (layoutGuidance.trim()) {
      layoutInstructions += `\nCUSTOM GUIDANCE: ${layoutGuidance}\n`;
    }
    
    if (uploadedImages.length > 0) {
      layoutInstructions += `\nIMAGES TO INCLUDE: ${uploadedImages.map(img => img.name).join(', ')}\n`;
      layoutInstructions += '- Integrate uploaded images appropriately\n';
      layoutInstructions += '- Use images to enhance the content\n';
      layoutInstructions += '- Ensure images complement the layout\n';
    }

    const systemPrompt = `You are an expert presentation designer. Create BEAUTIFUL, PROFESSIONAL HTML slides.

REQUIREMENTS:
- Generate EXACTLY ONE <section> element with rich, modern styling
- Use the content provided, enhance with professional design
- Apply modern CSS with gradients, shadows, and animations
- Use data-slide-id="slide-${slideNumber}"
- Create visually stunning, presentation-ready slides

${layoutInstructions}

DESIGN PATTERNS:
- Hero slides: Large titles with gradient backgrounds
- Content slides: Clean cards with subtle shadows
- List slides: Beautiful bullet points with icons
- Summary slides: Elegant conclusions with highlights

MODERN CSS FEATURES:
- Linear gradients for backgrounds
- Box shadows for depth
- Border radius for modern look
- Flexbox/Grid for layouts
- Smooth transitions and animations
- Professional typography

EXAMPLE STRUCTURE:
<section data-slide-id="slide-${slideNumber}" data-slide-type="TYPE" data-slide-style="modern" class="slide">
  <div class="slide-container" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
    <div class="content">
      [RICH, BEAUTIFUL CONTENT WITH MODERN STYLING]
    </div>
  </div>
</section>

FOCUS: Create stunning, professional slides that follow the specified layout guidance and look like they were designed by a top presentation designer.`;

    const userPrompt = `Section content:
${sectionContent}

Transform into ONE BEAUTIFUL, PROFESSIONAL HTML slide with modern styling, gradients, and visual appeal.`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Extract the HTML content
      const htmlMatch = response.match(/<section[\s\S]*?<\/section>/);
      if (!htmlMatch) {
        throw new Error('No valid HTML section found in AI response');
      }
      
      const htmlContent = htmlMatch[0];
      
      // Extract metadata from the HTML
      const typeMatch = htmlContent.match(/data-slide-type="([^"]+)"/);
      const styleMatch = htmlContent.match(/data-slide-style="([^"]+)"/);
      
      return {
        id: `slide-${slideNumber}`,
        htmlContent,
        metadata: {
          type: typeMatch?.[1] || 'content',
          style: styleMatch?.[1] || 'modern',
          transition: 'fade'
        }
      };
    } catch (error) {
      console.error(`❌ Error enhancing section ${slideNumber}:`, error);
      
      // Fallback to basic HTML if AI fails
      return {
        id: `slide-${slideNumber}`,
        htmlContent: `<section data-slide-id="slide-${slideNumber}" data-slide-type="content" data-slide-style="modern" class="slide">
          <div class="slide-container" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div class="content">
              <h1 style="color: white; font-size: 2.5rem; margin-bottom: 1rem;">Slide ${slideNumber}</h1>
              <div style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.6;">
                ${sectionContent.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
        </section>`,
        metadata: {
          type: 'content',
          style: 'modern',
          transition: 'fade'
        }
      };
    }
  }

  /**
   * Create a beautiful fallback slide
   */
  private createFallbackSlide(content: string, slideNumber: number): string {
    return `<section data-slide-id="slide-${slideNumber}" data-slide-type="content" data-slide-style="modern" class="slide">
      <div class="slide-container" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
        <div class="content">
          <h1 style="color: white; font-size: 2.5rem; margin-bottom: 1rem;">Slide ${slideNumber}</h1>
          <div style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.6;">
            ${content.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    </section>`;
  }

  
  /**
   * Modify a PRD based on user description using AI
   */
  async modifyPRD(prdContent: string, modificationDescription: string): Promise<string> {
    console.log('🤖 Modifying PRD with description:', modificationDescription);
    
    const systemPrompt = `You are an expert PRD (Product Requirements Document) editor. 
    
Your task is to modify the provided PRD based on the user's description while maintaining:
- The original structure and format
- All existing content unless specifically asked to remove
- The markdown formatting and frontmatter
- Professional tone and quality

MODIFICATION GUIDELINES:
- Add new slides/sections if requested
- Modify existing content based on the description
- Maintain consistent formatting
- Preserve all metadata (frontmatter)
- Keep the same slide structure and numbering
- Ensure the result is a valid markdown PRD

RESPONSE FORMAT:
Return ONLY the complete modified PRD content in markdown format.
Do not include any explanations or additional text outside the PRD content.`;

    const userPrompt = `Original PRD Content:
${prdContent}

User's Modification Request:
${modificationDescription}

Please modify the PRD according to the user's request and return the complete updated PRD content.`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Clean up the response to ensure it's just the PRD content
      let modifiedContent = response.trim();
      
      // Remove any markdown code block markers if present
      modifiedContent = modifiedContent.replace(/^\`\`\`markdown\n?/, '').replace(/\n?\`\`\`$/, '');
      
      // Ensure the content starts with frontmatter or a heading
      if (!modifiedContent.startsWith('---') && !modifiedContent.startsWith('#')) {
        throw new Error('AI response does not appear to be a valid PRD format');
      }
      
      console.log('✅ PRD modification completed successfully');
      return modifiedContent;
      
    } catch (error) {
      console.error('❌ PRD modification failed:', error);
      throw new Error(`Failed to modify PRD: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  /**
   * Detect slide type from content
   */
  private detectSlideType(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('# ') && content.split('\n').length < 5) return 'hero';
    if (lowerContent.includes('- ') || lowerContent.includes('* ')) return 'bullet';
    if (lowerContent.includes('conclusion') || lowerContent.includes('summary')) return 'summary';
    
    return 'content';
  }
  async generateEnhancedPresentationChunked(prdContent: string): Promise<AIEnhancedPresentation> {
    console.log('🤖 Starting chunked AI slide generation...');
    
    // Extract presentation context (title, metadata)
    const titleMatch = prdContent.match(/^# (.+)$/m);
    const presentationTitle = titleMatch?.[1] || 'Presentation';
    
    // Split content into manageable chunks
    const chunks = this.splitPRDIntoChunks(prdContent);
    console.log(`📋 Split PRD into ${chunks.length} chunks`);
    
    const allSlides: AIGeneratedSlide[] = [];
    let totalSlideCount = 0;
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      try {
        const chunkSlides = await this.generateChunkSlides(
          chunks[i], 
          i, 
          chunks.length, 
          presentationTitle
        );
        
        // Renumber slides to be sequential
        chunkSlides.forEach((slide, index) => {
          slide.id = `slide-${totalSlideCount + index + 1}`;
        });
        
        allSlides.push(...chunkSlides);
        totalSlideCount += chunkSlides.length;
        
        // Small delay between requests to avoid rate limits
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.warn(`⚠️ Skipping chunk ${i + 1} due to error:`, error);
      }
    }
    
    console.log(`🎉 Generated ${allSlides.length} total slides from ${chunks.length} chunks`);
    
    // Create manifest
    const manifest = {
      title: presentationTitle,
      description: 'AI-generated presentation from PRD',
      totalSlides: allSlides.length,
      estimatedDuration: Math.ceil(allSlides.length * 2), // 2 minutes per slide
      theme: 'dark',
      slides: allSlides.map((slide, index) => ({
        id: slide.id,
        title: `Slide ${index + 1}`,
        type: slide.metadata.type,
        style: slide.metadata.style,
        transition: slide.metadata.transition,
        content_summary: 'AI-generated content'
      }))
    };
    
    return {
      manifest,
      htmlSlides: allSlides
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
   * Demo: Show flexible list enhancement options with visual elements
   */
  generateAssetExample(tone: string = 'professional', primaryColor: string = '#00E0FF'): string {
    return `
<!-- EXAMPLE: Enhanced Bullet Slide with Inline Assets -->
<section class="w-full h-screen bg-slate-950 text-white flex items-center justify-center px-8 relative overflow-hidden">
  <!-- Background with brand colors -->
  <div class="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950"></div>
  <div class="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20" style="background: radial-gradient(circle, ${primaryColor} 0%, transparent 70%);"></div>
  
  <div class="relative z-10 max-w-4xl mx-auto space-y-8">
    <h1 class="text-4xl font-bold mb-8" style="color: ${primaryColor};">Key Features</h1>
    
    <!-- Custom icon bullets instead of traditional • -->
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <svg class="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="${primaryColor}" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="10" stroke="${primaryColor}" stroke-width="1" fill="none" opacity="0.3"/>
        </svg>
        <span class="text-xl">AI-Powered Content Generation</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <svg class="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="${primaryColor}" opacity="0.8"/>
        </svg>
        <span class="text-xl">Lightning Fast Performance</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <svg class="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="${primaryColor}" stroke-width="2" fill="${primaryColor}" opacity="0.2"/>
        </svg>
        <span class="text-xl">Enterprise Security</span>
      </div>
    </div>
  </div>
  
  <!-- Decorative bottom accent -->
  <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[${primaryColor}] to-transparent opacity-60"></div>
</section>`;
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

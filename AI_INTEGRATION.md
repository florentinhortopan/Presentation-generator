# 🤖 AI Integration Guide - PUXA Preso

## Overview

PUXA Preso now includes powerful AI-driven slide generation using OpenAI's GPT-4 model. The AI analyzes your PRD content and intelligently enhances presentations with optimized slide types, styles, transitions, and content.

## 🎯 AI Capabilities

### Content Analysis
- **Slide Type Detection**: Automatically determines optimal slide types (hero, bullet, list, ascii, image, summary)
- **Style Optimization**: Selects appropriate visual styles (dark, contrast, accent, showcase, grid, highlight)
- **Transition Selection**: Chooses smooth transitions (fade, slide, flip, zoom)
- **Content Enhancement**: Improves text formatting, structure, and readability

### Intelligent Features
- **ASCII Diagram Generation**: Creates technical diagrams for workflows and architecture
- **Content Restructuring**: Optimizes information hierarchy and presentation flow
- **Brand Consistency**: Maintains tone and voice throughout the presentation
- **Context Awareness**: Considers slide position and overall presentation narrative

## 🚀 Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure Environment
1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

### 3. Verify Setup
- Visit `/debug` to test AI functionality
- Look for "API Key: Configured" badge
- Try the "Test AI Enhancement" button

## 🎨 How It Works

### 1. Content Analysis
The AI analyzes each slide's content to understand:
- **Purpose**: Title slide, content slide, summary, etc.
- **Content Type**: Text, lists, technical diagrams, workflows
- **Presentation Context**: Position in overall narrative

### 2. Enhancement Process
For each slide, the AI:
1. **Analyzes content structure and meaning**
2. **Determines optimal slide type and style**
3. **Generates enhanced content with better formatting**
4. **Creates ASCII diagrams for technical content**
5. **Maintains brand consistency and tone**

### 3. Output Generation
The AI returns:
- **Enhanced slide content** with improved structure
- **Optimal visual styling** for maximum impact
- **Technical diagrams** where appropriate
- **Reasoning notes** explaining design choices

## 🛠️ Usage

### In the Editor
1. **Create or paste your PRD content**
2. **Click the "AI Enhance" button** (purple sparkles icon)
3. **Wait for processing** (may take 30-60 seconds)
4. **Review enhanced slides** in the preview pane
5. **Present or share** your enhanced presentation

### API Endpoint
For programmatic access:
```bash
curl -X POST http://localhost:3000/api/enhance \
  -H "Content-Type: application/json" \
  -d '{"content": "your PRD markdown content"}'
```

## 🎯 Example Transformations

### Before AI Enhancement
```markdown
# Features
- Feature 1
- Feature 2  
- Feature 3
```

### After AI Enhancement
- **Slide Type**: `bullet`
- **Style**: `accent`
- **Enhanced Content**: Structured with visual hierarchy, emphasis, and improved formatting
- **ASCII Diagrams**: Generated for technical workflows

### Workflow Diagrams
The AI automatically detects workflow descriptions and generates ASCII diagrams:

**Input**: "User logs in, system validates, redirects to dashboard"

**Output**:
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ User Login  │───▶│ Validation  │───▶│ Dashboard   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🔧 Customization

### Slide Directives
You can still use manual directives to guide AI enhancement:
```markdown
<!-- @slide:generate type="hero" style="showcase" transition="fade" -->
```

The AI will respect these hints while optimizing other aspects.

### Voice and Tone
The AI adapts to your presentation metadata:
```yaml
voice:
  tone: "professional"    # professional, casual, technical, creative
  style: "storytelling"   # formal, conversational, storytelling, data-driven
```

## 📊 Performance

- **Processing Time**: 30-60 seconds for typical presentations
- **API Costs**: ~$0.01-0.05 per presentation enhancement
- **Rate Limits**: Respects OpenAI's rate limits with built-in delays
- **Fallback**: Gracefully falls back to original content if AI fails

## 🛡️ Security & Privacy

- **Client-Side Processing**: API key used in browser (for development)
- **Server-Side Option**: Use `/api/enhance` endpoint for production
- **Data Privacy**: Content sent to OpenAI for processing
- **No Storage**: No presentation data stored on our servers

## 🔍 Debugging

### Debug Page (`/debug`)
- Test basic parsing vs AI enhancement
- View detailed enhancement results
- Check API key configuration
- Monitor processing logs

### Common Issues
1. **"API key not configured"**: Check `.env.local` file
2. **"AI enhancement failed"**: Check API key validity and OpenAI status
3. **Slow processing**: Normal for complex presentations
4. **Rate limiting**: Built-in delays handle this automatically

## 🌟 Advanced Features

### Custom Prompts
Modify `ai-slide-generator.ts` to customize AI behavior:
- Adjust system prompts
- Add domain-specific instructions
- Customize output formats

### Integration Options
- **Batch Processing**: Enhance multiple presentations
- **Template Generation**: Create reusable slide templates
- **Content Suggestions**: Get AI recommendations for improvement

## 🎉 Next Steps

With AI integration complete, PUXA Preso can now:
1. ✅ **Analyze PRD content intelligently**
2. ✅ **Generate appropriate slide types and styles**
3. ✅ **Create technical diagrams automatically**
4. ✅ **Enhance content structure and formatting**
5. ✅ **Maintain brand consistency and tone**

Your presentations just got a whole lot smarter! 🚀

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Eye, 
  Download, 
  Copy,
  CheckCircle,
  Palette,
  FileText,
  Zap
} from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { cn } from '@/lib/utils';

interface ExamplePRD {
  id: string;
  title: string;
  description: string;
  theme: string;
  category: 'business' | 'technical' | 'creative' | 'minimal';
  color: string;
  content: string;
}

const examples: ExamplePRD[] = [
  {
    id: 'puxa-comprehensive',
    title: 'Complete Slide Type Showcase',
    description: 'Comprehensive demo featuring all slide types and styles',
    theme: 'Complete Demo',
    category: 'business',
    color: 'bg-gradient-to-r from-cyan-500 to-pink-500',
    content: `---
title: "PUXA Preso — Complete Slide Type Showcase"
author: "PUXA AI Team"
tone: "professional"
voice: "engaging"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
---

# PUXA Preso Showcase

**AI-Driven Presentations** that adapt to your content, style, and audience automatically.

Welcome to the complete demonstration of **every slide type** and **styling option** available in PUXA Preso.

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# Bullet Point Demonstration

## Classic Content Structure

- **First Point**: Clear and concise messaging
- **Second Point**: Supporting details and context  
- **Third Point**: Additional information and specifics
- **Fourth Point**: Call-to-action or next steps

<!-- @slide:generate type="bullet" style="accent" transition="slide" -->

---

# ASCII System Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  PUXA Engine    │───▶│  Styled Slides  │
│                 │    │                 │    │                 │
│  • Markdown     │    │  • AI Parser    │    │  • HTML Output  │
│  • PRD Content  │    │  • Style Gen    │    │  • Animations   │
│  • Metadata     │    │  • Layout AI    │    │  • Transitions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

<!-- @slide:generate type="ascii" style="grid" transition="flip" -->

---

# Summary of Key Features

### Core Capabilities
- **AI-Powered**: OpenAI integration for intelligent slide generation
- **Markdown Native**: Write in familiar syntax, get professional results
- **Real-Time**: Live preview with instant updates
- **Responsive**: Optimized for all devices and screen sizes

> *"PUXA Preso transforms how teams create and share presentations."*

<!-- @slide:generate type="summary" style="callout" transition="slide" -->`
  },
  {
    id: 'puxa-demo',
    title: 'PUXA Preso Demo',
    description: 'Full demo showcasing AI-driven presentation generation',
    theme: 'AI-Powered',
    category: 'business',
    color: 'bg-cyan-500',
    content: `---
title: "PUXA Preso – AI-Driven Presentation Generator"
author: "PUXA"
tone: "professional"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
voice: "engaging"
theme:
  backgroundColor: "hsl(224, 71%, 4%)"
  textColor: "hsl(210, 40%, 98%)"
  fontFamily: "Inter, system-ui, sans-serif"
---

# Product Overview

PUXA Preso generates **interactive, fullscreen presentations** directly from Markdown PRDs.

## Key Benefits

- **Input**: PRD in Markdown
- **Output**: Interactive HTML slides  
- **Style**: Dark theme, responsive, smooth transitions
- **Sharing**: Unique URLs per deck

<!-- @slide:generate type="hero" style="showcase" transition="fade" -->

---

# Core Features

- Paste/upload Markdown PRDs → generate deck instantly
- Render **text, ASCII diagrams, and images**
- Support for **PRD metadata** to adapt style, tone, and colors
- Authoring UI for editing PRDs in-browser
- Shareable presentation URLs

<!-- @slide:generate type="bullet" style="accent" transition="slide" -->

---

# Before vs After AI Workflow

## Before: Traditional Process
\`\`\`
[ Idea ] → [ Wireframes ] → [ Engineering ] → [ Documentation ] → [ Manual Slides ]
\`\`\`

## After: PUXA Process  
\`\`\`
[ Idea ] → [ PRD in Markdown ] → [ PUXA Parser ] → [ Auto-Generated Slides ]
\`\`\`

**Result**: Single source of truth, faster iteration, shared understanding

<!-- @slide:generate type="ascii" style="highlight" transition="slide" -->`
  },
  {
    id: 'ai-product',
    title: 'AI Product Overview',
    description: 'Professional presentation with structured slide hooks',
    theme: 'Professional',
    category: 'business',
    color: 'bg-green-500',
    content: `---
title: "AI Product Presentation"
author: "Product Team"
tone: "professional"
voice: "storytelling"
primary_color: "#22C55E"
secondary_color: "#059669"
---

# Welcome to AI-Powered Presentations

Transform your **PRD documents** into beautiful, interactive presentations with intelligent automation.

## The Future of Dynamic Content

- **Smart Processing**: AI understands your content structure
- **Automatic Styling**: Consistent design without manual effort  
- **Rich Media**: ASCII diagrams, code blocks, and images
- **Professional Results**: Publication-ready slides in minutes

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# Key Features

- **Dynamic Theming**: Adapt visual style automatically
- **ASCII Diagram Support**: Technical diagrams with highlighting
- **Figma Integration**: Embed designs directly
- **Responsive Design**: Perfect for any display
- **Smooth Transitions**: Professional experience

<!-- @slide:generate type="bullet" style="accent" transition="slide" -->

---

# Architecture Overview

## System Flow

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Markdown  │───▶│ AI Engine  │───▶│   Slides    │
│     PRD     │    │  Processing │    │  Generated  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
  User Input         Content Analysis    Interactive UI
\`\`\`

<!-- @slide:generate type="ascii" style="grid" transition="flip" -->

---

# Performance Impact

## Key Results

- **95%** faster slide creation
- **80%** reduction in design time  
- **100%** consistency across presentations
- **Real-time** collaboration support

> *"This tool has transformed how we create and share product presentations."*

<!-- @slide:generate type="bullet" style="highlight" transition="fade" -->`
  },
  {
    id: 'minimal-design',
    title: 'Minimal Design System',
    description: 'Clean, typography-focused monospace theme',
    theme: 'Minimal',
    category: 'minimal',
    color: 'bg-gray-500',
    content: `---
title: "Minimal Design System"
author: "Design Team"
tone: "minimal"
voice: "data-driven"
primary_color: "#9CA3AF"
secondary_color: "#6B7280"
---

# Minimal Design Philosophy

**Less is More**: Stripping away the unnecessary to reveal what truly matters.

## Essence of Simplicity

Clean interfaces that prioritize **content** over decoration, creating **clarity** through intentional design choices.

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# Core Principles

## Design Foundation

- **Remove until it breaks**: Eliminate everything non-essential
- **Typography over decoration**: Let content speak through hierarchy  
- **Whitespace as a feature**: Breathing room enhances comprehension
- **Function drives form**: Purpose shapes every design decision

<!-- @slide:generate type="bullet" style="contrast" transition="slide" -->

---

# Typography System

## Hierarchy & Spacing

\`\`\`
H1: 32px / 1.2   │ Primary Headers
H2: 24px / 1.3   │ Section Dividers  
H3: 18px / 1.4   │ Subsection Headers
Body: 16px / 1.6 │ Content Text
Caption: 14px    │ Metadata & Labels
\`\`\`

**Typeface**: SF Mono for technical precision and readability

<!-- @slide:generate type="ascii" style="grid" transition="fade" -->

---

# Implementation

## System in Practice

1. **Start with content structure**
2. **Add minimal visual hierarchy** 
3. **Test with real data**
4. **Remove anything unnecessary**
5. **Iterate based on user feedback**

> *"Simplicity is the ultimate sophistication."* — Leonardo da Vinci

<!-- @slide:generate type="summary" style="callout" transition="slide" -->`
  },
  {
    id: 'startup-pitch',
    title: 'Startup Revolution',
    description: 'Bold, vibrant theme for startup presentations',
    theme: 'Creative',
    category: 'creative',
    color: 'bg-purple-500',
    content: `---
title: "🚀 Startup Revolution"
author: "Startup Squad"
tone: "creative"
voice: "conversational"
primary_color: "#C084FC"
secondary_color: "#FBBF24"
---

# Welcome to the Future! 🌟

## We're Building Something AMAZING

Ready to **revolutionize** your industry with cutting-edge technology and bold innovation?

- **Disrupt** the status quo
- **Scale** without limits  
- **Impact** millions of users
- **Change** the world

<!-- @slide:generate type="hero" style="showcase" transition="flip" -->

---

# Why We're Different 💡

## Our Unique Advantage

- **AI-First Approach**: Because humans are so 2023 🤖
- **Mobile-Native**: Desktop is dead, long live mobile! 📱
- **Community-Driven**: Users build the product 👥
- **Zero-Config**: It just works, instantly ⚡

<!-- @slide:generate type="bullet" style="accent" transition="slide" -->

---

# The Opportunity 📈

## Market Size & Growth

\`\`\`
Traditional Market: $10B
     ↓ (Disruption)
Digital-First: $100B  
     ↓ (AI Revolution)
Our Market: $1T 🚀
\`\`\`

**We're not just growing a market — we're creating one.**

<!-- @slide:generate type="ascii" style="highlight" transition="fade" -->

---

# Call to Action 💪

## Join the Revolution

Ready to be part of something **bigger than yourself**?

1. **Believe** in the vision
2. **Execute** with passion  
3. **Scale** beyond imagination
4. **Win** together

*The future is what we make it.* Let's make it **extraordinary**! ✨

<!-- @slide:generate type="summary" style="closing" transition="slide" -->`
  },
  {
    id: 'technical-spec',
    title: 'API Technical Specification',
    description: 'Technical documentation with code-focused styling',
    theme: 'Technical',
    category: 'technical',
    color: 'bg-blue-500',
    content: `---
title: "API Technical Specification"
author: "Engineering Team"
tone: "technical"
voice: "formal"
primary_color: "#3B82F6"
secondary_color: "#1E40AF"
---

# API Overview

## RESTful Architecture v2.1

Scalable, maintainable endpoints for modern applications with **comprehensive documentation** and integration examples.

- **Base URL**: \`https://api.example.com/v2\`
- **Authentication**: Bearer Token + API Key
- **Rate Limiting**: 1000 requests/hour
- **Response Format**: JSON with consistent schema

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# Authentication Flow

## OAuth 2.0 + API Key

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│    Auth     │───▶│    API      │
│ Application │    │   Server    │    │  Gateway    │
└─────────────┘    └─────────────┘    └─────────────┘
     │                   │                   │
     ▼                   ▼                   ▼
  API Key           Bearer Token        Protected
  Request           Generation          Resources
\`\`\`

<!-- @slide:generate type="ascii" style="grid" transition="slide" -->

---

# Core Endpoints

## Resource Operations

- **GET** \`/api/v2/users\` - List all users
- **POST** \`/api/v2/users\` - Create new user
- **PUT** \`/api/v2/users/{id}\` - Update user by ID
- **DELETE** \`/api/v2/users/{id}\` - Delete user by ID

### Response Codes
- \`200\` Success with data
- \`201\` Resource created
- \`400\` Bad request format
- \`401\` Authentication required
- \`404\` Resource not found
- \`500\` Server error

<!-- @slide:generate type="bullet" style="contrast" transition="fade" -->

---

# Implementation Guide

## Getting Started

1. **Obtain API credentials** from developer portal
2. **Set authentication headers** in requests
3. **Handle rate limiting** with exponential backoff
4. **Parse JSON responses** according to schema
5. **Implement error handling** for all endpoints

### Example Request
\`\`\`bash
curl -H "Authorization: Bearer {token}" \\
     -H "X-API-Key: {api_key}" \\
     https://api.example.com/v2/users
\`\`\`

<!-- @slide:generate type="summary" style="callout" transition="slide" -->`
  }
];

export default function ExamplesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Examples', icon: FileText },
    { id: 'business', label: 'Business', icon: Palette },
    { id: 'technical', label: 'Technical', icon: FileText },
    { id: 'creative', label: 'Creative', icon: Zap },
    { id: 'minimal', label: 'Minimal', icon: Palette }
  ];

  const filteredExamples = filter === 'all' 
    ? examples 
    : examples.filter(example => example.category === filter);

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadExample = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Navigation />
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Presentation Examples</h1>
        <p className="text-slate-200">
          Explore different themes and styles for your presentations
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category.id)}
                className={cn(
                  "flex items-center gap-2",
                  filter === category.id 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-slate-600 hover:bg-slate-800"
                )}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExamples.map((example) => (
          <Card key={example.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{example.title}</CardTitle>
                  <p className="text-sm text-slate-200 mb-3">
                    {example.description}
                  </p>
                </div>
                <div className={cn("w-3 h-3 rounded-full", example.color)} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {example.theme}
                </Badge>
                <Badge variant="outline" className="text-xs border-slate-600">
                  {example.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  asChild
                >
                  <a 
                    href={`/present?prd=${encodeURIComponent(example.content)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Present
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-800"
                  asChild
                >
                  <a 
                    href={`/editor?content=${encodeURIComponent(example.content)}`}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Edit
                  </a>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(example.content, example.id)}
                  className="hover:bg-slate-800"
                >
                  {copiedId === example.id ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadExample(example.content, example.title)}
                  className="hover:bg-slate-800"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExamples.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            No examples found
          </h3>
          <p className="text-slate-200">
            Try selecting a different category
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 p-6 bg-slate-900/50 rounded-lg border border-slate-800">
        <h3 className="font-semibold mb-2">Create Your Own</h3>
        <p className="text-slate-200 mb-4">
          Ready to create your own presentation? Start with the editor and customize any of these examples.
        </p>
        <Button asChild>
          <a href="/editor" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Open Editor
          </a>
        </Button>
      </div>
      </div>
    </div>
  );
}

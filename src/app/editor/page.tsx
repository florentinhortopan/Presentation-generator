'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Play, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  Eye, 
  Code, 
  FileText,
  CheckCircle,
  AlertCircle,
  Share2,
  Copy,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { prdParser } from '@/lib/prd-parser';
import { aiSlideGeneratorV2 } from '@/lib/ai-slide-generator-v2';
import { Presentation } from '@/types/presentation';
import { ClientPresentationViewer } from '@/components/presentation/ClientPresentationViewer';
import { presentationStorage } from '@/lib/presentation-storage';
import { Navigation } from '@/components/layout/Navigation';
import { processURLParameter } from '@/lib/url-utils';
import { cn } from '@/lib/utils';

const defaultPRD = `---
title: "My AI-Powered Presentation"
author: "Your Name"
tone: "professional"
voice: "engaging"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
---

# Welcome to PUXA Preso

Transform your **Markdown PRDs** into stunning, interactive presentations with AI assistance.

- Write content in **markdown**
- AI generates styled slides automatically
- Professional transitions and animations
- Fully responsive and shareable

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# Key Features

## What Makes PUXA Special

- **AI-Driven**: OpenAI parses your content and generates optimized slides
- **Markdown Native**: Write in familiar syntax, get beautiful results
- **Responsive Design**: Optimized for all screen sizes and devices
- **Interactive Elements**: ASCII diagrams, code blocks, and rich media

<!-- @slide:generate type="bullet" style="accent" transition="slide" -->

---

# Workflow Transformation

## Before: Manual Slide Creation
\`\`\`
[ Idea ] → [ Draft Slides ] → [ Design ] → [ Review ] → [ Present ]
     ↓         ↓              ↓           ↓
   Hours    Manual Work    Inconsistent  Delays
\`\`\`

## After: AI-Powered Generation
\`\`\`
[ PRD Markdown ] → [ AI Processing ] → [ Beautiful Slides ]
       ↓                 ↓                    ↓
   Minutes         Consistent Style      Ready to Present
\`\`\`

<!-- @slide:generate type="ascii" style="grid" transition="flip" -->

---

# Rich Content Support

## ASCII Diagrams
\`\`\`
┌─────────────────┐    ┌─────────────────┐
│   Your Ideas    │───▶│  Beautiful Slides│
│                 │    │                 │
│  • Markdown     │    │  • Styled HTML  │
│  • ASCII Art    │    │  • Animations   │
│  • Code Blocks  │    │  • Transitions  │
└─────────────────┘    └─────────────────┘
\`\`\`

<!-- @slide:generate type="ascii" style="highlight" transition="fade" -->

---

# Getting Started

## Ready to Create?

1. **Edit** your PRD content in the left panel
2. **Watch** the live preview update automatically
3. **Enhance** with AI for professional styling
4. **Present** in fullscreen mode
5. **Share** with your team using short URLs

> *"The best presentations tell a story. PUXA helps you tell yours beautifully."*

<!-- @slide:generate type="summary" style="callout" transition="slide" -->

---

# Next Steps

Start editing this PRD to see the magic happen! ✨

**Pro tip**: Use the slide generation hooks in comments to control how AI styles each section.

<!-- @slide:generate type="summary" style="closing" transition="fade" -->`;

function EditorContent() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState(defaultPRD);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isGeneratingHTML, setIsGeneratingHTML] = useState(false);
  const [aiGeneratedSlides, setAiGeneratedSlides] = useState<any>(null);
  const [useAISlides, setUseAISlides] = useState(false);

  // Parse and validate PRD
  const validateAndParse = useCallback(async (prdContent: string) => {
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const parsed = await prdParser.parseMarkdown(prdContent);
      setPresentation(parsed);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid PRD format';
      setValidationError(errorMessage);
      setPresentation(null);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Auto-validate on content change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateAndParse(content);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content, validateAndParse]);

  // Load content from URL parameter
  useEffect(() => {
    const urlContent = searchParams.get('content');
    if (urlContent) {
      try {
        const decoded = processURLParameter(urlContent);
        
        if (decoded) {
          setContent(decoded);
          setHasUnsavedChanges(true);
        } else {
          console.warn('Failed to process URL content parameter, using default content');
        }
      } catch (error) {
        console.error('Error loading content from URL:', error);
        // Silently use default content - don't show error to user
      }
    }
  }, [searchParams]);

  // Check for API key
  useEffect(() => {
    setHasApiKey(!!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  }, []);

  // Initial parse
  useEffect(() => {
    validateAndParse(content);
  }, []);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('prd-draft', content);
    setHasUnsavedChanges(false);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('prd-draft');
    if (saved) {
      setContent(saved);
      setHasUnsavedChanges(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      setContent(fileContent);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    setContent(defaultPRD);
    setHasUnsavedChanges(false);
  };

  const handleShare = async () => {
    if (!presentation) {
      alert('Please wait for the presentation to finish processing before sharing.');
      return;
    }

    try {
      // Save presentation and get short ID
      const presentationId = await presentationStorage.savePresentation(
        content, 
        presentation, 
        aiGeneratedSlides, 
        useAISlides
      );
      const url = `${window.location.origin}/present?id=${presentationId}`;
      
      await navigator.clipboard.writeText(url);
      alert(`Shareable URL copied to clipboard!\nShort URL: ${url}`);
    } catch (err) {
      console.error('Failed to create shareable URL:', err);
      alert('Failed to create shareable URL. Please try again.');
    }
  };

  const handleAIEnhancement = async () => {
    if (!hasApiKey) {
      alert('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhanced = await prdParser.parseMarkdown(content, true);
      setPresentation(enhanced);
      alert('Presentation enhanced with AI! Check the preview to see improvements.');
    } catch (error) {
      console.error('AI enhancement failed:', error);
      alert('AI enhancement failed. Please check your API key and try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAIGenerateHTML = async () => {
    if (!hasApiKey) {
      alert('OpenAI API key is required for HTML generation.');
      return;
    }

    setIsGeneratingHTML(true);
    try {
      console.log('🤖 Starting AI HTML generation...');
      const result = await prdParser.parseMarkdownWithAI(content);
      
      if (result.aiEnhanced) {
        setAiGeneratedSlides(result.aiEnhanced);
        setUseAISlides(true); // Automatically switch to AI slides when generated
        console.log('✅ AI HTML slides generated:', result.aiEnhanced);
        alert(`Successfully generated ${result.aiEnhanced.htmlSlides.length} AI-powered HTML slides! View switched to AI slides.`);
      } else {
        throw new Error('No AI-enhanced content was generated');
      }
    } catch (error) {
      console.error('❌ AI HTML generation failed:', error);
      alert(`AI HTML generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingHTML(false);
    }
  };

  const presentationCount = presentation?.slides.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-semibold">PRD Editor</h1>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                Unsaved
              </Badge>
            )}
          </div>
          
          {/* Validation Status */}
          <div className="flex items-center gap-2">
            {isValidating ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Validating...</span>
              </div>
            ) : validationError ? (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Invalid PRD</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{presentationCount} slides</span>
              </div>
            )}
            {aiGeneratedSlides && (
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">{aiGeneratedSlides.htmlSlides.length} AI HTML slides</span>
              </div>
            )}
          </div>
          
          {/* Slide type toggle */}
          {aiGeneratedSlides && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">View:</span>
              <Button
                variant={useAISlides ? "default" : "outline"}
                size="sm"
                onClick={() => setUseAISlides(true)}
                className="text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Slides
              </Button>
              <Button
                variant={!useAISlides ? "default" : "outline"}
                size="sm"
                onClick={() => setUseAISlides(false)}
                className="text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                Markdown
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".md,.markdown"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Load
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {presentation && (
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset to Default</AlertDialogTitle>
                <AlertDialogDescription>
                  This will replace your current content with the default template. 
                  Any unsaved changes will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetToDefault}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {hasApiKey && presentation && (
            <Button 
              size="sm" 
              onClick={handleAIEnhancement}
              disabled={isEnhancing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isEnhancing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
            </Button>
          )}

          {hasApiKey && (
            <Button
              size="sm"
              onClick={handleAIGenerateHTML}
              disabled={isGeneratingHTML}
              className="bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
            >
              {isGeneratingHTML ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isGeneratingHTML ? 'Generating HTML...' : 'AI Generate HTML'}
            </Button>
          )}

          {presentation && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={async () => {
                try {
                  const presentationId = await presentationStorage.savePresentation(
                    content, 
                    presentation, 
                    aiGeneratedSlides, 
                    useAISlides
                  );
                  window.open(`/present?id=${presentationId}`, '_blank');
                } catch (err) {
                  console.error('Failed to save presentation:', err);
                  // Fallback to legacy method
                  window.open(`/present?prd=${encodeURIComponent(content)}`, '_blank');
                }
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Present
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="h-[calc(100%-48px)] m-0">
            <PanelGroup direction="horizontal">
              {/* Editor Panel */}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col bg-slate-900/30">
                  <div className="p-4 border-b border-slate-800">
                    <h3 className="font-medium">Markdown Editor</h3>
                    <p className="text-sm text-slate-200">
                      Edit your PRD content with live validation
                    </p>
                  </div>
                  <div className="flex-1 p-4">
                    <Textarea
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full h-full resize-none font-mono text-sm bg-slate-950 border-slate-700"
                      placeholder="Enter your PRD content..."
                    />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="w-2 bg-slate-800 hover:bg-slate-700 transition-colors" />

              {/* Preview Panel */}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-800 bg-slate-900/30">
                    <h3 className="font-medium">Live Preview</h3>
                    <p className="text-sm text-slate-200">
                      See your presentation in real-time
                    </p>
                  </div>
                  <div className="flex-1 bg-slate-950">
                    {validationError ? (
                      <div className="h-full flex items-center justify-center p-8">
                        <Card className="bg-red-900/20 border-red-800">
                          <CardContent className="p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="font-semibold text-red-200 mb-2">Validation Error</h3>
                            <p className="text-sm text-red-300">{validationError}</p>
                          </CardContent>
                        </Card>
                      </div>
                    ) : presentation ? (
                      <ClientPresentationViewer 
                        presentation={presentation} 
                        aiEnhancedPresentation={aiGeneratedSlides}
                        useAISlides={useAISlides}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-slate-200">
                          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p>Processing PRD...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </TabsContent>

          <TabsContent value="preview" className="h-[calc(100%-48px)] m-0">
                      <div className="h-full">
            {presentation ? (
              <ClientPresentationViewer 
                presentation={presentation} 
                aiEnhancedPresentation={aiGeneratedSlides}
                useAISlides={useAISlides}
              />
            ) : (
                <div className="h-full flex items-center justify-center">
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Valid Presentation</h3>
                      <p className="text-sm text-slate-200">
                        Please fix the PRD format to see the preview
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center text-slate-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

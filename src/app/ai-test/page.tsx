'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Sparkles, Eye, Code } from 'lucide-react';
import { aiSlideGeneratorV2 } from '@/lib/ai-slide-generator-v2';
import { AISlideRenderer } from '@/components/presentation/AISlideRenderer';

const testPRD = `---
title: "Test AI Slide Generation"
author: "PUXA AI"
tone: "professional"
voice: "engaging"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
---

# Welcome to AI Testing

This is a **test slide** to verify AI HTML generation works correctly.

- Feature testing
- HTML generation  
- Style application

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# Technical Flow

## System Architecture

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Input     │───▶│ AI Engine  │───▶│   Output    │
└─────────────┘    └─────────────┘    └─────────────┘
\`\`\`

<!-- @slide:generate type="ascii" style="grid" transition="slide" -->`;

export default function AITestPage() {
  const [prdContent, setPrdContent] = useState(testPRD);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSimple, setIsGeneratingSimple] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [simpleResult, setSimpleResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      console.log('🤖 Testing AI slide generation...');
      const generated = await aiSlideGeneratorV2.generateEnhancedPresentation(prdContent);
      setResult(generated);
      console.log('✅ AI generation successful:', generated);
    } catch (err) {
      console.error('❌ AI generation failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSimple = async () => {
    setIsGeneratingSimple(true);
    setError(null);
    setSimpleResult(null);

    try {
      console.log('🤖 Testing simple AI HTML generation...');
      const htmlSlides = await aiSlideGeneratorV2.generateSimpleHTML(prdContent);
      
      // Create a simple result structure
      const simpleGenerated = {
        manifest: {
          meta: {
            title: "Simple AI Generated Presentation",
            author: "PUXA AI",
            theme: {
              primary: "#00E0FF",
              secondary: "#FF00AA",
              tone: "professional",
              voice: "engaging"
            }
          },
          slides: htmlSlides.map((slide, index) => ({
            id: slide.id,
            title: `Slide ${index + 1}`,
            type: slide.metadata.type,
            style: slide.metadata.style,
            transition: slide.metadata.transition,
            content_summary: 'Simple AI generated slide'
          }))
        },
        htmlSlides
      };
      
      setSimpleResult(simpleGenerated);
      console.log('✅ Simple AI generation successful:', simpleGenerated);
    } catch (err) {
      console.error('❌ Simple AI generation failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGeneratingSimple(false);
    }
  };

  const hasApiKey = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">AI HTML Generation Test</h1>
          <p className="text-slate-200">
            Test the OpenAI integration for generating HTML slides
          </p>
          {!hasApiKey && (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>No OpenAI API key found. Check your environment variables.</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                PRD Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prdContent}
                onChange={(e) => setPrdContent(e.target.value)}
                className="min-h-[300px] bg-slate-950 border-slate-700 font-mono text-sm"
                placeholder="Enter your PRD markdown content..."
              />
              <div className="mt-4 space-y-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !hasApiKey}
                  className="w-full bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating Full...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Full AI (Manifest + HTML)
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleGenerateSimple}
                  disabled={isGeneratingSimple || !hasApiKey}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGeneratingSimple ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating Simple...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Simple HTML Only
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Generated Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="flex items-center gap-2 text-red-400 p-4 bg-red-900/20 rounded border border-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {(result || simpleResult) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Generated {(result || simpleResult).htmlSlides.length} slides</span>
                    {simpleResult && <Badge variant="secondary">Simple Mode</Badge>}
                    {result && <Badge variant="secondary">Full Mode</Badge>}
                  </div>

                  {/* Manifest Preview */}
                  <div className="p-3 bg-slate-950 rounded border">
                    <h4 className="font-semibold mb-2">Manifest</h4>
                    <pre className="text-xs text-slate-300 overflow-x-auto">
                      {JSON.stringify((result || simpleResult).manifest, null, 2)}
                    </pre>
                  </div>

                  {/* Slide Navigation */}
                  {(result || simpleResult).htmlSlides.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Slide:</span>
                        {(result || simpleResult).htmlSlides.map((_: any, index: number) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={currentSlideIndex === index ? "default" : "outline"}
                            onClick={() => setCurrentSlideIndex(index)}
                            className="w-8 h-8 p-0"
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={viewMode === 'preview' ? "default" : "outline"}
                          onClick={() => setViewMode('preview')}
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant={viewMode === 'html' ? "default" : "outline"}
                          onClick={() => setViewMode('html')}
                        >
                          HTML Code
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!result && !simpleResult && !error && !isGenerating && !isGeneratingSimple && (
                <div className="text-center text-slate-200 py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p>Click "Generate AI HTML Slides" to test the integration</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Slide Preview */}
        {(result || simpleResult) && (result || simpleResult).htmlSlides[currentSlideIndex] && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>
                Slide {currentSlideIndex + 1} - {viewMode === 'preview' ? 'Preview' : 'HTML Code'}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Type: {(result || simpleResult).htmlSlides[currentSlideIndex].metadata.type}
                </Badge>
                <Badge variant="outline">
                  Style: {(result || simpleResult).htmlSlides[currentSlideIndex].metadata.style}
                </Badge>
                <Badge variant="outline">
                  Transition: {(result || simpleResult).htmlSlides[currentSlideIndex].metadata.transition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'preview' ? (
                <div className="bg-slate-950 rounded border h-96 overflow-hidden">
                  <AISlideRenderer
                    slide={(result || simpleResult).htmlSlides[currentSlideIndex]}
                    isFullscreen={false}
                  />
                </div>
              ) : (
                <pre className="bg-slate-950 p-4 rounded border text-sm overflow-x-auto">
                  <code>{(result || simpleResult).htmlSlides[currentSlideIndex].htmlContent}</code>
                </pre>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prdParser } from '@/lib/prd-parser';
import { Sparkles, Loader2 } from 'lucide-react';

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [aiTestResult, setAiTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const testPRD = `---
title: "Test Presentation"
author: "Test Author"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
tone: "professional"
voice: "engaging"
---

# Welcome Slide

This is a test slide.

---

# Features

- Feature 1
- Feature 2
- Feature 3

---

# ASCII Test

\`\`\`
┌─────────┐    ┌─────────┐
│  Input  │───▶│ Output  │
└─────────┘    └─────────┘
\`\`\``;

  const runTest = async () => {
    setError(null);
    try {
      console.log('Testing PRD parsing...');
      const result = await prdParser.parseMarkdown(testPRD);
      console.log('Parsed result:', result);
      setTestResult(result);
    } catch (err) {
      console.error('Parsing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const runAITest = async () => {
    if (!hasApiKey) {
      setError('OpenAI API key not configured');
      return;
    }

    setIsTestingAI(true);
    setError(null);
    try {
      console.log('Testing AI-enhanced PRD parsing...');
      const result = await prdParser.parseMarkdown(testPRD, true);
      console.log('AI-enhanced result:', result);
      setAiTestResult(result);
    } catch (err) {
      console.error('AI enhancement error:', err);
      setError(err instanceof Error ? err.message : 'AI enhancement failed');
    } finally {
      setIsTestingAI(false);
    }
  };

  useEffect(() => {
    setHasApiKey(!!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    runTest();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Debug PRD Parser</h1>
          <div className="flex items-center gap-2">
            <Badge variant={hasApiKey ? "default" : "secondary"}>
              API Key: {hasApiKey ? "Configured" : "Not Set"}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={runTest}>
            Test Basic Parsing
          </Button>
          
          <Button 
            onClick={runAITest}
            disabled={!hasApiKey || isTestingAI}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isTestingAI ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Test AI Enhancement
              </>
            )}
          </Button>
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardHeader>
              <CardTitle className="text-red-200">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {testResult && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-200">Basic Parsing Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Metadata:</h3>
                  <pre className="text-sm bg-slate-800 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(testResult.meta, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold">Slides ({testResult.slides?.length || 0}):</h3>
                  {testResult.slides?.map((slide: any, index: number) => (
                    <div key={index} className="bg-slate-800 p-2 rounded mt-1">
                      <h4 className="font-medium">Slide {index + 1}: {slide.title}</h4>
                      <p className="text-sm text-slate-200">
                        {slide.content?.length || 0} content blocks
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {aiTestResult && (
          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader>
              <CardTitle className="text-purple-200">AI-Enhanced Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Enhanced Slides ({aiTestResult.slides?.length || 0}):</h3>
                  {aiTestResult.slides?.map((slide: any, index: number) => (
                    <div key={index} className="bg-slate-800 p-3 rounded mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">Slide {index + 1}: {slide.title}</h4>
                        {slide.slideType && (
                          <Badge variant="outline" className="text-xs">
                            {slide.slideType}
                          </Badge>
                        )}
                        {slide.slideStyle && (
                          <Badge variant="secondary" className="text-xs">
                            {slide.slideStyle}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-200">
                        {slide.content?.length || 0} enhanced content blocks
                      </p>
                      {slide.notes && (
                        <p className="text-xs text-purple-300 mt-1 italic">
                          AI Notes: {slide.notes.split('AI Enhancement: ')[1] || slide.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Test PRD Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-slate-800 p-4 rounded overflow-auto whitespace-pre-wrap">
              {testPRD}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

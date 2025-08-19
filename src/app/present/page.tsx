'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClientPresentationViewer } from '@/components/presentation/ClientPresentationViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { prdParser } from '@/lib/prd-parser';
import { Presentation } from '@/types/presentation';
import { AIEnhancedPresentation } from '@/lib/ai-slide-generator-v2';
import { presentationStorage } from '@/lib/presentation-storage';
import { processURLParameter } from '@/lib/url-utils';
import Link from 'next/link';

function PresentContent() {
  const searchParams = useSearchParams();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [aiEnhancedPresentation, setAiEnhancedPresentation] = useState<AIEnhancedPresentation | null>(null);
  const [useAISlides, setUseAISlides] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPresentation = async () => {
      try {
        const presentationId = searchParams.get('id');
        const prdContent = searchParams.get('prd'); // Legacy support
        const exampleId = searchParams.get('example');
        
        let content = '';
        let parsed: Presentation | null = null;
        
        // Priority: ID > PRD content > Example
        if (presentationId) {
          // Load from storage by ID
          const stored = await presentationStorage.getPresentation(presentationId);
          if (stored) {
            setPresentation(stored.presentation);
            setAiEnhancedPresentation(stored.aiEnhancedPresentation || null);
            setUseAISlides(stored.useAISlides || false);
            return;
          } else {
            setError('Presentation not found. It may have been deleted or the link is invalid.');
            return;
          }
        } else if (prdContent) {
          // Legacy URL support with safe decoding
          const decoded = processURLParameter(prdContent);
          if (decoded) {
            content = decoded;
          } else {
            setError('Invalid or corrupted presentation URL');
            return;
          }
        } else if (exampleId) {
          // Load from examples
          const examples = {
            'puxa-demo': await fetch('/examples/puxa-preso-demo.md').then(r => r.text()).catch(() => ''),
            'ai-product': `---
title: "AI Product Presentation"
subtitle: "Revolutionizing User Experience"
author: "Product Team"
primary_color: "#10B981"
---

# AI Product Overview
Revolutionary features powered by machine learning.

---

# Key Features
- Smart automation
- Predictive analytics  
- Natural language processing`,
          };
          content = examples[exampleId as keyof typeof examples] || '';
        }
        
        if (!content) {
          setError('No presentation content found');
          return;
        }

        parsed = await prdParser.parseMarkdown(content);
        setPresentation(parsed);
      } catch (err) {
        setError('Failed to load presentation');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPresentation();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 p-8">
        <Card className="bg-slate-900 border-slate-700 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Presentation Error
            </h2>
            <p className="text-slate-200 mb-6">
              {error || 'Unable to load presentation'}
            </p>
            <Button asChild>
              <Link href="/editor" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ClientPresentationViewer 
        presentation={presentation} 
        aiEnhancedPresentation={aiEnhancedPresentation}
        useAISlides={useAISlides}
      />
    </div>
  );
}

export default function PresentPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PresentContent />
    </Suspense>
  );
}

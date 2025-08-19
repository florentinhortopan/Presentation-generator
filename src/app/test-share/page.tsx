'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { presentationStorage } from '@/lib/presentation-storage';
import { prdParser } from '@/lib/prd-parser';
import { Copy, CheckCircle, ExternalLink } from 'lucide-react';

export default function TestSharePage() {
  const [testUrl, setTestUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTestPresentation = async () => {
    setIsGenerating(true);
    try {
      const testPRD = `---
title: "Test Presentation - Short URL Demo"
author: "PUXA Preso"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
tone: "professional"
voice: "engaging"
---

# Welcome to Short URLs! 🎉

## Problem Solved

No more ridiculously long URLs that break in chat apps!

---

# Before vs After

## Before (Long URLs)
- URLs were 2000+ characters
- Broke in Slack, Discord, email
- Impossible to share manually
- URL encoding issues

## After (Short URLs)  
- Clean 8-character IDs
- Work everywhere
- Easy to share
- Persistent storage

---

# How It Works

## Simple & Elegant

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Create Content  │───▶│  Generate ID    │───▶│   Share Link    │
│   (Editor)      │    │  (8 chars)      │    │  /present?id=   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

---

# Features

- ✅ **Short URLs**: Only 8 characters
- ✅ **Persistent Storage**: Saved locally  
- ✅ **Management UI**: View all presentations
- ✅ **Legacy Support**: Old URLs still work
- ✅ **Instant Sharing**: Copy to clipboard

---

# Success! 🚀

Your presentations now have beautiful, shareable URLs that work everywhere.

**Try it out:** Create a presentation in the editor and click "Share"!`;

      // Parse the PRD
      const presentation = await prdParser.parseMarkdown(testPRD);
      
      // Save and get short URL
      const presentationId = await presentationStorage.savePresentation(testPRD, presentation);
      const url = `${window.location.origin}/present?id=${presentationId}`;
      
      setTestUrl(url);
    } catch (error) {
      console.error('Failed to generate test presentation:', error);
      alert('Failed to generate test presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUrl = async () => {
    if (!testUrl) return;
    
    try {
      await navigator.clipboard.writeText(testUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Short URL Demo</h1>
          <p className="text-slate-200">
            Test the new sharing system with short, clean URLs
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Generate Test Presentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-200">
              Click the button below to create a test presentation and see the new short URL format in action.
            </p>
            
            <Button 
              onClick={generateTestPresentation}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Test Presentation'}
            </Button>

            {testUrl && (
              <div className="space-y-4 p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-green-400">✅ Success!</h3>
                  <Badge variant="secondary">Short URL Generated</Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-200">Your shareable URL:</p>
                  <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border">
                    <code className="flex-1 text-sm text-blue-300">{testUrl}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyUrl}
                      className="text-slate-200 hover:text-white"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <a href={testUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Presentation
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/presentations">
                      View All Presentations
                    </a>
                  </Button>
                </div>

                <div className="text-xs text-slate-300 p-2 bg-slate-900 rounded">
                  <strong>URL Analysis:</strong><br/>
                  • Length: {testUrl.length} characters<br/>
                  • ID: {testUrl.split('id=')[1]}<br/>
                  • Compare to old URLs: 2000+ characters → {testUrl.length} characters!
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-red-900/10 border-red-800">
            <CardHeader>
              <CardTitle className="text-red-200">❌ Before (Long URLs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• URLs were 2000+ characters long</p>
                <p>• Broke in chat applications</p>
                <p>• URL encoding issues</p>
                <p>• Impossible to share manually</p>
                <div className="p-2 bg-red-950/50 rounded mt-3">
                  <code className="text-xs text-red-300 break-all">
                    /present?prd=---%0Atitle%3A%20%22My%20Presentation%22%0A...
                    <span className="text-red-400">[+2000 more characters]</span>
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/10 border-green-800">
            <CardHeader>
              <CardTitle className="text-green-200">✅ After (Short URLs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Clean 8-character IDs</p>
                <p>• Work in all applications</p>
                <p>• Easy to share manually</p>
                <p>• Persistent storage</p>
                <div className="p-2 bg-green-950/50 rounded mt-3">
                  <code className="text-xs text-green-300">
                    /present?id=aBc123Xy
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

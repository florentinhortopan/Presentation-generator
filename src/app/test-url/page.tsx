'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { safeDecodeURIComponent, safeEncodeURIComponent, processURLParameter } from '@/lib/url-utils';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';

export default function TestURLPage() {
  const [testInput, setTestInput] = useState('---\ntitle: "Test Presentation"\nauthor: "Test"\n---\n\n# Hello World\n\nThis is a test slide.');
  const [encodedResult, setEncodedResult] = useState('');
  const [decodedResult, setDecodedResult] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [error, setError] = useState('');

  const runEncodingTest = () => {
    setError('');
    try {
      // Test encoding
      const encoded = safeEncodeURIComponent(testInput);
      setEncodedResult(encoded);
      
      // Create test URL
      const url = `${window.location.origin}/editor?content=${encoded}`;
      setTestUrl(url);
      
      // Test decoding
      const decoded = processURLParameter(encoded);
      setDecodedResult(decoded || 'DECODING FAILED');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testMalformedURL = () => {
    setError('');
    try {
      // Test with intentionally malformed URL
      const malformed = 'title%3A%20%22Test%GG%20Invalid%';
      console.log('Testing malformed URL:', malformed);
      
      const result = processURLParameter(malformed);
      setDecodedResult(result || 'Safely handled malformed URL');
      setEncodedResult(malformed);
      
    } catch (err) {
      setError(`Caught error (expected): ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const copyUrl = async () => {
    if (!testUrl) return;
    try {
      await navigator.clipboard.writeText(testUrl);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">URL Parameter Testing</h1>
          <p className="text-slate-200">
            Test the safe URL encoding/decoding functionality
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Input Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="min-h-[120px] bg-slate-950 border-slate-700"
              placeholder="Enter PRD content to test..."
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={runEncodingTest}>
                Test Safe Encoding/Decoding
              </Button>
              <Button 
                onClick={testMalformedURL}
                variant="outline"
                className="border-orange-600 text-orange-400"
              >
                Test Malformed URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </CardContent>
          </Card>
        )}

        {encodedResult && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Encoding Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">Encoded URL Parameter</Badge>
                  <div className="p-3 bg-slate-950 rounded border font-mono text-sm break-all">
                    {encodedResult}
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    Length: {encodedResult.length} characters
                  </p>
                </div>

                {testUrl && (
                  <div>
                    <Badge variant="secondary" className="mb-2">Complete URL</Badge>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-slate-950 rounded border font-mono text-sm break-all">
                        {testUrl}
                      </div>
                      <Button size="sm" variant="ghost" onClick={copyUrl}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      Total URL length: {testUrl.length} characters
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {decodedResult && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Decoding Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mb-2">Decoded Content</Badge>
              <div className="p-3 bg-slate-950 rounded border">
                <pre className="text-sm whitespace-pre-wrap">{decodedResult}</pre>
              </div>
              <div className="mt-2 text-xs text-slate-200">
                Success: {decodedResult === testInput ? '✅ Perfect match' : decodedResult.includes('FAILED') ? '❌ Failed to decode' : '⚠️ Partial recovery'}
              </div>
            </CardContent>
          </Card>
        )}

        {testUrl && (
          <Card className="bg-blue-900/20 border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Test the URL in a new tab:</span>
                <Button asChild variant="outline" size="sm">
                  <a href={testUrl} target="_blank" rel="noopener noreferrer">
                    Open in Editor
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Error Handling Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Safe decodeURIComponent with fallback handling
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Manual hex decoding for malformed URLs
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Base64 encoding fallback for problematic content
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                PRD content validation
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Graceful error recovery without crashes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

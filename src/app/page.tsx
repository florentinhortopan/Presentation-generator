'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Play, Github } from 'lucide-react';
import { SimpleNavigation } from '@/components/layout/SimpleNavigation';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <SimpleNavigation />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              PUXA Preso
            </h1>
            <p className="text-xl text-slate-200">
              AI-Driven Presentation Generator from Markdown PRDs
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild className="h-20 bg-blue-600 hover:bg-blue-700">
                  <Link href="/editor" className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8" />
                    <div>
                      <div className="font-semibold">Create Presentation</div>
                      <div className="text-sm opacity-80">Start with the editor</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-20 border-slate-600 hover:bg-slate-800">
                  <Link href="/examples" className="flex flex-col items-center gap-2">
                    <Play className="w-8 h-8" />
                    <div>
                      <div className="font-semibold">View Examples</div>
                      <div className="text-sm opacity-80">Explore themes</div>
                    </div>
                  </Link>
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-400">Dynamic Theming</h4>
                  <p className="text-sm text-slate-200">
                    Automatically adapts colors, fonts, and styling based on your PRD metadata
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-400">ASCII Diagrams</h4>
                  <p className="text-sm text-slate-200">
                    Beautiful rendering of technical diagrams with syntax highlighting
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-400">Figma Integration</h4>
                  <p className="text-sm text-slate-200">
                    Embed Figma designs and prototypes directly in your slides
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-400">Fullscreen Mode</h4>
                  <p className="text-sm text-slate-200">
                    Optimized for Mac displays with smooth transitions and dark theme
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-slate-200">
            <p className="flex items-center justify-center gap-2">
              <Github className="w-4 h-4" />
              Built with Next.js, TypeScript, and Shadcn/UI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
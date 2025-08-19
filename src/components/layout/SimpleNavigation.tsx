'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileEdit, 
  Presentation, 
  Github, 
  BookOpen,
  FolderOpen,
  Sparkles
} from 'lucide-react';

export function SimpleNavigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
          <Presentation className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">PUXA Preso</h1>
          <p className="text-xs text-slate-200">AI-Driven Presentations</p>
        </div>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center gap-1">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-100 hover:text-white">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
        <Link href="/editor">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-100 hover:text-white">
            <FileEdit className="w-4 h-4" />
            Editor
          </Button>
        </Link>
        <Link href="/presentations">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-100 hover:text-white">
            <FolderOpen className="w-4 h-4" />
            My Presentations
          </Button>
        </Link>
        <Link href="/examples">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-100 hover:text-white">
            <BookOpen className="w-4 h-4" />
            Examples
          </Button>
        </Link>
        <Link href="/ai-test">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-100 hover:text-white">
            <Sparkles className="w-4 h-4" />
            AI Test
          </Button>
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs border-slate-600 text-slate-200">
          v1.0
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-200 hover:text-white"
        >
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </Button>
      </div>
    </nav>
  );
}

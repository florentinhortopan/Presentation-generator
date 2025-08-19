'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileEdit, 
  Presentation, 
  Github, 
  BookOpen 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      description: 'Launch presentations'
    },
    {
      href: '/editor',
      label: 'Editor',
      icon: FileEdit,
      description: 'Create & edit PRDs'
    },
    {
      href: '/examples',
      label: 'Examples',
      icon: BookOpen,
      description: 'Sample presentations'
    }
  ];

  return (
    <nav className={cn("flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800", className)}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
          <Presentation className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">AI Presentation</h1>
          <p className="text-xs text-slate-200">Engine</p>
        </div>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "flex items-center gap-2 text-slate-100 hover:text-white transition-colors",
                  isActive && "bg-slate-800 text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
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

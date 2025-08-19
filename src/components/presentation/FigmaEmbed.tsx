'use client';

import React, { useState } from 'react';
import { PresentationTheme } from '@/types/presentation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Image as ImageIcon, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FigmaEmbedProps {
  url: string;
  title: string;
  theme: PresentationTheme;
  className?: string;
}

export function FigmaEmbed({ url, title, theme, className }: FigmaEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extract Figma file ID and node ID from URL
  const getFigmaEmbedUrl = (url: string): string => {
    try {
      // Convert Figma share URL to embed URL
      const urlObj = new URL(url);
      
      if (urlObj.hostname.includes('figma.com')) {
        // For Figma files: https://www.figma.com/file/[file-id]/[title]?node-id=[node-id]
        const pathParts = urlObj.pathname.split('/');
        const fileId = pathParts[2];
        const nodeId = urlObj.searchParams.get('node-id') || '';
        
        if (fileId) {
          let embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
          return embedUrl;
        }
      }
      
      return url;
    } catch (error) {
      console.error('Error processing Figma URL:', error);
      return url;
    }
  };

  const embedUrl = getFigmaEmbedUrl(url);
  const isValidFigmaUrl = url.includes('figma.com');

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const openInFigma = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isValidFigmaUrl) {
    return (
      <Card className={cn("bg-white/5 border-none", className)}>
        <CardContent className="p-6 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm opacity-70">Invalid Figma URL</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-white/5 border-none overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                <ImageIcon className="w-3 h-3 mr-1" />
                Figma
              </Badge>
              <h4 className="font-medium text-sm">{title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openInFigma}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </Button>
            </div>
          </div>
        </div>

        {/* Embed Container */}
        <div className="relative aspect-video bg-white/5">
          {!hasError ? (
            <>
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div 
                      className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-2"
                      style={{ borderColor: theme.accentColor }}
                    />
                    <p className="text-sm opacity-70">Loading Figma design...</p>
                  </div>
                </div>
              )}
              <iframe
                src={embedUrl}
                className={cn(
                  "w-full h-full border-0 transition-opacity duration-300",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={handleLoad}
                onError={handleError}
                allowFullScreen
                title={title}
                style={{
                  backgroundColor: 'transparent',
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <h4 className="font-medium mb-2">Unable to load Figma embed</h4>
              <p className="text-sm opacity-70 mb-4">
                This design might be private or the URL format is not supported for embedding.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={openInFigma}
                className="border-white/20 hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View in Figma
              </Button>
            </div>
          )}
        </div>

        {/* Footer with additional actions */}
        <div className="p-3 bg-black/20 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-70">
              Interactive Figma prototype
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={openInFigma}
              className="text-xs h-6 px-2"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

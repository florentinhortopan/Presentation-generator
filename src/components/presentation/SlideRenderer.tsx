'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Slide, PresentationTheme, SlideContent } from '@/types/presentation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AsciiDiagramRenderer } from './AsciiDiagramRenderer';
import { FigmaEmbed } from './FigmaEmbed';

interface SlideRendererProps {
  slide: Slide;
  theme: PresentationTheme;
  isFullscreen?: boolean;
}

export function SlideRenderer({ slide, theme, isFullscreen = false }: SlideRendererProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderContent = (content: SlideContent, index: number) => {
    switch (content.type) {
      case 'title':
        return (
          <motion.div
            key={`title-${index}`}
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <h1 
              className="font-bold leading-tight"
              style={{ 
                fontSize: theme.fontSize.title,
                color: theme.accentColor,
              }}
            >
              {content.title}
            </h1>
            {content.subtitle && (
              <h2 
                className="font-medium opacity-80"
                style={{ fontSize: theme.fontSize.subtitle }}
              >
                {content.subtitle}
              </h2>
            )}
          </motion.div>
        );

      case 'content':
        return (
          <motion.div
            key={`content-${index}`}
            variants={itemVariants}
            className="prose prose-invert max-w-none"
          >
            <div 
              className="leading-relaxed"
              style={{ fontSize: theme.fontSize.body }}
              dangerouslySetInnerHTML={{ __html: formatContent(content.content || '') }}
            />
          </motion.div>
        );

      case 'list':
        return (
          <motion.div
            key={`list-${index}`}
            variants={itemVariants}
            className="space-y-3"
          >
            {content.title && (
              <h3 
                className="font-semibold mb-4"
                style={{ 
                  fontSize: theme.fontSize.subtitle,
                  color: theme.accentColor,
                }}
              >
                {content.title}
              </h3>
            )}
            <ul className="space-y-2">
              {content.items?.map((item, idx) => (
                <motion.li
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span 
                    className="flex-1"
                    style={{ fontSize: theme.fontSize.body }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );

      case 'quote':
        return (
          <motion.div
            key={`quote-${index}`}
            variants={itemVariants}
            className="relative"
          >
            <Card className="bg-white/5 border-none">
              <CardContent className="p-8">
                <blockquote 
                  className="text-xl italic leading-relaxed relative"
                  style={{ color: theme.textColor }}
                >
                  <div 
                    className="absolute -top-2 -left-2 text-6xl opacity-20"
                    style={{ color: theme.accentColor }}
                  >
                    "
                  </div>
                  {content.content}
                </blockquote>
                {content.source && (
                  <cite 
                    className="block mt-4 text-right opacity-70"
                    style={{ fontSize: theme.fontSize.caption }}
                  >
                    — {content.source}
                  </cite>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'diagram':
        return (
          <motion.div
            key={`diagram-${index}`}
            variants={itemVariants}
            className="flex flex-col items-center space-y-4"
          >
            {content.title && (
              <h3 
                className="font-semibold"
                style={{ 
                  fontSize: theme.fontSize.subtitle,
                  color: theme.accentColor,
                }}
              >
                {content.title}
              </h3>
            )}
            <AsciiDiagramRenderer 
              diagram={content.asciiDiagram || ''} 
              theme={theme}
            />
          </motion.div>
        );

      case 'image':
        return (
          <motion.div
            key={`image-${index}`}
            variants={itemVariants}
            className="flex flex-col items-center space-y-4"
          >
            {content.title && (
              <h3 
                className="font-semibold"
                style={{ 
                  fontSize: theme.fontSize.subtitle,
                  color: theme.accentColor,
                }}
              >
                {content.title}
              </h3>
            )}
            {content.figmaUrl && (
              <FigmaEmbed 
                url={content.figmaUrl} 
                title={content.title || 'Figma Design'}
                theme={theme}
              />
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const formatContent = (content: string): string => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/gm, '<p>$1</p>');
  };

  return (
    <div className={cn(
      "w-full h-full flex flex-col items-center justify-center",
      "px-8 py-12",
      isFullscreen ? "px-16 py-16" : "px-8 py-12"
    )}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "w-full max-w-6xl space-y-8",
          isFullscreen ? "max-w-7xl" : "max-w-6xl"
        )}
      >
        {/* Slide Title */}
        {slide.title && (
          <motion.div variants={itemVariants} className="text-center">
            <h1 
              className="font-bold leading-tight"
              style={{ 
                fontSize: isFullscreen ? '3.5rem' : theme.fontSize.title,
                color: theme.accentColor,
              }}
            >
              {slide.title}
            </h1>
            <Separator 
              className="w-24 mx-auto mt-4" 
              style={{ backgroundColor: theme.accentColor }}
            />
          </motion.div>
        )}

        {/* Slide Content */}
        <div className={cn(
          "space-y-8",
          slide.content.length === 1 ? "text-center" : "text-left"
        )}>
          {slide.content.map((content, index) => renderContent(content, index))}
        </div>

        {/* Slide Notes (only visible in non-fullscreen mode) */}
        {slide.notes && !isFullscreen && (
          <motion.div 
            variants={itemVariants}
            className="mt-8 p-4 bg-white/5 rounded-lg border-l-4"
            style={{ borderLeftColor: theme.accentColor }}
          >
            <Badge variant="secondary" className="mb-2">
              Notes
            </Badge>
            <p 
              className="text-sm opacity-70"
              style={{ fontSize: theme.fontSize.caption }}
            >
              {slide.notes}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

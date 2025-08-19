'use client';

import React from 'react';
import { PresentationTheme } from '@/types/presentation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AsciiDiagramRendererProps {
  diagram: string;
  theme: PresentationTheme;
  className?: string;
}

export function AsciiDiagramRenderer({ diagram, theme, className }: AsciiDiagramRendererProps) {
  // Process the diagram to add styling and interactivity
  const processedDiagram = React.useMemo(() => {
    return diagram
      .split('\n')
      .map((line, index) => {
        // Highlight different types of characters
        const processedLine = line
          .replace(/([┌┐└┘├┤┬┴┼│─╔╗╚╝╠╣╦╩╬║═])/g, '<span class="diagram-box">$1</span>')
          .replace(/([▲▼◄►])/g, '<span class="diagram-arrow">$1</span>')
          .replace(/([□■○●])/g, '<span class="diagram-shape">$1</span>')
          .replace(/([+\-|])/g, '<span class="diagram-simple">$1</span>');
        
        return (
          <div key={index} className="diagram-line">
            <span dangerouslySetInnerHTML={{ __html: processedLine }} />
          </div>
        );
      });
  }, [diagram]);

  return (
    <Card className={cn("bg-white/5 border-none overflow-hidden", className)}>
      <CardContent className="p-6">
        <div 
          className="font-mono text-sm leading-tight whitespace-pre overflow-x-auto"
          style={{
            color: theme.textColor,
            fontSize: '0.875rem',
            lineHeight: '1.2',
          }}
        >
          <style jsx>{`
            .diagram-box {
              color: ${theme.accentColor};
              font-weight: bold;
            }
            .diagram-arrow {
              color: ${theme.primaryColor};
              font-weight: bold;
            }
            .diagram-shape {
              color: ${theme.secondaryColor};
            }
            .diagram-simple {
              color: ${theme.textColor};
              opacity: 0.8;
            }
            .diagram-line {
              min-height: 1.2em;
            }
            .diagram-line:hover {
              background-color: rgba(255, 255, 255, 0.02);
              border-radius: 2px;
            }
          `}</style>
          {processedDiagram}
        </div>
      </CardContent>
    </Card>
  );
}

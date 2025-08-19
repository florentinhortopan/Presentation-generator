'use client';

import dynamic from 'next/dynamic';
import { Presentation } from '@/types/presentation';
import { AIEnhancedPresentation } from '@/lib/ai-slide-generator-v2';

const PresentationViewer = dynamic(
  () => import('./PresentationViewer').then(mod => ({ default: mod.PresentationViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading presentation...</p>
        </div>
      </div>
    )
  }
);

interface ClientPresentationViewerProps {
  presentation: Presentation;
  aiEnhancedPresentation?: AIEnhancedPresentation | null;
  useAISlides?: boolean;
  className?: string;
}

export function ClientPresentationViewer({ presentation, aiEnhancedPresentation, useAISlides = false, className }: ClientPresentationViewerProps) {
  return (
    <PresentationViewer 
      presentation={presentation} 
      aiEnhancedPresentation={aiEnhancedPresentation}
      useAISlides={useAISlides}
      className={className} 
    />
  );
}

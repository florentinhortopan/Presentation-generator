'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Presentation } from '@/types/presentation';
import { SlideRenderer } from './SlideRenderer';
import { AISlideRenderer } from './AISlideRenderer';
import { AIEnhancedPresentation } from '@/lib/ai-slide-generator-v2';
import { cn } from '@/lib/utils';

interface PresentationViewerProps {
  presentation: Presentation;
  aiEnhancedPresentation?: AIEnhancedPresentation | null;
  useAISlides?: boolean;
  className?: string;
}

export function PresentationViewer({ presentation, aiEnhancedPresentation, useAISlides = false, className }: PresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const { slides, meta } = presentation;
  
  // Determine which slides to use and their count
  const activeSlides = useAISlides && aiEnhancedPresentation ? aiEnhancedPresentation.htmlSlides : slides;
  const slideCount = activeSlides.length;
  const currentSlide = useAISlides && aiEnhancedPresentation ? aiEnhancedPresentation.htmlSlides[currentSlideIndex] : slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / slideCount) * 100;

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slideCount - 1));
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(Math.max(0, Math.min(index, slideCount - 1)));
  }, [slideCount]);

  // Reset slide index when switching between AI and markdown slides
  useEffect(() => {
    setCurrentSlideIndex(0);
    // UNCOMMENT LINES BELOW TO ENABLE DEBUGGING
    // console.log('🔄 Switched slide mode:', useAISlides ? 'AI Slides' : 'Markdown Slides');
    // console.log('📊 Active slide count:', slideCount);
  }, [useAISlides]);

  // Keyboard navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(slideCount - 1);
          break;
        case 'f':
        case 'F11':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            event.preventDefault();
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, isFullscreen]);

  // Mouse movement detection for auto-hiding controls
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      
      const timeout = setTimeout(() => {
        if (isFullscreen) setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [isFullscreen, controlsTimeout]);

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const exitFullscreen = async () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Apply theme CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const theme = meta.theme;
      
      root.style.setProperty('--pres-primary', theme.primaryColor);
      root.style.setProperty('--pres-secondary', theme.secondaryColor);
      root.style.setProperty('--pres-background', theme.backgroundColor);
      root.style.setProperty('--pres-text', theme.textColor);
      root.style.setProperty('--pres-accent', theme.accentColor);
      root.style.setProperty('--pres-font-family', theme.fontFamily);
    }
  }, [meta.theme]);

  // Slide transition variants
  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 0,
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      x: -1000,
      opacity: 0,
    }
  };

  const slideTransition = {
    type: "tween",
    ease: "anticipate",
    duration: meta.theme.animation.duration,
  };

  return (
    <div 
      className={cn(
        "relative w-full h-screen overflow-hidden",
        "bg-slate-950 text-slate-50",
        isFullscreen && "cursor-none",
        className
      )}
      style={{
        backgroundColor: meta.theme.backgroundColor,
        color: meta.theme.textColor,
        fontFamily: meta.theme.fontFamily,
      }}
    >
      {/* Main slide content */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            className="absolute inset-0 flex items-center justify-center"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            {useAISlides && aiEnhancedPresentation && currentSlide ? (
              <AISlideRenderer 
                slide={currentSlide as any}
                theme={meta.theme}
                isFullscreen={isFullscreen}
              />
            ) : (
              <SlideRenderer 
                slide={currentSlide as any}
                theme={meta.theme}
                isFullscreen={isFullscreen}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-xs">
                    {currentSlideIndex + 1} / {slideCount}
                  </Badge>
                  <h1 className="text-lg font-medium truncate max-w-md">
                    {meta.title}
                  </h1>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={isFullscreen ? exitFullscreen : toggleFullscreen}
                  className="text-white hover:bg-white/10"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </div>
              <Progress 
                value={progress} 
                className="mt-2 h-1 bg-white/20"
                style={{ 
                  backgroundColor: `${meta.theme.accentColor}20`,
                }}
              />
            </div>

            {/* Navigation arrows */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
              <Button
                variant="ghost"
                size="lg"
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className="text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
              <Button
                variant="ghost"
                size="lg"
                onClick={nextSlide}
                disabled={currentSlideIndex === slideCount - 1}
                className="text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToSlide(0)}
                  className="text-white hover:bg-white/10"
                >
                  <Home className="w-4 h-4" />
                </Button>
                {activeSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentSlideIndex 
                        ? "bg-white" 
                        : "bg-white/40 hover:bg-white/60"
                    )}
                    style={{
                      backgroundColor: index === currentSlideIndex 
                        ? meta.theme.accentColor 
                        : `${meta.theme.accentColor}40`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PresentationTheme } from '@/types/presentation';
import { AIGeneratedSlide } from '@/lib/ai-slide-generator-v2';
import { cn } from '@/lib/utils';

interface AISlideRendererProps {
  slide: AIGeneratedSlide;
  theme: PresentationTheme;
  isFullscreen?: boolean;
}

export function AISlideRenderer({ slide, theme, isFullscreen = false }: AISlideRendererProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Apply theme CSS variables to the slide container
  const slideStyle = {
    '--pres-primary': theme.primaryColor,
    '--pres-secondary': theme.secondaryColor,
    '--pres-background': theme.backgroundColor,
    '--pres-text': theme.textColor,
    '--pres-accent': theme.accentColor,
    '--pres-font-family': theme.fontFamily,
    '--pres-title-size': isFullscreen ? '3.5rem' : theme.fontSize.title,
    '--pres-subtitle-size': theme.fontSize.subtitle,
    '--pres-body-size': theme.fontSize.body,
    '--pres-caption-size': theme.fontSize.caption,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
  } as React.CSSProperties;

  return (
    <div 
      className={cn(
        "w-full h-full flex flex-col items-center justify-center",
        "px-8 py-12",
        isFullscreen ? "px-16 py-16" : "px-8 py-12"
      )}
      style={slideStyle}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "w-full max-w-6xl",
          isFullscreen ? "max-w-7xl" : "max-w-6xl",
          "ai-slide-content"
        )}
        dangerouslySetInnerHTML={{ __html: slide.htmlContent }}
      />
      
      {/* Add a subtle indicator that this is an AI-generated slide */}
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 right-4 opacity-30"
        >
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span style={{ color: theme.textColor }}>AI Enhanced</span>
          </div>
        </motion.div>
      )}
      
      <style jsx>{`
        .ai-slide-content {
          /* Enhanced AI content styling */
        }
        .ai-slide-content .slide-container {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
        }
        .ai-slide-content h1 {
          color: var(--pres-accent);
          font-size: var(--pres-title-size);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #00E0FF, #FF00AA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ai-slide-content h2 {
          color: var(--pres-accent);
          font-size: var(--pres-subtitle-size);
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #00E0FF, #FF00AA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ai-slide-content h3 {
          color: var(--pres-text);
          font-size: calc(var(--pres-body-size) * 1.2);
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 0.5rem;
        }
        .ai-slide-content p {
          font-size: var(--pres-body-size);
          line-height: 1.6;
          margin-bottom: 1rem;
          color: #e2e8f0;
        }
        .ai-slide-content ul, .ai-slide-content ol {
          font-size: var(--pres-body-size);
          line-height: 1.6;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: #e2e8f0;
        }
        .ai-slide-content li {
          margin-bottom: 0.5rem;
          position: relative;
        }
        .ai-slide-content li::before {
          content: "✦";
          color: var(--pres-accent);
          font-weight: bold;
          position: absolute;
          left: -1.5rem;
        }
        .ai-slide-content strong {
          color: var(--pres-accent);
          font-weight: 600;
        }
        .ai-slide-content em {
          font-style: italic;
          color: #94a3b8;
        }
        .ai-slide-content code {
          background: rgba(0, 224, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: #00E0FF;
          border: 1px solid rgba(0, 224, 255, 0.2);
        }
        .ai-slide-content pre {
          background: rgba(0, 0, 0, 0.4);
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .ai-slide-content blockquote {
          border-left: 4px solid var(--pres-accent);
          padding-left: 1.5rem;
          font-style: italic;
          margin: 1.5rem 0;
          opacity: 0.9;
          background: rgba(255, 255, 255, 0.02);
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
        }
        .ai-slide-content .gradient-text {
          background: linear-gradient(135deg, var(--pres-accent), var(--pres-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ai-slide-content .highlight-box {
          background: rgba(0, 224, 255, 0.05);
          border: 1px solid rgba(0, 224, 255, 0.2);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 1rem 0;
          box-shadow: 0 4px 12px rgba(0, 224, 255, 0.1);
        }
        .ai-slide-content .card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 1rem 0;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }
        .ai-slide-content .card:hover {
          transform: translateY(-2px);
        }
        .ai-slide-content .flex {
          display: flex;
        }
        .ai-slide-content .grid {
          display: grid;
        }
        .ai-slide-content .text-center {
          text-align: center;
        }
        .ai-slide-content .text-left {
          text-align: left;
        }
        .ai-slide-content .text-right {
          text-align: right;
        }
        .ai-slide-content .mb-4 {
          margin-bottom: 1rem;
        }
        .ai-slide-content .mb-8 {
          margin-bottom: 2rem;
        }
        .ai-slide-content .mt-4 {
          margin-top: 1rem;
        }
        .ai-slide-content .mt-8 {
          margin-top: 2rem;
        }
        .ai-slide-content .space-y-4 > * + * {
          margin-top: 1rem;
        }
        .ai-slide-content .space-y-8 > * + * {
          margin-top: 2rem;
        }
        .ai-slide-content .slide {
          animation: slideIn 0.6s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }`}</style>
    </div>
  );
}
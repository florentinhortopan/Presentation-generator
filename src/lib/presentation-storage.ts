import { Presentation } from '@/types/presentation';
import { AIEnhancedPresentation } from './ai-slide-generator-v2';

export interface StoredPresentation {
  id: string;
  title: string;
  author: string;
  content: string; // Original PRD content
  presentation: Presentation;
  aiEnhancedPresentation?: AIEnhancedPresentation | null; // AI-generated slides
  useAISlides?: boolean; // Whether to default to AI slides
  createdAt: string;
  updatedAt: string;
}

export class PresentationStorage {
  private static readonly STORAGE_KEY = 'puxa-presentations';
  private static readonly MAX_PRESENTATIONS = 50; // Limit to prevent localStorage bloat

  // Generate a short, URL-friendly ID
  private generateId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get all stored presentations
  private getStoredPresentations(): Record<string, StoredPresentation> {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(PresentationStorage.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading presentations from storage:', error);
      return {};
    }
  }

  // Save presentations to storage
  private saveStoredPresentations(presentations: Record<string, StoredPresentation>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        PresentationStorage.STORAGE_KEY,
        JSON.stringify(presentations)
      );
    } catch (error) {
      console.error('Error saving presentations to storage:', error);
    }
  }

  // Clean up old presentations if we hit the limit
  private cleanupOldPresentations(presentations: Record<string, StoredPresentation>): Record<string, StoredPresentation> {
    const entries = Object.entries(presentations);
    
    if (entries.length <= PresentationStorage.MAX_PRESENTATIONS) {
      return presentations;
    }

    // Sort by updatedAt and keep only the most recent
    const sorted = entries.sort((a, b) => 
      new Date(b[1].updatedAt).getTime() - new Date(a[1].updatedAt).getTime()
    );

    const cleaned: Record<string, StoredPresentation> = {};
    sorted.slice(0, PresentationStorage.MAX_PRESENTATIONS).forEach(([id, presentation]) => {
      cleaned[id] = presentation;
    });

    return cleaned;
  }

  // Save a presentation and return its ID
  async savePresentation(content: string, presentation: Presentation, aiEnhancedPresentation?: AIEnhancedPresentation | null, useAISlides?: boolean): Promise<string> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const storedPresentation: StoredPresentation = {
      id,
      title: presentation.meta.title,
      author: presentation.meta.author,
      content,
      presentation,
      aiEnhancedPresentation,
      useAISlides: useAISlides || false,
      createdAt: now,
      updatedAt: now,
    };

    let presentations = this.getStoredPresentations();
    presentations[id] = storedPresentation;
    
    // Clean up old presentations if needed
    presentations = this.cleanupOldPresentations(presentations);
    
    this.saveStoredPresentations(presentations);
    
    return id;
  }

  // Update an existing presentation
  async updatePresentation(id: string, content: string, presentation: Presentation, aiEnhancedPresentation?: AIEnhancedPresentation | null, useAISlides?: boolean): Promise<boolean> {
    const presentations = this.getStoredPresentations();
    
    if (!presentations[id]) {
      return false;
    }

    presentations[id] = {
      ...presentations[id],
      title: presentation.meta.title,
      author: presentation.meta.author,
      content,
      presentation,
      aiEnhancedPresentation: aiEnhancedPresentation !== undefined ? aiEnhancedPresentation : presentations[id].aiEnhancedPresentation,
      useAISlides: useAISlides !== undefined ? useAISlides : presentations[id].useAISlides,
      updatedAt: new Date().toISOString(),
    };

    this.saveStoredPresentations(presentations);
    return true;
  }

  // Get a presentation by ID
  async getPresentation(id: string): Promise<StoredPresentation | null> {
    const presentations = this.getStoredPresentations();
    return presentations[id] || null;
  }

  // Get all presentations (for management UI)
  async getAllPresentations(): Promise<StoredPresentation[]> {
    const presentations = this.getStoredPresentations();
    return Object.values(presentations).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Delete a presentation
  async deletePresentation(id: string): Promise<boolean> {
    const presentations = this.getStoredPresentations();
    
    if (!presentations[id]) {
      return false;
    }

    delete presentations[id];
    this.saveStoredPresentations(presentations);
    return true;
  }

  // Check if a presentation exists
  async presentationExists(id: string): Promise<boolean> {
    const presentations = this.getStoredPresentations();
    return !!presentations[id];
  }

  // Get presentation metadata without full content (for listing)
  async getPresentationMetadata(id: string): Promise<{ title: string; author: string; createdAt: string; updatedAt: string } | null> {
    const presentations = this.getStoredPresentations();
    const presentation = presentations[id];
    
    if (!presentation) return null;

    return {
      title: presentation.title,
      author: presentation.author,
      createdAt: presentation.createdAt,
      updatedAt: presentation.updatedAt,
    };
  }

  // Clear all presentations (for debugging)
  async clearAllPresentations(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PresentationStorage.STORAGE_KEY);
  }
}

export const presentationStorage = new PresentationStorage();

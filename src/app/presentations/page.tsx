'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Edit, 
  Trash2, 
  Share2, 
  Copy,
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { presentationStorage, StoredPresentation } from '@/lib/presentation-storage';
import { SimpleNavigation } from '@/components/layout/SimpleNavigation';
import Link from 'next/link';

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<StoredPresentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresentations = async () => {
    try {
      setIsLoading(true);
      const stored = await presentationStorage.getAllPresentations();
      setPresentations(stored);
    } catch (err) {
      setError('Failed to load presentations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this presentation?')) {
      return;
    }

    try {
      await presentationStorage.deletePresentation(id);
      setPresentations(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete presentation');
      console.error(err);
    }
  };

  const handleShare = async (id: string, title: string) => {
    const url = `${window.location.origin}/present?id=${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert(`Presentation "${title}" URL copied to clipboard!`);
    } catch (err) {
      alert('Failed to copy URL to clipboard');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL presentations? This cannot be undone.')) {
      return;
    }

    try {
      await presentationStorage.clearAllPresentations();
      setPresentations([]);
    } catch (err) {
      alert('Failed to clear presentations');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <SimpleNavigation />
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Presentations</h1>
            <p className="text-slate-200">
              Manage and share your saved presentations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-slate-600">
              {presentations.length} saved
            </Badge>
            {presentations.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-200">Loading presentations...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-800 mb-6">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-semibold text-red-200 mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
              <Button 
                onClick={loadPresentations}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && presentations.length === 0 && (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No presentations yet</h3>
              <p className="text-slate-200 mb-6">
                Create your first presentation in the editor and save it to see it here.
              </p>
              <Button asChild>
                <Link href="/editor" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Create Presentation
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Presentations Grid */}
        {!isLoading && !error && presentations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <Card key={presentation.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 truncate">
                        {presentation.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <User className="w-3 h-3" />
                        <span className="truncate">{presentation.author}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {presentation.presentation.slides.length} slides
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="text-xs text-slate-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Created: {formatDate(presentation.createdAt)}</span>
                      </div>
                      {presentation.updatedAt !== presentation.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Updated: {formatDate(presentation.updatedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                        asChild
                      >
                        <a 
                          href={`/present?id=${presentation.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Play className="w-3 h-3" />
                          Present
                        </a>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 hover:bg-slate-800"
                        asChild
                      >
                        <Link 
                          href={`/editor?id=${presentation.id}`}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(presentation.id, presentation.title)}
                        className="hover:bg-slate-800"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(presentation.id)}
                        className="hover:bg-red-600/10 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {presentations.length > 0 && (
          <div className="mt-12 p-6 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/editor" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  New Presentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/examples" className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Browse Examples
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

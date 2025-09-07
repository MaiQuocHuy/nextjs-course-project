'use client';

import mammoth from 'mammoth';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Download, AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// Simple DOCX preview component that uses mammoth.js
export const DocxViewer = ({ file }: { file: File }) => {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Create downloadable URL for the file
    const downloadUrl = URL.createObjectURL(file);
    setFileUrl(downloadUrl);

    const renderDocument = async () => {
      try {
        setIsLoading(true);
        // Get file as array buffer
        const arrayBuffer = await file.arrayBuffer();

        try {
          console.log('Converting with mammoth.js');
          const result = await mammoth.convertToHtml({ arrayBuffer });

          // Only update state if component is still mounted
          if (mounted) {
            setContent(result.value);
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Failed to render with mammoth:', err);
          if (mounted) {
            setError(
              `Failed to render document: ${
                err instanceof Error ? err.message : 'Unknown error'
              }`
            );
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Document processing error:', err);
        if (mounted) {
          setError(
            `Failed to process document: ${
              err instanceof Error ? err.message : 'Unknown error'
            }`
          );
          setIsLoading(false);
        }
      }
    };

    renderDocument();

    // Clean up function
    return () => {
      mounted = false;
      // Revoke the object URL to avoid memory leaks
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Converting document...</p>
        <p className="text-xs text-muted-foreground mt-2">
          This may take a moment for large files
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!content) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to generate document preview</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Notification banner */}
      <div className="bg-amber-50 border-amber-200 border p-3 mb-4 rounded-md flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <p className="text-sm text-amber-700">
          Formatting may be inconsistent from source document
        </p>
        {fileUrl && (
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <a
              href={fileUrl}
              download={file.name}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
          </Button>
        )}
      </div>

      {/* Document content */}
      <div
        className="w-full flex-1 p-6 border rounded bg-white dark:bg-gray-900 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

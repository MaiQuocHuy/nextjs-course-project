import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
  file: File;
};

const TxtViewer = ({ file }: Props) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        setContent(e.target.result as string);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file');
      setIsLoading(false);
    };

    reader.readAsText(file);

    return () => {
      reader.abort();
    };
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading text file...</p>
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

  return (
    <div className="w-full h-full p-4 border rounded bg-white dark:bg-gray-900">
      <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    </div>
  );
};

export default TxtViewer;

'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { DocumentType } from '@/utils/instructor/create-course-validations/lessons-validations';

interface MultiDocumentUploadProps {
  documents: DocumentType[];
  onDocumentsChange: (documents: DocumentType[]) => void;
  label: string;
}

export function MultiDocumentUpload({
  documents,
  onDocumentsChange,
  label,
}: MultiDocumentUploadProps) {
  const [uploadError, setUploadError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError('');

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setUploadError(`File too large. Maximum size: 10MB`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setUploadError('File type not supported');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const newDocuments = acceptedFiles.map((file) => ({
          file,
        }));
        onDocumentsChange([...documents, ...newDocuments]);
      }
    },
    [documents, onDocumentsChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  const removeDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(updatedDocuments);
  };

  // const updateDocumentStatus = (
  //   index: number,
  //   status: 'publish' | 'unpublish'
  // ) => {
  //   const updatedDocuments = documents.map((doc, i) =>
  //     i === index ? { ...doc, status } : doc
  //   );
  //   onDocumentsChange(updatedDocuments);
  // };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf')
      return <FileText className="h-4 w-4 text-red-500" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel'))
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const canPreview = (file: File) => {
    // return (
    //   file.type === 'application/pdf' ||
    //   file.type ===
    //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    //   file.type.includes('spreadsheet') ||
    //   file.type.includes('excel')
    // );
    return file.type === 'application/pdf';
  };

  const renderPreview = (file: File) => {
    if (!canPreview(file)) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent
          style={{
            width: '90vw',
            maxWidth: '90vw',
            maxHeight: '95vh',
            padding: '15px',
          }}
        >
          <DialogHeader>
            <DialogTitle>Document Preview - {file.name}</DialogTitle>
          </DialogHeader>
          {/* Render PDF or DOCX preview */}
          <div className="flex-1 overflow-auto" style={{ height: '85vh' }}>
            <iframe
              src={URL.createObjectURL(file)}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
      >
        <CardContent className="p-6">
          <div {...getRootProps()} className="cursor-pointer text-center">
            <input {...getInputProps()} />
            <div
              className={`transition-transform duration-200 ${
                isDragActive ? 'scale-110' : ''
              }`}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag & drop files or click to select'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, DOCX, Excel files. Maximum size: 10MB each
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Uploaded Documents ({documents.length})
          </Label>
          {documents.map((document, index) => (
            <Card
              key={index}
              className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
            >
              <CardContent className="px-4 py-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getFileIcon(document.file)}
                      <span className="text-sm font-medium">
                        {document.file.name}
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Size: {(document.file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>

                  {/* Preview document */}
                  <div className="flex items-center gap-2">
                    {renderPreview(document.file)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

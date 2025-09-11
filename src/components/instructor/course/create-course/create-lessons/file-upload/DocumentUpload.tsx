'use client';

import { FileText } from 'lucide-react';

import { Label } from '@/components/ui/label';
import FileUploadContainer from './FileUploadContainer';
import { DocxViewer } from '../preview/DocxViewer';
import TxtViewer from '../preview/TxtViewer';
import type { DocumentType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import FileInfo from '../preview/FileInfo';

const acceptedDocumentTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const acceptedDocumentExtensions = ['.pdf', '.docx', '.txt'];

interface DocumentUploadProps {
  documents: DocumentType[];
  onDocumentsChange: (documents: DocumentType[]) => void;
  maxSize?: number; // in bytes
  required?: boolean;
  label?: string;
}

const DocumentUpload = ({
  documents,
  onDocumentsChange,
  maxSize = 10 * 1024 * 1024, // Default 10MB
  required = false,
  label = 'Related Documents',
}: DocumentUploadProps) => {
  
  const handleFilesAccepted = (files: File[]) => {
    if (files.length > 0) {
      const newDocuments = files.map((file) => ({ file }));
      onDocumentsChange([...documents, ...newDocuments]);
    }
  };

  const removeDocument = (index: number) => {
    const fileType = documents[index].file.type;
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(updatedDocuments);

    // Revoke object URL of PDF file to free memory
    if (fileType === 'application/pdf') {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        if (iframe.src.startsWith('blob:')) {
          URL.revokeObjectURL(iframe.src);
        }
      });
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (file.type.includes('wordprocessingml.document')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPreviewContent = (file: File) => {
    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={URL.createObjectURL(file)}
          className="w-full h-full border rounded"
          title="PDF Preview"
        />
      );
    } else if (file.type === 'text/plain') {
      return <TxtViewer file={file} />;
    } else if (
      file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return <DocxViewer file={file} />;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <strong className="text-red-500">*</strong>}
      </Label>

      <FileUploadContainer
        onFilesAccepted={handleFilesAccepted}
        allowedFileTypes={[
          ...acceptedDocumentTypes,
          ...acceptedDocumentExtensions,
        ]}
        allowMultiple={true} // Allow multiple document uploads
        maxFileSize={maxSize}
        instructionText="Drag & drop files or click to select multiple files"
        supportText={`Supports PDF, DOCX, TXT. Maximum size: ${(
          maxSize /
          (1024 * 1024)
        ).toFixed(2)}MB each`}
        dragActiveText="Drop the files here..."
      />

      {documents.length > 0 && (
        <div className="space-y-2 mt-4">
          <Label className="text-sm font-medium">
            Uploaded Documents ({documents.length})
          </Label>
          {documents.map((document, index) => (
            <FileInfo
              key={index}
              icon={getFileIcon(document.file)}
              fileName={document.file.name}
              fileSize={document.file.size}
              previewTitle={`${document.file.name}`}
              previewContent={getPreviewContent(document.file)}
              onRemoveFile={() => removeDocument(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

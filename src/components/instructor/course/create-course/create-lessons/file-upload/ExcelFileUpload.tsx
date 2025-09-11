'use client';

import { useState, useCallback } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { Label } from '@/components/ui/label';

import FileUploadContainer from './FileUploadContainer';
import { ExcelViewer } from '../preview/ExcelViewer';
import { validateExcelQuizFormat } from '@/utils/instructor/course/excel/excel-validation';
import FileUploadError from './upload-error/FileUploadError';
import { ExcelFileType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import FileInfo from '../preview/FileInfo';

const excelFileTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const acceptedExcelFileExtensions = ['.xlsx', '.xls'];

interface ExcelFileUploadProps {
  excelFile?: ExcelFileType;
  onExcelFileChange: (excelFile: ExcelFileType | undefined) => void;
  maxSize?: number; // in bytes
  required?: boolean;
  label?: string;
}

const ExcelFileUpload = ({
  excelFile,
  onExcelFileChange,
  maxSize = 10 * 1024 * 1024, // Default 10MB
  required = false,
  label = 'Excel File',
}: ExcelFileUploadProps) => {
  const [uploadExcelFileError, setUploadExcelFileError] = useState<string[]>(
    []
  );

  const validateExcelContent = useCallback(async (file: File) => {
    try {
      setUploadExcelFileError([]);

      const validationResult = await validateExcelQuizFormat(file);

      if (!validationResult.isValid) {
        setUploadExcelFileError(validationResult.errors);
        return false;
      }

      return true;
    } catch (error) {
      setUploadExcelFileError([
        'Failed to validate Excel file: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      ]);
      return false;
    }
  }, []);

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // Validate Excel content
      const isValidContent = await validateExcelContent(file);
      if (isValidContent) {
        onExcelFileChange({ file });
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <strong className="text-red-500">*</strong>}
      </Label>

      {!excelFile ? (
        <FileUploadContainer
          onFilesAccepted={handleFilesAccepted}
          allowedFileTypes={[...excelFileTypes, ...acceptedExcelFileExtensions]}
          allowMultiple={false}
          maxFileSize={maxSize}
          instructionText="Drag & drop Excel file or click to select"
          supportText={`Supports .xlsx and .xls files. Maximum size: ${(
            maxSize /
            (1024 * 1024)
          ).toFixed(2)}MB`}
          dragActiveText="Drop the Excel file here..."
          icon={
            <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          }
        />
      ) : (
        <FileInfo
          icon={<FileSpreadsheet className="h-4 w-4 text-green-500" />}
          fileName={excelFile.file.name}
          fileSize={excelFile.file.size}
          previewTitle={`${excelFile.file.name}`}
          previewContent={<ExcelViewer file={excelFile.file} />}
          onRemoveFile={() => onExcelFileChange(undefined)}
        />
      )}

      {uploadExcelFileError.length > 0 && (
        <FileUploadError
          errors={uploadExcelFileError}
          title="Invalid Excel format:"
          dialogTitle="Excel Validation Errors"
        />
      )}
    </div>
  );
};

export default ExcelFileUpload;

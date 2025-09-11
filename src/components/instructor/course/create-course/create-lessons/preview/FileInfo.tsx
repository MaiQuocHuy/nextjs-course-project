import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';

import PreviewContent from './PreviewContent';
import { Button } from '@/components/ui/button';

type Props = {
  icon: React.ReactNode;
  fileName: string;
  fileSize: number;
  previewTitle: string;
  previewContent: React.ReactNode;
  onRemoveFile: () => void;
};

const FileInfo = (props: Props) => {
  const {
    icon,
    fileName,
    fileSize,
    previewTitle,
    previewContent,
    onRemoveFile,
  } = props;
  return (
    <Card
      className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
    >
      <CardContent className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-sm font-medium">{fileName}</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-xs text-muted-foreground">
              Size: {`${(fileSize / (1024 * 1024)).toFixed(2)} MB`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PreviewContent
              dialogTitle={previewTitle}
              previewContent={previewContent}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileInfo;

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Props = {
  error?: string;
  children?: React.ReactNode;
};

const FileUploadErrorContainer = ({ error, children }: Props) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{children || error}</AlertDescription>
    </Alert>
  );
};

export default FileUploadErrorContainer;

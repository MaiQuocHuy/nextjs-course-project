import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import React from 'react';

type Props = {
  dialogTitle: string;
  previewContent: React.ReactNode;
};

const PreviewContent = ({ dialogTitle, previewContent }: Props) => {
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
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto" style={{ height: '85vh' }}>
          {previewContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewContent;

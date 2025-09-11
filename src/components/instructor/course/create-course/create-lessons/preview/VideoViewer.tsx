import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Play, X } from 'lucide-react';

export const VideoViewer = ({
  videoFile,
  videoPreviewUrl,
  onVideoRemove,
  mode,
}: {
  videoFile: File;
  videoPreviewUrl: string;
  onVideoRemove: () => void;
  mode?: 'edit' | 'view';
}) => {
  return (
    <>
      {videoPreviewUrl ? (
        <Card
          className={` ${
            mode === 'edit' &&
            'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
          }`}
        >
          <CardContent className="px-3">
            <div className="space-y-3">
              {/* Video Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Play className="h-4 w-4" />
                  <span className="font-medium">
                    {videoFile.name !== 'null'
                      ? videoFile.name
                      : 'Lesson video'}
                  </span>
                  <span className="text-muted-foreground">
                    Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  {mode && mode === 'edit' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                {mode && mode === 'edit' && (
                  // Video Remove Button
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onVideoRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Video Preview */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#000',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <video
                  src={videoPreviewUrl}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: '#000',
                    borderRadius: '12px',
                  }}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Upload Video Failed!</p>
        </div>
      )}
    </>
  );
};

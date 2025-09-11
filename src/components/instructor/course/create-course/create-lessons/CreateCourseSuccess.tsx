import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const CreateCourseSuccess = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Course Created Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your course has been submitted to admin for approval. You will
            receive a notification when the course is approved.
          </p>
          <Button
            onClick={() => (window.location.href = '/instructor/courses')}
          >
            Back to Course List
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourseSuccess;

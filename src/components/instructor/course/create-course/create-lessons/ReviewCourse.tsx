import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import { AlertCircle, Brain, Loader2, Video } from 'lucide-react';

type Props = {
  courseStatus: 'draft' | 'published';
  sections: SectionType[];
  onBackToEdit: () => void;
  handleFinalSubmit: () => void;
  isCreating: boolean;
};

const ReviewCourse = ({
  courseStatus,
  sections,
  onBackToEdit,
  handleFinalSubmit,
  isCreating = false,
}: Props) => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Review Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-x-2">
            <span
              className={`ml-2 font-semibold px-3 py-1.5 rounded-md ${
                courseStatus === 'published'
                  ? 'text-green-600 bg-green-100'
                  : 'text-amber-600 bg-amber-100'
              }`}
            >
              {courseStatus === 'published' ? 'Published' : 'Draft'}
            </span>

            <span className="text-sm text-muted-foreground">
              {courseStatus === 'published'
                ? 'Your course will be submitted for approval by administrators before becoming visible to students.'
                : "Your course will be saved as a draft and won't be visible to students until published."}
            </span>
          </div>

          <div className="space-y-5">
            {sections.map((section) => (
              <div key={section.id} className="space-y-5">
                <h3 className="text-lg font-semibold">
                  Section {section.orderIndex + 1}: {section.title}
                </h3>

                {section.lessons.map((lesson) => (
                  <Card key={lesson.id} className="ml-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {lesson.type === 'VIDEO' ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <Brain className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Lesson {lesson.orderIndex + 1}: {lesson.title}
                        </span>
                        <Badge
                          variant={
                            lesson.type === 'VIDEO' ? 'default' : 'secondary'
                          }
                        >
                          {lesson.type === 'VIDEO' ? 'VIDEO' : 'QUIZ'}
                        </Badge>
                      </div>

                      {lesson.quiz &&
                        lesson.quiz.questions &&
                        lesson.quiz.questions.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Quiz: {lesson.quiz.questions.length} questions
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-amber-600 text-base">
              Please review all information before submitting. After submitting,
              you must wait for the administrator to approve the course.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBackToEdit} disabled={isCreating}>
              Back to Edit
            </Button>
            <Button onClick={handleFinalSubmit} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  <span>Submitting</span>
                </>
              ) : (
                'Confirm and Submit for Approval'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewCourse;

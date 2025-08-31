import { QuizResultCard } from '@/components/dashboard-student/quiz-results/QuizResultCard';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { QuizResults } from '@/types/student';

interface QuizResultsProps {
  quizResults?: QuizResults[];
}

export const StudentQuizResults = ({ quizResults }: QuizResultsProps) => {
  return (
    <>
      <h3 className="text-xl font-semibold">Quiz Results</h3>

      {quizResults && quizResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizResults.map((quizResult) => (
            <QuizResultCard key={quizResult.id} quizResult={quizResult} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <h4 className="text-lg font-medium">No Quiz Results</h4>
            <p className="text-muted-foreground">
              This student has not completed any quizzes yet.
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

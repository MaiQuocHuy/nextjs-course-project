export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  isCompleted: boolean;
  hasQuiz: boolean;
  duration?: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  sections: CourseSection[];
}

export interface LearningPageProps {
  courseId: string;
  lessonId?: string;
}

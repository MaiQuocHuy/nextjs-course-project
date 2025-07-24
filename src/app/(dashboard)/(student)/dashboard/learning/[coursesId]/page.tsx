import { LearningPage } from "@/components/dashboard-student/learning/LearningPage";

interface PageProps {
  params: {
    courseId: string;
  };
}

export default function CourseLearningPage({ params }: PageProps) {
  return <LearningPage courseId={params.courseId} />;
}

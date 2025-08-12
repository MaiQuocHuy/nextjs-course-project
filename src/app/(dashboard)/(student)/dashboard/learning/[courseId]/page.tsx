import { LearningPageClient } from "@/components/dashboard-student/learning";

interface PageProps {
  params: {
    courseId: string;
  };
}

export default function LearningPage({ params }: PageProps) {
  return <LearningPageClient courseId={params.courseId} />;
}

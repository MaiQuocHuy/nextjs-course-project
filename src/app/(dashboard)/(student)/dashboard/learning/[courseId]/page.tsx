import { LearningPageClient } from "@/components/dashboard-student/learning";

// In Next.js 15 (App Router), route params are now async to enable streaming
// optimization. You must await params before accessing its properties.
export default async function LearningPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <LearningPageClient courseId={courseId} />;
}

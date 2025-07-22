import { CourseCard } from "./CourseCard";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  completedLessons: number;
  totalLessons: number;
}

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <div className="text-muted-foreground text-2xl">📚</div>
        </div>
        <h3 className="text-lg font-medium mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          You haven't enrolled in any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

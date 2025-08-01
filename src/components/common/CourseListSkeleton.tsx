export function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/4"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-6 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

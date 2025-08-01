"use client";

import { useCourses } from "@/hooks/useCourses";

const TestComponent = () => {
  const { courses, loading, error, totalPages, totalElements } = useCourses({
    page: 0,
    size: 5,
  });

  console.log("API_BASE_URL:", process.env.NEXT_PUBLIC_API_BACKEND_URL);
  console.log("Courses data:", {
    courses,
    loading,
    error,
    totalPages,
    totalElements,
  });

  // Debug: Log raw data structure
  console.log("Raw courses array:", courses);
  console.log("First course structure:", courses[0]);

  if (loading) {
    return <div className="p-4 bg-blue-100">Loading courses...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700">
        <h3>Error loading courses:</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100">
      <h3>API Test Results:</h3>
      <p>Total courses: {totalElements}</p>
      <p>Total pages: {totalPages}</p>
      <p>Loaded courses: {courses.length}</p>
      <div className="mt-4">
        <h4>Course titles:</h4>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;

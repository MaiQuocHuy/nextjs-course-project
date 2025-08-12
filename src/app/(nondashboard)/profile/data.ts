import { UserData, Course } from "./types"


// Mock user data
export const userData: UserData = {
  id: "1",
  name: "Sarah Johnson-Williamson",
  email: "sarah.johnson-williamson@example-university.edu",
  role: "Student" as const,
  avatar: "https://media.newyorker.com/photos/665f65409ad64d9e7a494208/4:3/w_1003,h_752,c_limit/Chayka-screenshot-06-05-24.jpg",
  joinedDate: "July 21, 2024",
}


// Mock courses data
export const enrolledCourses: Course[] = [
  {
    id: "course-1",
    title: "Advanced React Development",
    instructor: "John Smith",
    thumbnail: "https://media.newyorker.com/photos/665f65409ad64d9e7a494208/4:3/w_1003,h_752,c_limit/Chayka-screenshot-06-05-24.jpg",
    progress: 75,
  },
  {
    id: "course-2",
    title: "UI/UX Design Fundamentals",
    instructor: "Emily Chen",
    thumbnail: "https://media.newyorker.com/photos/665f65409ad64d9e7a494208/4:3/w_1003,h_752,c_limit/Chayka-screenshot-06-05-24.jpg",
    progress: 45,
  },
  {
    id: "course-3",
    title: "TypeScript Mastery",
    instructor: "Michael Brown",
    thumbnail: "https://media.newyorker.com/photos/665f65409ad64d9e7a494208/4:3/w_1003,h_752,c_limit/Chayka-screenshot-06-05-24.jpg",
    progress: 90,
  },
]
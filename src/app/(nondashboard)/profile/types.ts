export interface UserData {
  id: string
  name: string
  email: string
  role: "Student" | "Instructor"
  avatar: string
  joinedDate: string
}

export interface Course {
  id: string
  title: string
  instructor: string
  thumbnail: string
  progress: number
}

export interface UserInfoCardProps {
  userData: UserData
}

export interface EnrolledCoursesListProps {
  courses: Course[]
}

export interface CourseCardProps {
  course: Course
}



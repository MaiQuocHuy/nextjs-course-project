import { Course, Quiz } from "@/types/learning";

export const mockCourse: Course = {
  id: "course-1",
  title: "Complete React Development Course",
  description: "Master React from basics to advanced concepts",
  totalLessons: 12,
  completedLessons: 5,
  sections: [
    {
      id: "section-1",
      title: "React Fundamentals",
      lessons: [
        {
          id: "lesson-1",
          title: "Introduction to React",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: true,
          hasQuiz: true,
          duration: "15:30",
        },
        {
          id: "lesson-2",
          title: "Components and JSX",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: true,
          hasQuiz: false,
          duration: "12:45",
        },
        {
          id: "lesson-3",
          title: "Props and State",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: true,
          hasQuiz: true,
          duration: "18:20",
        },
        {
          id: "lesson-4",
          title: "Event Handling",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: false,
          duration: "14:15",
        },
      ],
    },
    {
      id: "section-2",
      title: "Advanced React Concepts",
      lessons: [
        {
          id: "lesson-5",
          title: "React Hooks",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: true,
          hasQuiz: true,
          duration: "22:30",
        },
        {
          id: "lesson-6",
          title: "Context API",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: false,
          duration: "16:45",
        },
        {
          id: "lesson-7",
          title: "Custom Hooks",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: true,
          duration: "19:10",
        },
      ],
    },
    {
      id: "section-3",
      title: "React Router & State Management",
      lessons: [
        {
          id: "lesson-8",
          title: "React Router Basics",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: false,
          duration: "20:00",
        },
        {
          id: "lesson-9",
          title: "Redux Fundamentals",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: true,
          duration: "25:30",
        },
        {
          id: "lesson-10",
          title: "Redux Toolkit",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: false,
          duration: "17:45",
        },
        {
          id: "lesson-11",
          title: "Testing React Components",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: true,
          duration: "23:15",
        },
        {
          id: "lesson-12",
          title: "Deployment and Best Practices",
          videoUrl: "https://www.youtube.com/embed/GxmfcnU3feo",
          isCompleted: false,
          hasQuiz: false,
          duration: "21:00",
        },
      ],
    },
  ],
};

export const mockQuizzes: { [lessonId: string]: Quiz } = {
  "lesson-1": {
    id: "quiz-1",
    question: "What is React primarily used for?",
    options: [
      "Building server-side applications",
      "Building user interfaces",
      "Database management",
      "File system operations",
    ],
    correctAnswerIndex: 1,
  },
  "lesson-3": {
    id: "quiz-3",
    question: "What is the difference between props and state in React?",
    options: [
      "Props are mutable, state is immutable",
      "Props are passed from parent, state is internal to component",
      "There is no difference",
      "Props are for styling, state is for data",
    ],
    correctAnswerIndex: 1,
  },
  "lesson-5": {
    id: "quiz-5",
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correctAnswerIndex: 2,
  },
  "lesson-7": {
    id: "quiz-7",
    question: "What is a custom hook in React?",
    options: [
      "A built-in React hook",
      "A function that uses React hooks and can be reused",
      "A CSS styling technique",
      "A testing utility",
    ],
    correctAnswerIndex: 1,
  },
  "lesson-9": {
    id: "quiz-9",
    question: "What is the main purpose of Redux?",
    options: [
      "Styling components",
      "Routing between pages",
      "State management across the application",
      "Making API calls",
    ],
    correctAnswerIndex: 2,
  },
  "lesson-11": {
    id: "quiz-11",
    question: "Which library is commonly used for testing React components?",
    options: [
      "Jest",
      "React Testing Library",
      "Both Jest and React Testing Library",
      "Cypress only",
    ],
    correctAnswerIndex: 2,
  },
};

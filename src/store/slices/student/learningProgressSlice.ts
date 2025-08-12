import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LessonProgress {
  lessonId: string;
  sectionId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  quizScore?: number;
}

interface LearningProgressState {
  completedLessons: Record<string, LessonProgress>; // keyed by lessonId
  currentCourseProgress: Record<string, number>; // keyed by courseId, value is progress percentage
}

const initialState: LearningProgressState = {
  completedLessons: {},
  currentCourseProgress: {},
};

const learningProgressSlice = createSlice({
  name: "learningProgress",
  initialState,
  reducers: {
    markLessonCompleted: (state, action: PayloadAction<LessonProgress>) => {
      const { lessonId } = action.payload;
      state.completedLessons[lessonId] = {
        ...action.payload,
        isCompleted: true,
        completedAt: action.payload.completedAt || new Date().toISOString(),
      };
    },

    updateQuizScore: (
      state,
      action: PayloadAction<{ lessonId: string; score: number }>
    ) => {
      const { lessonId, score } = action.payload;
      if (state.completedLessons[lessonId]) {
        state.completedLessons[lessonId].quizScore = score;
      }
    },

    updateCourseProgress: (
      state,
      action: PayloadAction<{ courseId: string; progress: number }>
    ) => {
      const { courseId, progress } = action.payload;
      state.currentCourseProgress[courseId] = progress;
    },

    resetLearningProgress: (state) => {
      state.completedLessons = {};
      state.currentCourseProgress = {};
    },

    // Batch update from API data
    syncProgressFromAPI: (
      state,
      action: PayloadAction<{
        courseId: string;
        lessons: Array<{
          id: string;
          sectionId: string;
          isCompleted: boolean;
          completedAt?: string;
        }>;
        progress: number;
      }>
    ) => {
      const { courseId, lessons, progress } = action.payload;

      // Update course progress
      state.currentCourseProgress[courseId] = progress;

      // Update individual lesson progress
      lessons.forEach((lesson) => {
        if (lesson.isCompleted) {
          state.completedLessons[lesson.id] = {
            lessonId: lesson.id,
            sectionId: lesson.sectionId,
            courseId,
            isCompleted: true,
            completedAt: lesson.completedAt,
          };
        }
      });
    },
  },
});

export const {
  markLessonCompleted,
  updateQuizScore,
  updateCourseProgress,
  resetLearningProgress,
  syncProgressFromAPI,
} = learningProgressSlice.actions;

export default learningProgressSlice.reducer;

// Selectors
export const selectLessonProgress = (
  state: { learningProgress: LearningProgressState },
  lessonId: string
) => state.learningProgress.completedLessons[lessonId];

export const selectCourseProgress = (
  state: { learningProgress: LearningProgressState },
  courseId: string
) => state.learningProgress.currentCourseProgress[courseId] || 0;

export const selectCompletedLessonsForCourse = (
  state: { learningProgress: LearningProgressState },
  courseId: string
) =>
  Object.values(state.learningProgress.completedLessons).filter(
    (lesson) => lesson.courseId === courseId
  );

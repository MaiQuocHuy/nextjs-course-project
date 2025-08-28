import { useMemo } from "react";
import {
  useGetQuizResultsQuery,
  useGetQuizResultDetailsQuery,
} from "@/services/student/studentApi";

export const useQuizResults = () => {
  return useGetQuizResultsQuery();
};

export const useQuizResultDetails = (
  quizResultId: string,
  enabled: boolean = true
) => {
  return useGetQuizResultDetailsQuery(quizResultId, {
    skip: !enabled || !quizResultId,
  });
};

export const useQuizResultsStats = () => {
  const {
    data: quizResults,
    isLoading,
    error,
    refetch,
  } = useGetQuizResultsQuery();

  const stats = useMemo(() => {
    if (!quizResults?.content) {
      return {
        totalQuizzes: 0,
        passedQuizzes: 0,
        failedQuizzes: 0,
        averageScore: 0,
        highestScore: 0,
      };
    }

    const results = quizResults.content;
    const totalQuizzes = results.length;

    // Calculate pass/fail based on score (>=80% = pass, <80% = fail)
    const passedQuizzes = results.filter((result) => result.score >= 80).length;
    const failedQuizzes = results.filter((result) => result.score < 80).length;

    // Calculate average score using API score
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;

    // Calculate highest score using API score
    const highestScore = results.reduce(
      (max, result) => Math.max(max, result.score),
      0
    );

    return {
      totalQuizzes,
      passedQuizzes,
      failedQuizzes,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal place
      highestScore: Math.round(highestScore * 10) / 10,
    };
  }, [quizResults]);

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};

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

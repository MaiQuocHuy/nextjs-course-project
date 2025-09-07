import { useEffect, useState } from 'react';

import SectionsLessonsManager2 from '../create-course/create-lessons/CourseContent';
import { useGetSectionsQuery } from '@/services/instructor/courses/sections-api';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { SectionDetail } from '@/types/instructor/courses';
import { createFileFromUrl } from '@/utils/instructor/course/create-file';
import { SectionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import { Button } from '@/components/ui/button';

interface CourseContentProps {
  courseId: string;
}

const CourseContent = ({ courseId }: CourseContentProps) => {
  const {
    data: sections,
    isLoading: isFetchingSections,
    isError,
  } = useGetSectionsQuery(courseId);

  const [updatedSections, setUpdatedSections] = useState<SectionType[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [createContent, setCreateContent] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  // Loading animation
  useEffect(() => {
    if (isFetchingSections || isSettingUp) {
      loadingAnimation(true, dispatch);
    } else {
      loadingAnimation(false, dispatch);
    }
    return () => {
      loadingAnimation(false, dispatch);
    };
  }, [isFetchingSections, isSettingUp]);

  // Normalize data
  useEffect(() => {
    const fetchFiles = async () => {
      if (sections && sections.length > 0) {
        setIsSettingUp(true);
        const updatedSections = await Promise.all(
          sections.map(async (section: SectionDetail) => ({
            ...section,
            lessons: await Promise.all(
              section.lessons.map(async (lesson) => ({
                ...lesson,
                // Add video file creation
                video: lesson.video && {
                  // ...lesson.video,
                  file: await createFileFromUrl(
                    lesson.video.url,
                    lesson.video.title
                  ),
                },
                // Add orderIndex
                orderIndex: lesson.order,
                quiz: lesson.quiz &&
                  lesson.quiz.questions &&
                  lesson.quiz.questions.length > 0 && {
                    ...lesson.quiz,
                    questions: lesson.quiz.questions.map((q, index) => ({
                      ...q,
                      // Add quiz question orderIndex
                      orderIndex: index,
                    })),
                  },
              }))
            ),
          }))
        );
        setUpdatedSections(updatedSections);
        setIsSettingUp(false);
      }
    };
    fetchFiles();
  }, [sections]);

  if (isFetchingSections || isSettingUp) {
    return <></>;
  }

  if (isError) {
    return <p>Error fetching course content!</p>;
  }

  return (
    <>
      {updatedSections && updatedSections.length > 0 ? (
        courseId && (
          <CreateCourseContentForm
            courseId={courseId}
            sections={updatedSections}
            mode="view"
          />
        )
      ) : (
        <>
          {createContent ? (
            courseId && (
              <CreateCourseContentForm courseId={courseId} mode="create" />
            )
          ) : (
            <>
              <div className="text-center space-y-4">
                <p>No content available</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCreateContent(true);
                    setHasContent(false);
                  }}
                >
                  Create Content
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default CourseContent;

const CreateCourseContentForm = ({
  courseId,
  sections,
  mode,
}: {
  courseId: string;
  sections?: SectionType[];
  mode: 'create' | 'view';
}) => {
  return (
    <SectionsLessonsManager2
      courseId={courseId}
      mode={mode}
      sections={sections}
      canEditContent={true}
    />
  );
};

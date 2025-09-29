import { useEffect, useState } from 'react';

import CourseContent from '../create-course/create-lessons/CourseContent';
import { useGetSectionsQuery } from '@/services/instructor/courses/sections-api';
import { SectionDetail } from '@/types/instructor/courses/course-details';
import { createFileFromUrl } from '@/utils/instructor/course/create-file';
import { SectionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import { Button } from '@/components/ui/button';
import CourseContentSkeleton from './skeletons/CourseContentSkeleton';
import { useParams } from 'next/navigation';
import { useGetCourseByIdQuery } from '@/services/instructor/courses/courses-api';
import { ErrorComponent } from '../../commom/ErrorComponent';

const CourseContentPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: courseInfo,
    isLoading: isCourseLoading,
    isError: isErrorLoadingCourse,
    refetch: refetchCourseInfo,
  } = useGetCourseByIdQuery(id, { skip: !id });

  const {
    data: sections,
    isLoading: isSectionsLoading,
    isError: isErrorLoadingSections,
    refetch: refetchSections,
  } = useGetSectionsQuery(id, { skip: !id });

  const [updatedSections, setUpdatedSections] = useState<SectionType[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [createContent, setCreateContent] = useState(false);

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

  const handleRefetch = async () => {
    if (id) {
      await refetchSections();
      await refetchCourseInfo();
    }
  };

  if (isCourseLoading || isSectionsLoading || isSettingUp) {
    return <CourseContentSkeleton />;
  }

  if (isErrorLoadingSections || isErrorLoadingCourse) {
    return (
      <ErrorComponent
        title="Course Content"
        message="Error fetching course content!"
        onRetry={handleRefetch}
      />
    );
  }

  return (
    <>
      {id && (
        <>
          {updatedSections && updatedSections.length > 0 ? (
            <CreateCourseContentForm
              courseId={id}
              sections={updatedSections}
              mode="view"
              canEditContent={courseInfo && courseInfo.approved ? false : true}
            />
          ) : (
            <>
              {createContent ? (
                <CreateCourseContentForm
                  courseId={id}
                  mode="create"
                  canEditContent={true}
                />
              ) : (
                <>
                  <div className="text-center space-y-4">
                    <p>No content available</p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCreateContent(true);
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
      )}
    </>
  );
};

export default CourseContentPage;

const CreateCourseContentForm = ({
  courseId,
  sections,
  mode,
  canEditContent = false,
}: {
  courseId: string;
  sections?: SectionType[];
  mode: 'create' | 'view';
  canEditContent: boolean;
}) => {
  return (
    <CourseContent
      courseId={courseId}
      mode={mode}
      sections={sections}
      canEditContent={canEditContent}
    />
  );
};

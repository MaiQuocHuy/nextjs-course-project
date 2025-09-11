import { useEffect, useState } from 'react';

import CourseContent from '../create-course/create-lessons/CourseContent';
import { useGetSectionsQuery } from '@/services/instructor/courses/sections-api';
import { SectionDetail } from '@/types/instructor/courses/course-details';
import { createFileFromUrl } from '@/utils/instructor/course/create-file';
import { SectionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import { Button } from '@/components/ui/button';
import CourseContentSkeleton from './skeletons/CourseContentSkeleton';
import { useParams } from 'next/navigation';

const CourseContentPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: sections,
    isLoading: isFetchingSections,
    isError,
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

  if (isFetchingSections || isSettingUp) {
    return <CourseContentSkeleton />;
  }

  if (isError) {
    return <p>Error fetching course content!</p>;
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
            />
          ) : (
            <>
              {createContent ? (
                <CreateCourseContentForm courseId={id} mode="create" />
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
}: {
  courseId: string;
  sections?: SectionType[];
  mode: 'create' | 'view';
}) => {
  return (
    <CourseContent
      courseId={courseId}
      mode={mode}
      sections={sections}
      canEditContent={true}
    />
  );
};
